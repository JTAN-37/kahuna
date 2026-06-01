from typing import Optional

import pandas as pd
import yfinance as yf
import anthropic

_client: Optional[anthropic.Anthropic] = None

def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic()
    return _client

_SYSTEM_TEMPLATE = """\
You are a financial analyst. Given the financial data below, respond in exactly this structure — no more, no less:

**Revenue & Growth**
[2–3 sentences. State the most recent revenue figure, YoY growth rate, and whether growth is accelerating or decelerating.]

**Margins**
[2–3 sentences. Cover gross margin, operating margin, and net margin. Note any meaningful trend.]

**Balance Sheet**
[2–3 sentences. Cover cash position, total debt, and whether the balance sheet is a strength or concern.]

**Cash Flow**
[2–3 sentences. Cover operating cash flow and free cash flow. Note if earnings quality is high or low.]

**Verdict**
[2–3 sentences. State the overall financial health in plain terms, the single biggest strength, and the single biggest risk.]

Rules:
- Use specific numbers from the data. Never describe a trend without a figure.
- No disclaimers. No "consult a financial advisor." No hedging language.
- If data for a section is missing, write "Data unavailable." and move on.
- Total response: 250–300 words.

---
{financial_data}"""


def _fmt_val(val) -> str:
    if pd.isna(val):
        return "N/A"
    abs_val = abs(val)
    if abs_val >= 1e9:
        return f"${val / 1e9:.1f}B"
    if abs_val >= 1e6:
        return f"${val / 1e6:.0f}M"
    return f"${val:,.0f}"


def _get_row(df: pd.DataFrame, *names: str) -> Optional[pd.Series]:
    for name in names:
        if name in df.index:
            return df.loc[name]
    return None


def _df_to_section(label: str, df: pd.DataFrame, row_specs: list[tuple]) -> str:
    if df is None or df.empty:
        return f"### {label}\nData unavailable.\n"

    cols = df.columns[:4]
    col_labels = [str(c.date()) for c in cols]

    lines = [
        f"### {label}",
        "| Metric | " + " | ".join(col_labels) + " |",
        "|---|" + "---|" * len(cols),
    ]

    for display_name, *yf_names in row_specs:
        series = _get_row(df, *yf_names)
        if series is not None:
            values = [_fmt_val(series.get(c, float("nan"))) for c in cols]
            lines.append(f"| {display_name} | " + " | ".join(values) + " |")

    return "\n".join(lines) + "\n"


def _fetch_financials(ticker: str) -> str:
    t = yf.Ticker(ticker)

    income = _df_to_section("Income Statement (Quarterly)", t.quarterly_financials, [
        ("Total Revenue",     "Total Revenue",    "Revenue"),
        ("Gross Profit",      "Gross Profit"),
        ("Operating Income",  "Operating Income", "EBIT"),
        ("Net Income",        "Net Income",       "Net Income Common Stockholders"),
    ])

    balance = _df_to_section("Balance Sheet (Quarterly)", t.quarterly_balance_sheet, [
        ("Cash & Equivalents", "Cash And Cash Equivalents", "Cash Cash Equivalents And Short Term Investments"),
        ("Total Debt",         "Total Debt"),
        ("Total Assets",       "Total Assets"),
        ("Stockholders Equity","Stockholders Equity", "Common Stock Equity"),
    ])

    cashflow = _df_to_section("Cash Flow (Quarterly)", t.quarterly_cashflow, [
        ("Operating Cash Flow", "Operating Cash Flow", "Cash Flow From Continuing Operating Activities"),
        ("Capital Expenditure", "Capital Expenditure"),
        ("Free Cash Flow",      "Free Cash Flow"),
    ])

    return "\n".join([income, balance, cashflow])


def stream_analysis(ticker: str, name: str, sector: str):
    financial_data = _fetch_financials(ticker)
    system_content = _SYSTEM_TEMPLATE.format(financial_data=financial_data)

    with _get_client().messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=600,
        system=[{
            "type": "text",
            "text": system_content,
            "cache_control": {"type": "ephemeral"},
        }],
        messages=[{"role": "user", "content": f"Analyze {ticker} ({name}, {sector})."}],
    ) as stream:
        for text in stream.text_stream:
            yield text

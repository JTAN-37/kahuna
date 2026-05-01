import yfinance as yf

from utils.tickers import normalize_ticker, logo_url_for


def fetch_stock_data(ticker: str) -> dict:
    ticker = normalize_ticker(ticker)
    t = yf.Ticker(ticker)
    info = t.info

    name = info.get("longName") or info.get("shortName", ticker)
    price = info.get("currentPrice") or info.get("regularMarketPrice")
    market_cap = info.get("marketCap")
    pe_ratio = info.get("trailingPE")
    week_high = info.get("fiftyTwoWeekHigh")
    week_low = info.get("fiftyTwoWeekLow")
    sector = info.get("sector", "N/A")
    website = info.get("website", "")

    domain = ""
    if website:
        domain = (
            website.replace("https://", "")
            .replace("http://", "")
            .replace("www.", "")
            .split("/")[0]
        )

    hist_today = t.history(period="1d", interval="1m")
    hist_week = t.history(period="5d", interval="1d")
    hist_month = t.history(period="1mo", interval="1d")

    def df_to_chart(df):
        if df.empty:
            return {"labels": [], "prices": []}
        return {
            "labels": [str(ts) for ts in df.index],
            "prices": [round(float(c), 2) for c in df["Close"]],
        }

    return {
        "ticker": ticker,
        "name": name,
        "price": price,
        "market_cap": market_cap,
        "pe_ratio": pe_ratio,
        "week_high": week_high,
        "week_low": week_low,
        "sector": sector,
        "domain": domain,
        "logo_url": logo_url_for(ticker),
        "fallback_logo_url": f"https://www.google.com/s2/favicons?domain={domain}&sz=128" if domain else None,
        "chart_today": df_to_chart(hist_today),
        "chart_week": df_to_chart(hist_week),
        "chart_month": df_to_chart(hist_month),
    }

import asyncio

import yfinance as yf
from fastapi import APIRouter, HTTPException

from backend.services.sp500 import SP500, VALID_TICKERS
from backend.utils.tickers import normalize_ticker, logo_url_for

router = APIRouter()


def _df_to_chart(df):
    if df.empty:
        return {"labels": [], "prices": []}
    return {
        "labels": [str(ts) for ts in df.index],
        "prices": [round(float(c), 2) for c in df["Close"]],
    }


@router.get("/api/sp500")
def get_sp500():
    return SP500


@router.get("/api/stock/{ticker}")
async def get_stock(ticker: str):
    ticker = normalize_ticker(ticker)
    if ticker not in VALID_TICKERS:
        raise HTTPException(status_code=400, detail="Invalid ticker")

    loop = asyncio.get_running_loop()

    def _fetch():
        t = yf.Ticker(ticker)
        info = t.info

        name = info.get("longName") or info.get("shortName", ticker)
        domain = ""
        website = info.get("website", "")
        if website:
            domain = (
                website.replace("https://", "")
                .replace("http://", "")
                .replace("www.", "")
                .split("/")[0]
            )

        return {
            "ticker": ticker,
            "name": name,
            "price": info.get("currentPrice") or info.get("regularMarketPrice"),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "week_high": info.get("fiftyTwoWeekHigh"),
            "week_low": info.get("fiftyTwoWeekLow"),
            "sector": info.get("sector", "N/A"),
            "domain": domain,
            "logo_url": logo_url_for(ticker),
            "fallback_logo_url": f"https://www.google.com/s2/favicons?domain={domain}&sz=128" if domain else None,
            "chart_today": _df_to_chart(t.history(period="1d", interval="1m")),
            "chart_week": _df_to_chart(t.history(period="5d", interval="1d")),
            "chart_month": _df_to_chart(t.history(period="1mo", interval="1d")),
        }

    return await loop.run_in_executor(None, _fetch)

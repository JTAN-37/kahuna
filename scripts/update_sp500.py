"""
Run this script manually to refresh data/sp500.json with the current S&P 500 constituents:

    python scripts/update_sp500.py
"""

import json
import sys
from io import StringIO
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import pandas as pd
import requests

from backend.utils.tickers import normalize_ticker

_WIKI_URL = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
_WIKI_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; kahuna-stock-app/1.0)"}
_OUTPUT = Path(__file__).parent.parent / "data" / "sp500.json"


def fetch() -> list[dict]:
    r = requests.get(_WIKI_URL, headers=_WIKI_HEADERS, timeout=15)
    r.raise_for_status()
    df = pd.read_html(StringIO(r.text), attrs={"id": "constituents"})[0]
    return [
        {
            "ticker": normalize_ticker(row["Symbol"]),
            "name": str(row["Security"]).strip(),
        }
        for _, row in df.iterrows()
    ]


if __name__ == "__main__":
    print("Fetching S&P 500 constituents from Wikipedia...")
    stocks = fetch()
    _OUTPUT.write_text(json.dumps(stocks, indent=2))
    print(f"Saved {len(stocks)} stocks to {_OUTPUT}")

import json
from pathlib import Path

from backend.utils.tickers import normalize_ticker, logo_url_for

_SP500_FILE = Path(__file__).parent.parent.parent / "data" / "sp500.json"

SP500 = []

try:
    SP500 = [
        {"ticker": ticker, "name": entry["name"], "logo_url": logo_url_for(ticker)}
        for entry in json.loads(_SP500_FILE.read_text())
        for ticker in [normalize_ticker(entry["ticker"])]
    ]
except FileNotFoundError:
    print("[kahuna] sp500.json not found — run scripts/update_sp500.py to generate it.")
except Exception as e:
    print(f"[kahuna] Could not load sp500.json: {e}")

VALID_TICKERS = {s["ticker"] for s in SP500}

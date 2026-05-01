import json
from pathlib import Path

from utils.tickers import normalize_ticker

_SP500_FILE = Path(__file__).parent.parent / "data" / "sp500.json"

SP500 = []
SP500_ERROR = None

try:
    SP500 = [
        {**entry, "ticker": normalize_ticker(entry["ticker"])}
        for entry in json.loads(_SP500_FILE.read_text())
    ]
except FileNotFoundError:
    SP500_ERROR = "sp500.json not found. Run 'python scripts/update_sp500.py' to generate it."
    print(f"[kahuna] {SP500_ERROR}")
except Exception as _e:
    SP500_ERROR = f"Could not load sp500.json: {_e}"
    print(f"[kahuna] {SP500_ERROR}")

VALID_TICKERS = {s["ticker"] for s in SP500}

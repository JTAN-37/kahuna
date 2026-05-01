import json

from flask import Flask, render_template, request

from services.sp500 import SP500, SP500_ERROR, VALID_TICKERS
from services.watchlist import add_stock_to_watchlist, get_active_ticker, parse_stocks_state
from utils.formatters import register_filters
from utils.tickers import normalize_ticker

app = Flask(__name__)
register_filters(app)

@app.route("/", methods=["GET", "POST"])
def index():
    stocks = []
    active = None
    error = SP500_ERROR

    if request.method == "POST" and not SP500_ERROR:
        ticker_input = normalize_ticker(request.form.get("ticker", ""))
        stocks = parse_stocks_state(request.form.get("stocks_state"))
        stocks, error = add_stock_to_watchlist(ticker_input, stocks, VALID_TICKERS)
        active = get_active_ticker(ticker_input, stocks)

    return render_template(
        "index.html",
        sp500=SP500,
        stocks=stocks,
        active=active,
        stocks_json=json.dumps(stocks),
        error=error,
    )

if __name__ == "__main__":
    app.run(debug=True, port=5001)

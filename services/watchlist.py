import json

from services.stocks import fetch_stock_data


def parse_stocks_state(raw):
    try:
        return json.loads(raw or "[]")
    except (json.JSONDecodeError, ValueError):
        return []

def get_stock_tickers(stocks):
    return [s["ticker"] for s in stocks]

def get_active_ticker(ticker_input, stocks):
    tickers = get_stock_tickers(stocks)
    if ticker_input in tickers:
        return ticker_input
    return tickers[-1] if tickers else None


def add_stock_to_watchlist(ticker_input, stocks, valid_tickers):
    if not ticker_input or ticker_input in get_stock_tickers(stocks):
        return stocks, None
    if ticker_input not in valid_tickers:
        return stocks, f"'{ticker_input}' is not in the S&P 500. Please select a valid ticker."
    try:
        data = fetch_stock_data(ticker_input)
        stocks.append(data)
        return stocks, None
    except Exception:
        return stocks, f"Could not fetch data for '{ticker_input}'. Please try again."

_LOGO_URL = "https://assets.parqet.com/logos/symbol/{ticker}?format=png"

def normalize_ticker(ticker: str) -> str:
    return str(ticker).strip().upper().replace(".", "-")

def logo_url_for(ticker: str) -> str:
    return _LOGO_URL.format(ticker=normalize_ticker(ticker))

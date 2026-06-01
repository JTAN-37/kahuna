# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

### Backend (FastAPI)
```bash
source venv/bin/activate
pip install -r requirements.txt
python -m backend.main
# → http://127.0.0.1:8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173  (proxies /api to :8000)
```

Run both servers simultaneously during development.

### Production build
```bash
cd frontend && npm run build
# FastAPI serves frontend/dist automatically at http://localhost:8000
```

## Architecture

FastAPI backend + React 18 / Vite frontend. No SSR.

**Backend** (`backend/`)
- `main.py` — FastAPI app, mounts `frontend/dist` for production
- `routers/stocks.py` — `GET /api/sp500`, `GET /api/stock/{ticker}`
- `routers/analysis.py` — `GET /api/analyze/{ticker}` (streaming)
- `services/analysis.py` — Anthropic streaming with prompt caching
- `services/sp500.py` — loads S&P 500 list from `data/sp500.json`
- `utils/tickers.py` — `normalize_ticker`, `logo_url_for`
- All yfinance calls wrapped in `run_in_executor` (blocking → async)

**Frontend** (`frontend/src/`)
- `main.jsx` — QueryClient config, app mount
- `App.jsx` — layout shell
- `components/` — Navbar, Sidebar, SidebarTab, StockPanel, StockChart, AnalysisCard, StockLogo, Icons
- `hooks/` — useSP500, useStockData, useAnalysis
- `store/watchlist.js` — Zustand: tickers, activeTicker, pinnedTickers, sidebarOpen
- `utils/formatters.js` — fmtPrice, fmtCap, fmtPE

**Layout:** `body (flex col)` → navbar + `content-wrapper (flex row)` → sidebar (220px) + main (flex 1).

## Dependencies

Python: add to `requirements.txt` and `pip install -r requirements.txt`.
Node: `cd frontend && npm install <pkg>`.
The `venv/` and `frontend/node_modules/` directories are local and not committed.

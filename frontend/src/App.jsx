import { useWatchlist } from './store/watchlist'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { StockPanel } from './components/StockPanel'

function EmptyState() {
  return (
    <div className="search-area">
      <div className="logo-placeholder">K</div>
      <p className="prompt-text">Select a stock to begin analysis.</p>
    </div>
  )
}

export default function App() {
  const { tickers, activeTicker } = useWatchlist()
  const hasStocks = tickers.length > 0

  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className={`main-content${hasStocks ? ' has-stocks' : ''}${hasStocks && !activeTicker ? ' new-tab-mode' : ''}`}>
          {(!hasStocks || !activeTicker) && <EmptyState />}
          {hasStocks && (
            <div className="stock-panels">
              {tickers.map(ticker => (
                <StockPanel
                  key={ticker}
                  ticker={ticker}
                  isActive={ticker === activeTicker}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

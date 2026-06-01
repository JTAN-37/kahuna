import { useStockData } from '../hooks/useStockData'
import { StockLogo } from './StockLogo'
import { StockChart } from './StockChart'
import { AnalysisCard } from './AnalysisCard'
import { fmtPrice, fmtCap, fmtPE } from '../utils/formatters'
import './StockPanel.css'

const INFO_CARDS = [
  { label: 'Current Price', key: 'price',      fmt: fmtPrice },
  { label: 'Market Cap',    key: 'market_cap', fmt: fmtCap },
  { label: 'P/E Ratio',     key: 'pe_ratio',   fmt: fmtPE },
  { label: '52-Week High',  key: 'week_high',  fmt: fmtPrice },
  { label: '52-Week Low',   key: 'week_low',   fmt: fmtPrice },
  { label: 'Sector',        key: 'sector',     fmt: v => v ?? 'N/A' },
]

export function StockPanel({ ticker, isActive }) {
  const { data: stock, isLoading, isError } = useStockData(ticker)
  const cls = `stock-panel${isActive ? ' active' : ''}`

  if (isLoading) {
    return (
      <div className={cls}>
        <section className="info-section">
          <div className="analysis-loading">
            <div className="analysis-spinner" />
            <span>Loading {ticker}…</span>
          </div>
        </section>
      </div>
    )
  }

  if (isError || !stock) {
    return (
      <div className={cls}>
        <section className="info-section">
          <span className="analysis-error">Failed to load {ticker}.</span>
        </section>
      </div>
    )
  }

  return (
    <div className={cls}>
      <section className="info-section">
        <div className="info-header">
          <StockLogo
            primary={stock.logo_url}
            fallback1={stock.fallback_logo_url}
            fallback2="/default-logo.png"
            alt={ticker}
            className="info-logo"
          />
          <div>
            <h1 className="info-company-name">{stock.name}</h1>
            <span className="info-ticker-badge">{stock.ticker}</span>
          </div>
        </div>
        <div className="info-grid">
          {INFO_CARDS.map(card => (
            <div className="info-card" key={card.label}>
              <span className="info-card-label">{card.label}</span>
              <span className="info-card-value">{card.fmt(stock[card.key])}</span>
            </div>
          ))}
        </div>
      </section>

      <StockChart stock={stock} />

      <AnalysisCard ticker={ticker} name={stock.name} sector={stock.sector} />
    </div>
  )
}

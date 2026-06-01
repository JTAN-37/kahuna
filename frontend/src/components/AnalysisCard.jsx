import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAnalysis } from '../hooks/useAnalysis'
import './AnalysisCard.css'

const TABS = [
  { id: 'overall', label: 'Overall' },
  { id: 'income',  label: 'Income Statement' },
  { id: 'balance', label: 'Balance Sheet' },
  { id: 'cashflow', label: 'Cash Flow' },
]

export function AnalysisCard({ ticker, name, sector }) {
  const [activeTab, setActiveTab] = useState('overall')
  const { text, loading, error } = useAnalysis(ticker, { name, sector })

  return (
    <div className="analysis-card">
      <h2 className="analysis-title">AI Financial Analysis</h2>
      <div className="panel-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`panel-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="panel-tab-content active">
        {activeTab === 'overall' ? (
          <div className={`analysis-body${text ? ' analysis-ready' : ''}`}>
            {loading && (
              <div className="analysis-loading">
                <div className="analysis-spinner" />
                <span>Generating analysis…</span>
              </div>
            )}
            {error && <span className="analysis-error">{error}</span>}
            {text && <ReactMarkdown>{text}</ReactMarkdown>}
          </div>
        ) : (
          <p className="panel-placeholder">Coming soon</p>
        )}
      </div>
    </div>
  )
}

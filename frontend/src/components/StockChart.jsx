import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js'
import './StockChart.css'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

function buildChartData(stock, period) {
  const src =
    period === 'today' ? stock.chart_today
    : period === 'week' ? stock.chart_week
    : stock.chart_month

  const labels = (src?.labels ?? []).map(raw => {
    const d = new Date(raw)
    return period === 'today'
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  })
  return { labels, prices: src?.prices ?? [] }
}

function dateRangeLabel(period) {
  const today = new Date()
  const fmt = d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  if (period === 'today') return fmt(today)
  const start = new Date(today)
  if (period === 'week') start.setDate(start.getDate() - 7)
  else start.setMonth(start.getMonth() - 1)
  return `${fmt(start)} – ${fmt(today)}`
}

export function StockChart({ stock }) {
  const [period, setPeriod] = useState('today')
  const { labels, prices } = buildChartData(stock, period)
  const up = prices.length === 0 || prices[prices.length - 1] >= prices[0]
  const lineColor = up ? '#16a34a' : '#dc2626'
  const fillColor = up ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)'

  const data = {
    labels,
    datasets: [{
      label: `${stock.ticker} Price`,
      data: prices,
      borderColor: lineColor,
      backgroundColor: fillColor,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: true,
      tension: 0.3,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: { label: ctx => '$' + ctx.parsed.y.toFixed(2) },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: period === 'today'
          ? {
              font: { size: 11 },
              autoSkip: false,
              maxRotation: 0,
              callback(value) {
                const label = this.getLabelForValue(value)
                return label && label.includes(':00') ? label : null
              },
            }
          : { maxTicksLimit: 8, font: { size: 11 } },
      },
      y: {
        grid: { color: '#f0f0f0' },
        ticks: { font: { size: 11 }, callback: v => '$' + v.toFixed(2) },
      },
    },
  }

  return (
    <section className="chart-section">
      <div className="chart-header">
        <div className="chart-tabs" role="tablist">
          {['today', 'week', 'month'].map(p => (
            <button
              key={p}
              className={`chart-tab${period === p ? ' active' : ''}`}
              role="tab"
              onClick={() => setPeriod(p)}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'Last Week' : 'Last Month'}
            </button>
          ))}
        </div>
        <span className="chart-date-range">{dateRangeLabel(period)}</span>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </section>
  )
}

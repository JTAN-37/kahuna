const chartInstances = {};

function buildChartData(stock, period) {
  const src = period === 'today' ? stock.chart_today
            : period === 'week'  ? stock.chart_week
            : stock.chart_month;
  const labels = src.labels.map(raw => {
    const d = new Date(raw);
    return period === 'today'
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  });
  return { labels, prices: src.prices };
}

function renderChart(ticker, period) {
  const stock = window.KAHUNA.stocks.find(s => s.ticker === ticker);
  if (!stock) return;
  const canvas = document.getElementById('chart-' + ticker);
  if (!canvas) return;
  if (chartInstances[ticker]) chartInstances[ticker].destroy();
  const { labels, prices } = buildChartData(stock, period);
  const up = prices.length === 0 || prices[prices.length - 1] >= prices[0];
  const lineColor = up ? '#16a34a' : '#dc2626';
  const fillColor = up ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)';

  chartInstances[ticker] = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: ticker + ' Price',
        data: prices,
        borderColor: lineColor,
        backgroundColor: fillColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: { label: ctx => '$' + ctx.parsed.y.toFixed(2) }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: period === 'today'
            ? {
                font: { size: 11 },
                autoSkip: false,
                maxRotation: 0,
                callback: function(value) {
                  const label = this.getLabelForValue(value);
                  return label && label.includes(':00') ? label : null;
                }
              }
            : { maxTicksLimit: 8, font: { size: 11 } }
        },
        y: {
          grid: { color: '#f0f0f0' },
          ticks: { font: { size: 11 }, callback: v => '$' + v.toFixed(2) }
        }
      }
    }
  });
}

function chartDateRangeLabel(period) {
  const today = new Date();
  const fmt = d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  if (period === 'today') return fmt(today);
  const start = new Date(today);
  if (period === 'week') start.setDate(start.getDate() - 7);
  else start.setMonth(start.getMonth() - 1);
  return `${fmt(start)} – ${fmt(today)}`;
}

function updateChartTitle(ticker, period) {
  const el = document.getElementById('chart-title-' + ticker);
  if (el) el.textContent = chartDateRangeLabel(period);
}

function switchChartPeriod(btn, ticker, period) {
  btn.closest('.chart-tabs').querySelectorAll('.chart-tab')
    .forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderChart(ticker, period);
  updateChartTitle(ticker, period);
}

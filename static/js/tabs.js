function switchToStock(ticker) {
  document.getElementById('main-content').classList.remove('new-tab-mode');
  document.querySelectorAll('.stock-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + ticker);
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.sidebar-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.ticker === ticker)
  );
  window.KAHUNA.active = ticker;
  if (!chartInstances[ticker]) {
    renderChart(ticker, 'today');
    updateChartTitle(ticker, 'today');
  }
}

function closeTab(e, ticker) {
  e.stopPropagation();

  const tab = document.querySelector(`.sidebar-tab[data-ticker="${ticker}"]`);
  const wasActive = tab && tab.classList.contains('active');

  if (tab) tab.remove();
  const panel = document.getElementById('panel-' + ticker);
  if (panel) panel.remove();

  if (chartInstances[ticker]) {
    chartInstances[ticker].destroy();
    delete chartInstances[ticker];
  }

  window.KAHUNA.stocks = window.KAHUNA.stocks.filter(s => s.ticker !== ticker);
  document.getElementById('stocks-state-field').value = JSON.stringify(window.KAHUNA.stocks);

  if (wasActive) {
    const remaining = document.querySelectorAll('.sidebar-tab');
    if (remaining.length > 0) {
      switchToStock(remaining[remaining.length - 1].dataset.ticker);
    } else {
      addNewTab();
    }
  }
}

function addNewTab() {
  document.querySelectorAll('.stock-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  const main = document.getElementById('main-content');
  main.classList.add('new-tab-mode');
  window.KAHUNA.active = null;
  document.getElementById('ticker-input').value = '';

  // Re-trigger fade-in animation on logo and prompt text
  ['.logo-placeholder', '.prompt-text'].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight; // force reflow
    el.style.animation = '';
  });

  document.getElementById('ticker-input').focus();
}

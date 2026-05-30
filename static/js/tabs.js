// ── Cached DOM refs ──────────────────────────────────────────────────────────
const dom = {
  get sidebarTabs()    { return document.getElementById('sidebar-tabs'); },
  get stocksField()    { return document.getElementById('stocks-state-field'); },
  get mainContent()    { return document.getElementById('main-content'); },
  get dropdown()       { return document.getElementById('tab-dropdown'); },
  get pinLabel()       { return document.getElementById('tab-menu-pin-label'); },
  get tickerInput()    { return document.getElementById('ticker-input'); },
};

// ── Shared state ─────────────────────────────────────────────────────────────
const tabState = { menuTicker: null };

// ── Helpers ──────────────────────────────────────────────────────────────────
function findStock(ticker)  { return window.KAHUNA.stocks.find(s => s.ticker === ticker); }
function findTab(ticker)    { return document.querySelector(`.sidebar-tab[data-ticker="${ticker}"]`); }
function findPanel(ticker)  { return document.getElementById('panel-' + ticker); }

function syncStocksState() {
  dom.stocksField.value = JSON.stringify(window.KAHUNA.stocks);
}

function destroyChart(ticker) {
  if (chartInstances[ticker]) {
    chartInstances[ticker].destroy();
    delete chartInstances[ticker];
  }
}

function activateFallbackTab() {
  const remaining = dom.sidebarTabs.querySelectorAll('.sidebar-tab');
  if (remaining.length > 0) {
    switchToStock(remaining[remaining.length - 1].dataset.ticker);
  } else {
    addNewTab();
  }
}

// ── Dropdown ─────────────────────────────────────────────────────────────────
function toggleTabMenu(e, ticker) {
  e.stopPropagation();
  const { dropdown } = dom;
  const alreadyOpen = tabState.menuTicker === ticker && !dropdown.hidden;

  closeDropdown();
  if (alreadyOpen) return;

  tabState.menuTicker = ticker;
  dom.pinLabel.textContent = findStock(ticker)?.pinned ? 'Unpin tab' : 'Pin tab';

  const rect = e.currentTarget.getBoundingClientRect();
  dropdown.style.top  = (rect.bottom + 4) + 'px';
  dropdown.style.left = rect.left + 'px';
  dropdown.hidden = false;
}

function menuPinTab() {
  if (tabState.menuTicker) pinTab(tabState.menuTicker);
  closeDropdown();
}

function menuDeleteTab() {
  if (tabState.menuTicker) deleteTab(tabState.menuTicker);
  closeDropdown();
}

function closeDropdown() {
  dom.dropdown.hidden = true;
  tabState.menuTicker = null;
}

document.addEventListener('click', (e) => {
  if (!dom.dropdown.hidden && !dom.dropdown.contains(e.target)) {
    closeDropdown();
  }
});

// ── Tab operations ────────────────────────────────────────────────────────────
function switchToStock(ticker) {
  dom.mainContent.classList.remove('new-tab-mode');
  document.querySelectorAll('.stock-panel').forEach(p => p.classList.remove('active'));
  findPanel(ticker)?.classList.add('active');
  document.querySelectorAll('.sidebar-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.ticker === ticker)
  );
  window.KAHUNA.active = ticker;
  if (!chartInstances[ticker]) {
    renderChart(ticker, 'today');
    updateChartTitle(ticker, 'today');
  }
}

function deleteTab(ticker) {
  const tab = findTab(ticker);
  const wasActive = tab?.classList.contains('active');

  tab?.remove();
  findPanel(ticker)?.remove();
  destroyChart(ticker);

  window.KAHUNA.stocks = window.KAHUNA.stocks.filter(s => s.ticker !== ticker);
  syncStocksState();

  if (wasActive) activateFallbackTab();
}

function pinTab(ticker) {
  const stock = findStock(ticker);
  if (!stock) return;

  stock.pinned = !stock.pinned;

  findTab(ticker)
    ?.querySelector('.sidebar-tab-pinned-icon')
    ?.classList.toggle('visible', stock.pinned);

  const container = dom.sidebarTabs;
  const allTabs   = Array.from(container.querySelectorAll('.sidebar-tab'));
  const isTabPinned = t => findStock(t.dataset.ticker)?.pinned;
  const pinned   = allTabs.filter(t =>  isTabPinned(t));
  const unpinned = allTabs.filter(t => !isTabPinned(t));

  if (stock.pinned) {
    const tab = findTab(ticker);
    pinned.splice(pinned.indexOf(tab), 1);
    pinned.unshift(tab);
  }

  const ordered = [...pinned, ...unpinned];
  ordered.forEach(t => container.appendChild(t));

  const orderMap = Object.fromEntries(ordered.map((t, i) => [t.dataset.ticker, i]));
  window.KAHUNA.stocks.sort((a, b) => orderMap[a.ticker] - orderMap[b.ticker]);
  syncStocksState();
}

function addNewTab() {
  document.querySelectorAll('.stock-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  dom.mainContent.classList.add('new-tab-mode');
  window.KAHUNA.active = null;
  dom.tickerInput.value = '';

  ['.logo-placeholder', '.prompt-text'].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight; // force reflow to restart animation
    el.style.animation = '';
  });

  dom.tickerInput.focus();
}

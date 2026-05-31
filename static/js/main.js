const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle');

function setSidebarCollapsed(collapsed) {
  sidebar.classList.toggle('collapsed', collapsed);
  sidebarToggleBtn.innerHTML = collapsed ? '&#x203A;' : '&#x2039;';
  sidebarToggleBtn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  localStorage.setItem('sidebar-collapsed', collapsed);
}

function toggleSidebar() {
  setSidebarCollapsed(!sidebar.classList.contains('collapsed'));
}

document.addEventListener('DOMContentLoaded', () => {
  setSidebarCollapsed(localStorage.getItem('sidebar-collapsed') === 'true');

  const active = window.KAHUNA.active;
  if (active) {
    renderChart(active, 'today');
    updateChartTitle(active, 'today');
    analyzeStock(active);
  }
});

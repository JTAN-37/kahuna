document.addEventListener('DOMContentLoaded', () => {
  const active = window.KAHUNA.active;
  if (active) {
    renderChart(active, 'today');
    updateChartTitle(active, 'today');
  }
});

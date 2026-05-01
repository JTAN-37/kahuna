(function initAutocomplete() {
  const SP500 = window.KAHUNA.sp500;
  const input  = document.getElementById('ticker-input');
  const list   = document.getElementById('autocomplete-list');
  let selIdx = -1;

  function matches(q) {
    if (!q) return [];
    const lq = q.toLowerCase();
    return SP500.filter(s =>
      s.ticker.toLowerCase().startsWith(lq) ||
      s.name.toLowerCase().startsWith(lq)
    ).slice(0, 8);
  }

  function render(items) {
    if (!items.length) { list.hidden = true; return; }
    list.innerHTML = '';
    selIdx = -1;
    items.forEach(m => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.innerHTML = `<img class="ac-logo" src="${m.logo_url}" alt="" onerror="this.style.visibility='hidden'"><span class="ac-ticker">${m.ticker}</span><span class="ac-name">${m.name}</span>`;
      li.addEventListener('mousedown', e => { e.preventDefault(); pick(m); });
      list.appendChild(li);
    });
    list.hidden = false;
  }

  function pick(item) {
    input.value = item.ticker;
    list.hidden = true;
    selIdx = -1;
  }

  function highlight() {
    list.querySelectorAll('li').forEach((li, i) =>
      li.setAttribute('aria-selected', i === selIdx ? 'true' : 'false')
    );
  }

  input.addEventListener('input', () => render(matches(input.value)));

  input.addEventListener('keydown', e => {
    const items = list.querySelectorAll('li');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selIdx = Math.min(selIdx + 1, items.length - 1);
      highlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selIdx = Math.max(selIdx - 1, 0);
      highlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selIdx >= 0 && items[selIdx]) {
        const ticker = items[selIdx].querySelector('.ac-ticker').textContent;
        const match = SP500.find(s => s.ticker === ticker);
        if (match) pick(match);
      }
      document.getElementById('ticker-form').submit();
    } else if (e.key === 'Escape') {
      list.hidden = true;
    }
  });

  document.addEventListener('click', e => {
    if (!document.getElementById('autocomplete-wrapper').contains(e.target))
      list.hidden = true;
  });
})();

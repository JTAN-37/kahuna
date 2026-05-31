const analyzedTickers = new Set();

async function analyzeStock(ticker) {
  if (analyzedTickers.has(ticker)) return;
  analyzedTickers.add(ticker);

  const body = document.getElementById(`analysis-body-${ticker}`);
  if (!body) return;

  const stock = window.KAHUNA.stocks.find(s => s.ticker === ticker);
  const params = new URLSearchParams({
    name:   stock?.name   ?? ticker,
    sector: stock?.sector ?? '',
  });

  try {
    const res = await fetch(`/api/analyze/${ticker}?${params}`);
    if (!res.ok) throw new Error(await res.text());

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let raw = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
      body.textContent = raw;
    }

    body.innerHTML = marked.parse(raw);
  } catch {
    analyzedTickers.delete(ticker);
    body.textContent = 'Analysis failed. Please try again.';
  }
}

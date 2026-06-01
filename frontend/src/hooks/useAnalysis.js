import { useEffect, useRef, useState } from 'react'

export function useAnalysis(ticker, { name, sector, enabled = true } = {}) {
  const [text, setText] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (!ticker || !name || !enabled) return
    if (hasFetchedRef.current) return

    hasFetchedRef.current = true
    let cancelled = false
    setLoading(true)
    setError(null)

    const params = new URLSearchParams({ name, sector: sector ?? '' })

    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/analyze/${ticker}?${params}`)
        if (!res.ok) throw new Error(await res.text())

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let raw = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          raw += decoder.decode(value, { stream: true })
        }
        if (!cancelled) setText(raw)
      } catch {
        if (!cancelled) {
          hasFetchedRef.current = false
          setError('Analysis failed. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAnalysis()

    return () => {
      cancelled = true
      hasFetchedRef.current = false
      setLoading(false)
    }
  }, [ticker, name, sector, enabled])

  return { text, loading, error }
}

import { useState } from 'react'

export function StockLogo({ primary, fallback1, fallback2, alt, className }) {
  const [idx, setIdx] = useState(0)
  const srcs = [primary, fallback1, fallback2].filter(Boolean)

  if (!srcs.length || idx >= srcs.length) return null

  return (
    <img
      src={srcs[idx]}
      alt={alt}
      className={className}
      onError={() => setIdx(i => i + 1)}
    />
  )
}

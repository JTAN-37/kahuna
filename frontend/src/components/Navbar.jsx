import { useState, useRef, useEffect } from 'react'
import { useSP500 } from '../hooks/useSP500'
import { useWatchlist } from '../store/watchlist'
import { SearchIcon, ArrowRightIcon } from './Icons'
import './Navbar.css'

export function Navbar() {
  const { data: sp500 = [] } = useSP500()
  const { addTicker, setNewTab } = useWatchlist()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selIdx, setSelIdx] = useState(-1)
  const wrapperRef = useRef(null)

  function pick(item) {
    addTicker(item.ticker)
    setQuery('')
    setResults([])
    setSelIdx(-1)
  }

  function submit() {
    const normalized = query.trim().toUpperCase().replaceAll('.', '-')
    const match = sp500.find(s => s.ticker === normalized)
    if (match) pick(match)
  }

  useEffect(() => {
    if (!query) {
      setResults([])
    } else {
      const lq = query.toLowerCase()
      setResults(
        sp500.filter(s => s.ticker.toLowerCase().startsWith(lq) || s.name.toLowerCase().startsWith(lq)).slice(0, 8)
      )
    }
    setSelIdx(-1)
  }, [query, sp500])

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setResults([])
      }
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selIdx >= 0 && results[selIdx]) {
        pick(results[selIdx])
      } else {
        submit()
      }
    } else if (e.key === 'Escape') {
      setResults([])
    }
  }

  return (
    <nav className="navbar">
      <a className="navbar-title" href="#" onClick={e => { e.preventDefault(); setNewTab() }}>
        Kahuna
      </a>
      <div className="navbar-search">
        <div className="autocomplete-wrapper" ref={wrapperRef}>
          <SearchIcon className="navbar-search-icon" />
          <input
            type="text"
            className="ticker-input"
            placeholder="Search ticker or company…"
            autoComplete="off"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="button" className="navbar-search-btn" title="Search" onClick={submit}>
            <ArrowRightIcon />
          </button>
          {results.length > 0 && (
            <ul className="autocomplete-list" role="listbox">
              {results.map((item, i) => (
                <li
                  key={item.ticker}
                  role="option"
                  aria-selected={i === selIdx}
                  onMouseDown={e => { e.preventDefault(); pick(item) }}
                >
                  <img
                    className="ac-logo"
                    src={item.logo_url}
                    alt=""
                    onError={e => e.currentTarget.classList.add('ac-logo--error')}
                  />
                  <span className="ac-ticker">{item.ticker}</span>
                  <span className="ac-name">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  )
}

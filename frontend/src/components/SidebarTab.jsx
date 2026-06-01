import { useState, useRef, useEffect } from 'react'
import { useWatchlist } from '../store/watchlist'
import { useStockData } from '../hooks/useStockData'
import { StockLogo } from './StockLogo'
import { PinIcon, DotsIcon, TrashIcon } from './Icons'

export function SidebarTab({ ticker, isActive, isPinned }) {
  const { data: stock } = useStockData(ticker)
  const { setActive, removeTicker, togglePin } = useWatchlist()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const btnRef = useRef(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!menuOpen) return
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [menuOpen])

  function openMenu(e) {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, left: rect.left })
    setMenuOpen(v => !v)
  }

  return (
    <>
      <div
        className={`sidebar-tab${isActive ? ' active' : ''}`}
        onClick={() => setActive(ticker)}
      >
        <div className="sidebar-tab-logo">
          <StockLogo
            primary={stock?.logo_url ?? `https://assets.parqet.com/logos/symbol/${ticker}?format=png`}
            fallback1={stock?.fallback_logo_url}
            fallback2="/default-logo.png"
            alt={ticker}
          />
        </div>
        <div className="sidebar-tab-info">
          <span className="sidebar-tab-ticker">{ticker}</span>
          <span className="sidebar-tab-name">{stock?.name ?? ''}</span>
        </div>
        {isPinned && (
          <span className="sidebar-tab-pinned-icon">
            <PinIcon filled />
          </span>
        )}
        <button
          ref={btnRef}
          className="sidebar-tab-menu-btn"
          onClick={openMenu}
          title="Options"
        >
          <DotsIcon />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="tab-dropdown"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button className="tab-dropdown-item" onClick={() => { togglePin(ticker); setMenuOpen(false) }}>
            <PinIcon size={13} />
            <span>{isPinned ? 'Unpin tab' : 'Pin tab'}</span>
          </button>
          <button className="tab-dropdown-item tab-dropdown-delete"
            onClick={() => { removeTicker(ticker); setMenuOpen(false) }}>
            <TrashIcon />
            Delete tab
          </button>
        </div>
      )}
    </>
  )
}

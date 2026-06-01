import { useState } from 'react'
import { useWatchlist } from '../store/watchlist'
import { SidebarTab } from './SidebarTab'
import { ChevronIcon } from './Icons'
import './Sidebar.css'

export function Sidebar() {
  const { tickers, activeTicker, pinnedTickers, sidebarOpen, setSidebarOpen, setNewTab } = useWatchlist()
  const [pinnedOpen, setPinnedOpen] = useState(true)
  const [tabsOpen, setTabsOpen] = useState(true)
  const collapsed = !sidebarOpen
  const openPinnedTickers = pinnedTickers.filter(t => tickers.includes(t))

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '›' : '‹'}
      </button>
      <div className="sidebar-inner">
        <button className="sidebar-add-tab" onClick={setNewTab}>+ Add Tab</button>
        {openPinnedTickers.length > 0 && (
          <>
            <button className="sidebar-section-header" onClick={() => setPinnedOpen(v => !v)}>
              <ChevronIcon open={pinnedOpen} />
              Pinned
            </button>
            {pinnedOpen && (
              <div className="sidebar-tabs">
                {openPinnedTickers.map(ticker => (
                  <SidebarTab
                    key={ticker}
                    ticker={ticker}
                    isActive={ticker === activeTicker}
                    isPinned
                  />
                ))}
              </div>
            )}
          </>
        )}
        <button className="sidebar-section-header" onClick={() => setTabsOpen(v => !v)}>
          <ChevronIcon open={tabsOpen} />
          Tabs
        </button>
        {tabsOpen && (
          <div className="sidebar-tabs">
            {tickers.filter(t => !pinnedTickers.includes(t)).map(ticker => (
              <SidebarTab
                key={ticker}
                ticker={ticker}
                isActive={ticker === activeTicker}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

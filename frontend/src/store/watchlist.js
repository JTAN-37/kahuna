import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWatchlist = create(
  persist(
    (set, get) => ({
      tickers: [],
      activeTicker: null,
      sidebarOpen: true,
      pinnedTickers: [],

      addTicker(ticker) {
        const { tickers } = get()
        if (tickers.includes(ticker)) {
          set({ activeTicker: ticker })
          return
        }
        set({ tickers: [...tickers, ticker], activeTicker: ticker })
      },

      removeTicker(ticker) {
        const { tickers, activeTicker, pinnedTickers } = get()
        const next = tickers.filter(t => t !== ticker)
        let nextActive = activeTicker
        if (activeTicker === ticker) {
          nextActive = next.length > 0 ? next[next.length - 1] : null
        }
        set({
          tickers: next,
          activeTicker: nextActive,
          pinnedTickers: pinnedTickers.filter(t => t !== ticker),
        })
      },

      setActive(ticker) {
        set({ activeTicker: ticker })
      },

      setNewTab() {
        set({ activeTicker: null })
      },

      togglePin(ticker) {
        const { pinnedTickers, tickers } = get()
        const isPinned = pinnedTickers.includes(ticker)
        const nextPinned = isPinned
          ? pinnedTickers.filter(t => t !== ticker)
          : [ticker, ...pinnedTickers]

        const unpinned = tickers.filter(t => !nextPinned.includes(t))
        set({ pinnedTickers: nextPinned, tickers: [...nextPinned, ...unpinned] })
      },

      setSidebarOpen(open) {
        set({ sidebarOpen: open })
      },
    }),
    { name: 'kahuna-watchlist', partialize: s => ({ pinnedTickers: s.pinnedTickers, sidebarOpen: s.sidebarOpen }) }
  )
)

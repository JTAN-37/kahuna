export const SearchIcon = ({ size = 15, className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export const ArrowRightIcon = ({ size = 15 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

export const ChevronIcon = ({ open }) => (
  <svg
    className={`chevron-icon${open ? '' : ' chevron-icon--closed'}`}
    width="10" height="10" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

export const PinIcon = ({ size = 11, filled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth={filled ? '1' : '2.5'}
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="17" x2="12" y2="22"/>
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
  </svg>
)

export const DotsIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
  </svg>
)

export const TrashIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

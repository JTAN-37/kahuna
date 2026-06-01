import { useQuery } from '@tanstack/react-query'

export function useSP500() {
  return useQuery({
    queryKey: ['sp500'],
    queryFn: () => fetch('/api/sp500').then(r => r.json()),
    staleTime: Infinity,
  })
}

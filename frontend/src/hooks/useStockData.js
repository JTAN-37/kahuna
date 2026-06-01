import { useQuery } from '@tanstack/react-query'

export function useStockData(ticker) {
  return useQuery({
    queryKey: ['stock', ticker],
    queryFn: () => fetch(`/api/stock/${ticker}`).then(r => r.json()),
    enabled: !!ticker,
  })
}

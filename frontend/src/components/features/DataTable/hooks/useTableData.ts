import { useQuery } from '@tanstack/react-query'
import { mockApiClient } from '../../../../services/mockApi'

export function useTableData<T>(endpoint: string) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['table-data', endpoint],
    queryFn: () => mockApiClient.get<T>(endpoint),
  })

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  }
}

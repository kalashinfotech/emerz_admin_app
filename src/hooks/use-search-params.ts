import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import { getRouteApi, useNavigate } from '@tanstack/react-router'

import { cleanEmptyParams } from '../lib/search-params'

export function useSearchParams<T extends RouteIds<RegisteredRouter['routeTree']>>(routeId: T) {
  const routeApi = getRouteApi<T>(routeId)
  const navigate = useNavigate()
  const searchParams = routeApi.useSearch()

  const setSearchParams = (partialSearchParams: Partial<typeof searchParams>, resetPage: boolean = false) => {
    if (Object.keys(partialSearchParams).length === 0) {
      return resetSearchParams()
    }
    return navigate({
      to: '.',
      search: (prev) => cleanEmptyParams({ ...prev, ...partialSearchParams }, resetPage),
    })
  }

  const resetSearchParams = () => navigate({ to: '.', search: {} })

  return { searchParams, setSearchParams, resetSearchParams }
}

import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'

import type { SortParams } from '@/types/common/search-params'

const DEFAULT_PAGE_INDEX = 0
const DEFAULT_PAGE_SIZE = 10
const IGNORE_KEYS = ['pageIndex', 'pageSize', 'sortBy'] as const

export const cleanEmptyParams = <T extends Record<string, unknown>>(search: T, resetPage: boolean = false) => {
  const newSearch = { ...search }
  if (resetPage) {
    delete newSearch.pageIndex
  }
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key]
    if (value === undefined || value === '' || (typeof value === 'number' && isNaN(value))) delete newSearch[key]
  })

  if (search.pageIndex === DEFAULT_PAGE_INDEX) delete newSearch.pageIndex
  if (search.pageSize === DEFAULT_PAGE_SIZE) delete newSearch.pageSize

  return newSearch
}

export const stateToSortBy = (sorting: SortingState | undefined) => {
  if (!sorting || sorting.length == 0) return undefined

  const sort = sorting[0]

  return `${sort.id}.${sort.desc ? 'desc' : 'asc'}` as const
}

export const sortByToState = (sortBy: SortParams['sortBy'] | undefined) => {
  if (!sortBy) return []

  const [id, desc] = sortBy.split('.')
  return [{ id, desc: desc === 'desc' }]
}

export function filterToState<T extends Record<string, string | number>>(searchParams: T): ColumnFiltersState {
  return (
    Object.entries(searchParams)
      // @ts-expect-error invalid_key
      .filter(([key]) => !IGNORE_KEYS.includes(key))
      .map(([id, value]) => ({ id, value }))
  )
}

export function stateToFilter(state: ColumnFiltersState): Record<string, string | number> {
  return state.reduce<Record<string, any>>((acc, { value, id }) => {
    // @ts-expect-error invalid_key
    if (!IGNORE_KEYS.includes(id)) {
      acc[id] = value
    }
    return acc
  }, {})
}

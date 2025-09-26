import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type { FetchIdeaListRsDto, FetchIdeaRsDto } from '@/types'

import { fetchQuery } from '.'

const baseSuburl = '/idea'
const queryKey = ['idea']

export const fetchIdeaById = (ideaId: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${ideaId}`
  return fetchQuery<FetchIdeaRsDto>(endpoint, { queryKey: [...queryKey, ideaId], enabled })
}

export const fetchIdeas = (
  page: number,
  columnFilters: ColumnFilter[],
  sorting: ColumnSort[],
  pageSize: number = 10,
  enabled: boolean = true,
) => {
  const filters = columnFilters.reduce<Record<string, string>>((acc, obj) => {
    acc[obj.id] = obj.value as string
    return acc
  }, {})

  const endpoint = `${baseSuburl}`
  const params = { page, pageSize, ...filters, sorting }
  return fetchQuery<FetchIdeaListRsDto>(endpoint, {
    queryKey: [...queryKey, 'list', page, columnFilters, sorting, pageSize],
    enabled,
    params,
  })
}

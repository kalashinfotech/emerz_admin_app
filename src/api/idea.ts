import { useMutation } from '@tanstack/react-query'
import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type { CreateIdeaActivityRqDto, FetchIdeaActivityRsDto, FetchIdeaListRsDto, FetchIdeaRsDto } from '@/types'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

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

export const UseCreateIdeaActivity = (ideaId: string) => {
  const {
    mutateAsync: createIdeaActivity,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'create'],
    mutationFn: async ({ request }: { request: CreateIdeaActivityRqDto }): Promise<null> => {
      const endPoint = `${baseSuburl}/${ideaId}/activity`
      const response = await axiosPrivate.post(endPoint, { ...request })
      return response.data
    },
  })
  return { createIdeaActivity, reset, isPending, isError, error, isSuccess }
}
export const fetchIdeaActivityByIdeaId = (ideaId: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${ideaId}/activity`
  return fetchQuery<FetchIdeaActivityRsDto>(endpoint, { queryKey: [...queryKey, 'activity', ideaId], enabled })
}

import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type { FetchParticipantListRsDto, FetchParticipantRsDto } from '@/types'

import { fetchQuery } from '.'

const baseSuburl = '/participant'
const queryKey = ['participant']

export const fetchParticipantById = (participantId: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${participantId}`
  return fetchQuery<FetchParticipantRsDto>(endpoint, { queryKey: [...queryKey, participantId], enabled })
}

export const fetchParticipants = (
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
  return fetchQuery<FetchParticipantListRsDto>(endpoint, {
    queryKey: [...queryKey, 'list', page, columnFilters, sorting, pageSize],
    enabled,
    params,
  })
}

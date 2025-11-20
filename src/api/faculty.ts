import { useMutation } from '@tanstack/react-query'
import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type { IdRs } from '@/types'
import type { CreateFacultyRqDto, FetchFacultyListRsDto, FetchFacultyRsDto } from '@/types/faculty'

import type { UserTypeEnum } from '@/lib/enums'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/faculty'
const queryKey = ['faculty']

export const fetchFacultyById = (facultyId: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${facultyId}`
  return fetchQuery<FetchFacultyRsDto>(endpoint, { queryKey: [...queryKey, facultyId], enabled })
}

export const fetchFaculty = (
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
  return fetchQuery<FetchFacultyListRsDto>(endpoint, {
    queryKey: [...queryKey, 'list', page, columnFilters, sorting, pageSize],
    enabled,
    params,
  })
}

export const UseCreateFaculty = (userType: UserTypeEnum) => {
  const {
    mutateAsync: createFaculty,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'create'],
    mutationFn: async ({ request }: { request: CreateFacultyRqDto }): Promise<IdRs> => {
      const endPoint = `${baseSuburl}`
      const response = await axiosPrivate.post(endPoint, { ...request, userType })
      return response.data
    },
  })
  return { createFaculty, reset, isPending, isError, error, isSuccess }
}

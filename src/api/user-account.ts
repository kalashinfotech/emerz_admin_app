import { useMutation } from '@tanstack/react-query'
import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type { IdRs } from '@/types'
import type {
  CreateUserAccountRqDto,
  FetchUserAccountBareListRsDto,
  FetchUserAccountListRsDto,
  FetchUserAccountRsDto,
} from '@/types/user-account'

import type { UserTypeEnum } from '@/lib/enums'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/user-accounts'
const queryKey = ['user-accounts']

export const fetchUserAccountById = (userAccountId: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${userAccountId}`
  return fetchQuery<FetchUserAccountRsDto>(endpoint, { queryKey: [...queryKey, userAccountId], enabled })
}

export const fetchUserAccounts = (
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
  return fetchQuery<FetchUserAccountListRsDto>(endpoint, {
    queryKey: [...queryKey, 'list', page, columnFilters, sorting, pageSize],
    enabled,
    params,
  })
}
export const fetchUserAccountsBareList = (columnFilters: ColumnFilter[], enabled: boolean = true) => {
  const filters = columnFilters.reduce<Record<string, string>>((acc, obj) => {
    acc[obj.id] = obj.value as string
    return acc
  }, {})

  const endpoint = `${baseSuburl}/list`
  const params = { ...filters }
  return fetchQuery<FetchUserAccountBareListRsDto>(endpoint, {
    queryKey: [...queryKey, 'list', columnFilters],
    enabled,
    params,
  })
}

export const UseCreateUserAccount = (userType: UserTypeEnum) => {
  const {
    mutateAsync: createUserAccount,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'create'],
    mutationFn: async ({ request }: { request: CreateUserAccountRqDto }): Promise<IdRs> => {
      const endPoint = `${baseSuburl}`
      const response = await axiosPrivate.post(endPoint, { ...request, userType })
      return response.data
    },
  })
  return { createUserAccount, reset, isPending, isError, error, isSuccess }
}

import type { z } from 'zod/v4'

import type {
  bareUserAccountSchema,
  createUserAccountRqSchema,
  fetchUserAccountBareListRsSchema,
  fetchUserAccountListRsSchema,
  fetchUserAccountListSchema,
  fetchUserAccountRsSchema,
  updateUserAccountRqSchema,
} from '@/lib/schemas/user-account'

export type CreateUserAccountRqDto = z.infer<typeof createUserAccountRqSchema>
export type UpdateUserAccountRqDto = z.infer<typeof updateUserAccountRqSchema>
export type FetchUserAccountListRsDto = z.infer<typeof fetchUserAccountListRsSchema>
export type FetchUserAccountRsDto = z.infer<typeof fetchUserAccountRsSchema>
export type FetchUserAccountBareListRsDto = z.infer<typeof fetchUserAccountBareListRsSchema>

export type UserAccountModel = z.infer<typeof fetchUserAccountListSchema>
export type BareUserAccountModel = z.infer<typeof bareUserAccountSchema>

import type { z } from 'zod/v4'

import type {
  createUserAccountRqSchema,
  fetchUserAccountListRsSchema,
  fetchUserAccountListSchema,
  fetchUserAccountRsSchema,
  updateUserAccountRqSchema,
} from '@/lib/schemas/user-account'

export type CreateUserAccountRqDto = z.infer<typeof createUserAccountRqSchema>
export type UpdateUserAccountRqDto = z.infer<typeof updateUserAccountRqSchema>
export type FetchUserAccountListRsDto = z.infer<typeof fetchUserAccountListRsSchema>
export type FetchUserAccountRsDto = z.infer<typeof fetchUserAccountRsSchema>

export type UserAccountModel = z.infer<typeof fetchUserAccountListSchema>

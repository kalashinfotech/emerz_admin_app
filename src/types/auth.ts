import type { z } from 'zod/v4'

import type { changePasswordRqSchema, signInRqSchema } from '@/lib/schemas/auth'
import type { fetchUserAccountRsSchema } from '@/lib/schemas/user-account'

export type SignInRq = z.infer<typeof signInRqSchema>
export type SessionInfo = z.infer<typeof fetchUserAccountRsSchema>

export type SignInRs = {
  status?: number
  error?: string
}

export type ChangePasswordRq = z.infer<typeof changePasswordRqSchema>

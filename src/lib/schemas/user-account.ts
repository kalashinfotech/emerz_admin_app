import { z } from 'zod/v4'

import { UserTypeEnum } from '@/lib/enums'
import { paginationQySchema, paginationRsSchema, sortQySchema } from '@/lib/schemas/common'

import { bareCountrySchema, bareStateSchema } from './parameters'
import { bareRoleSchmea } from './parameters/role'

const baseUserAccountSchema = z.object({
  salutation: z.string().max(20).nullable(),
  firstName: z.string().max(100),
  middleName: z.string().max(100).nullable(),
  lastName: z.string().max(100),
  emailId: z.email().max(255),
  mobileNo: z.string().max(15).nullable(),
  dateOfBirth: z.date().nullable(),
  addressLine1: z.string().max(50),
  addressLine2: z.string().max(50).nullable(),
  countryId: z.coerce.number().nullable(),
  stateId: z.coerce.number().nullable(),
  userType: z.enum(UserTypeEnum), // ensure UserTypeEnum is imported from your enums
  tosAgreed: z.boolean().nullable(),
})

export const createUserAccountRqSchema = baseUserAccountSchema.extend({
  password: z.string().max(100).nullable(),
})

export const updateUserAccountRqSchema = baseUserAccountSchema

export const userAccountSchema = baseUserAccountSchema.extend({
  id: z.uuid(),
  displayId: z.string().max(20),
  isActive: z.boolean(),
  verifiedDate: z.coerce.date().nullable(),
  failedLoginAttempts: z.number().int(),
  lastPasswordChangeDate: z.coerce.date().nullable(),
  lastLogin: z.coerce.date().nullable(),
  tosAgreedDate: z.coerce.date().nullable(),
  state: bareStateSchema.nullable(),
  country: bareCountrySchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  createdById: z.uuid().nullable(),
  updatedById: z.uuid().nullable(),
  roles: z.array(bareRoleSchmea),
})

export const bareUserAccountSchema = z
  .object({
    id: z.uuid(),
    displayId: z.string().max(20),
    salutation: z.string().max(20).nullable(),
    firstName: z.string().max(100),
    middleName: z.string().max(100).nullable(),
    lastName: z.string().max(100),
  })
  .extend({ fullName: z.string().optional() })
  .transform((data) => {
    const fn = data.firstName
    const mn = data.middleName ?? ''
    const ln = data.lastName
    const sl = data.salutation ?? ''
    const fullName = [sl, fn, mn, ln]
      .filter((part) => part && part.trim().length > 0)
      .join(' ')
      .trim()
    return { ...data, fullName }
  })

export const fetchUserAccountRsSchema = userAccountSchema

export const fetchUserAccountListRsSchema = z.object({
  data: z.array(userAccountSchema),
  pagination: paginationRsSchema,
})

export const fetchUserAccountListQySchema = z.object({ ...paginationQySchema.shape, ...sortQySchema.shape }).extend({
  name: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
})

export type CreateUserAccountRqDto = z.infer<typeof createUserAccountRqSchema>
export type UpdateUserAccountRqDto = z.infer<typeof updateUserAccountRqSchema>
export type FetchUserAccountListQyDto = z.infer<typeof fetchUserAccountListQySchema>

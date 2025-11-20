import { z } from 'zod/v4'

import { UserTypeEnum } from '@/lib/enums'
import { paginationQySchema, paginationRsSchema, sortQySchema } from '@/lib/schemas/common'

import { bareCountrySchema, bareStateSchema } from './parameters'
import { bareRoleOnlySchema, bareRoleSchmea } from './parameters/role'

export const baseUserAccountSchema = z.object({
  salutation: z.string().max(20).nullable(),
  firstName: z.string().max(100),
  middleName: z.string().max(100).nullable(),
  lastName: z.string().max(100),
  emailId: z.email().max(255),
  mobileNo: z.string().max(15).nullable(),
  dateOfBirth: z.string().nullable(),
  addressLine1: z.string().max(50),
  addressLine2: z.string().max(50).nullable(),
  countryId: z.coerce.number().nullable(),
  stateId: z.coerce.number().nullable(),
  userType: z.enum(UserTypeEnum),
  tosAgreed: z.boolean().nullable(),
})

export const createUserAccountRqSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  password: z.string().max(100).optional(),
  emailId: z.email().max(255),
  userType: z.enum(UserTypeEnum).optional(),
  role: z.union([z.string(), z.number()]),
})

export const updateUserAccountRqSchema = baseUserAccountSchema

export const userAccountSchema = baseUserAccountSchema.extend({
  id: z.uuid(),
  displayId: z.string().max(20),
  isActive: z.boolean(),
  verifiedDate: z.string().nullable(),
  failedLoginAttempts: z.number().int(),
  lastPasswordChangeDate: z.string().nullable(),
  lastLogin: z.string().nullable(),
  tosAgreedDate: z.string().nullable(),
  state: bareStateSchema.nullable(),
  country: bareCountrySchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
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
    userType: z.enum(UserTypeEnum),
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

export const fetchUserAccountListSchema = userAccountSchema
  .omit({
    state: true,
    country: true,
  })
  .extend({
    roles: z.array(bareRoleOnlySchema),
  })

export const fetchUserAccountListRsSchema = z.object({
  data: z.array(userAccountSchema),
  pagination: paginationRsSchema,
})

export const fetchUserAccountListQySchema = z.object({ ...paginationQySchema.shape, ...sortQySchema.shape }).extend({
  name: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

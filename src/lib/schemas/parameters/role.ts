import { z } from 'zod/v4'

import { UserTypeEnum } from '@/lib/enums'

import { bareScopeSchema, scopeSchema } from './scope'

const baseRoleSchema = z.object({
  roleType: z.enum(UserTypeEnum),
  name: z.string(),
  desc: z.string().nullable(),
})

export const roleSchema = baseRoleSchema.extend({
  id: z.int(),
  isActive: z.boolean(),
  scopes: z.array(scopeSchema),
})

export const bareRoleSchmea = roleSchema
  .pick({
    id: true,
    roleType: true,
    name: true,
    desc: true,
  })
  .extend({
    scopes: z.array(bareScopeSchema),
  })

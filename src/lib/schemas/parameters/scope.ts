import { z } from 'zod/v4'

import { UserTypeEnum } from '@/lib/enums'

import { AccessTypeEnum, bareModuleSchema, moduleSchema } from './module'

const baseScopeSchema = z.object({
  scopeType: z.enum(UserTypeEnum),
  moduleId: z.int(),
  accessType: z.enum(AccessTypeEnum),
})

export const scopeSchema = baseScopeSchema.extend({
  id: z.int(),
  module: moduleSchema,
})

export const bareScopeSchema = scopeSchema
  .pick({
    id: true,
    moduleId: true,
    accessType: true,
  })
  .extend({
    module: bareModuleSchema,
  })

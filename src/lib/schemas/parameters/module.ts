import { z } from 'zod/v4'

import { UserTypeEnum } from '@/lib/enums'

export const AccessTypeEnum = {
  READ: 'READ',
  WRITE: 'WRITE',
  FULL: 'FULL',
} as const

export type AccessTypeEnum = (typeof AccessTypeEnum)[keyof typeof AccessTypeEnum]

const baseModuleSchema = z.object({
  name: z.string(),
  desc: z.string().nullable(),
  accessLevel: z.array(z.enum(UserTypeEnum)),
})

export const moduleSchema = baseModuleSchema.extend({
  id: z.int(),
})

export const bareModuleSchema = moduleSchema.pick({
  id: true,
  name: true,
  desc: true,
})

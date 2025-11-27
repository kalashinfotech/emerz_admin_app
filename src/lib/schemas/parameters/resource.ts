import { z } from 'zod/v4'

import { bareUserAccountSchema } from '../user-account'

export const ResourceType = {
  VIDEO: 'VIDEO',
  TEXT: 'TEXT',
  LINK: 'LINK',
  FILE: 'FILE',
} as const

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType]

export const baseResourceSchema = z.object({
  type: z.enum(ResourceType),
  title: z.string(),
  content: z.string(),
  description: z.string().optional().nullable(),
  targetType: z.string(),
  targetId: z.int(),
  order: z.int().optional(),
})

export const resourceSchema = baseResourceSchema.extend({
  id: z.int(),
  isActive: z.boolean().optional().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.uuid().nullable(),
  updatedById: z.uuid().nullable(),
  createdBy: bareUserAccountSchema.optional().nullable(),
  updatedBy: bareUserAccountSchema.optional().nullable(),
})

export const createResourceRqSchema = baseResourceSchema.extend({})

export const bareResourceSchema = baseResourceSchema.extend({})

export type CreateResourceRqDto = z.infer<typeof createResourceRqSchema>

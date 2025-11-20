import { z } from 'zod/v4'

export const auditMixinSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  createdById: z.uuid().nullable(),
  updatedById: z.uuid().nullable(),
  // createdBy: bareUserAccountSchema.nullable(),
  // updatedBy: bareUserAccountSchema.nullable(),
})

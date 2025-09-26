import { z } from 'zod/v4'

import { paginationRsSchema } from '../common'
import { bareUserAccountSchema } from '../user-account'
import { bareInstitutionSchema } from './institution'

const baseBatchSchema = z.object({
  name: z.string().max(100).optional(),
  noOfParticipants: z.number().gt(0),
})

export const batchSchema = baseBatchSchema.extend({
  id: z.int(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdById: z.uuid().nullable(),
  updatedById: z.uuid().nullable(),
  createdBy: bareUserAccountSchema,
  updatedBy: bareUserAccountSchema.nullable(),
  institution: bareInstitutionSchema,
})

export const bareBatchSchema = batchSchema.pick({ id: true, name: true })
export const bareBatchSchemaWithInstitution = batchSchema.pick({
  id: true,
  name: true,
  institution: true,
})

export const createBatchRqSchema = baseBatchSchema.extend({
  institutionId: z.number(),
})

export const updateBatchRqSchema = baseBatchSchema
export const fetchBatchRsSchema = batchSchema

export const fetchBatchListRsSchema = z.object({
  data: z.array(batchSchema),
  pagination: paginationRsSchema,
})

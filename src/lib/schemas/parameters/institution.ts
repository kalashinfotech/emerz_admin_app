import { z } from 'zod/v4'

import { paginationQySchema, paginationRsSchema, sortQySchema } from '../common'
import { bareUserAccountSchema } from '../user-account'

const baseInstitutionSchema = z.object({
  name: z.string().max(255),
})

export const institutionSchema = baseInstitutionSchema.extend({
  id: z.int(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdById: z.uuid().nullable(),
  updatedById: z.uuid().nullable(),
  createdBy: bareUserAccountSchema,
  updatedBy: bareUserAccountSchema.nullable(),
})

export const bareInstitutionSchema = institutionSchema.pick({
  id: true,
  name: true,
})

export const createInstitutionRqSchema = baseInstitutionSchema.extend({})

export const updateInstitutionRqSchema = baseInstitutionSchema.extend({})
export const updateInstitutionStatusRqSchema = institutionSchema.pick({
  isActive: true,
})

// export const updateInstitutionRqSchema = baseInstitutionSchema.extend({
//   isActive: true,
// });

export const fetchInstitutionRsSchema = institutionSchema

export const fetchInstitutionListRsSchema = z.object({
  data: z.array(institutionSchema),
  pagination: paginationRsSchema,
})

export const fetchInstitutionQySchema = z.object({ ...paginationQySchema.shape, ...sortQySchema.shape }).extend({
  name: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  // isActive: z.coerce.boolean().optional(),
  // isActive: z.boolean()
  //   .transform(val => (typeof val === "boolean" ? val : val === "true"))
  //   .optional(),
})

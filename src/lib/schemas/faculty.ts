import { z } from 'zod/v4'

import { paginationQySchema, paginationRsSchema, sortQySchema } from './common'
import { bareRoleOnlySchema } from './parameters/role'
import { baseUserAccountSchema, createUserAccountRqSchema, userAccountSchema } from './user-account'

const baseFacultyDetailSchema = z.object({
  highestEducation: z.string().max(255).nullable().optional(),
  certifications: z.array(z.string().min(10)).optional(),
  workExperienceInYears: z.union([z.int(), z.string()]).nullable().optional(),
})

export const baseFacultySchema = baseUserAccountSchema.extend({
  facultyDetail: baseFacultyDetailSchema,
})

export const facultySchema = userAccountSchema.extend(baseFacultySchema.shape)

export const fetchFacultyListSchema = facultySchema
  .omit({
    state: true,
    country: true,
  })
  .extend({
    roles: z.array(bareRoleOnlySchema),
  })

export const fetchFacultyRsSchema = facultySchema

export const createFacultyRqSchema = createUserAccountRqSchema.extend(baseFacultyDetailSchema.shape)

export const fetchFacultyListQySchema = z.object({
  ...paginationQySchema.shape,
  ...sortQySchema.shape,
  search: z.string().optional(),
  highestEducation: z.string().optional(),
  certifications: z.string().optional(),
  workExperienceInYears: z.string().optional(),
})

export const fetchFacultyListRsSchema = z.object({
  data: z.array(fetchFacultyListSchema),
  pagination: paginationRsSchema,
})

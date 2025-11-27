import { z } from 'zod/v4'

import { paginationQySchema, paginationRsSchema, sortQySchema } from '../common'
import { bareUserAccountSchema } from '../user-account'
import { bareResourceSchema } from './resource'

export const QuestionGroupEnum = {
  STAGE_0: 'STAGE_0',
  STAGE_2: 'STAGE_2',
  STAGE_3: 'STAGE_3',
} as const

export type QuestionGroupEnum = (typeof QuestionGroupEnum)[keyof typeof QuestionGroupEnum]

export const baseQuestionSchema = z.object({
  name: z.string().min(10),
  desc: z.string().min(10),
  subType: z.string().min(5).nullable(),
  priority: z.int().gte(1),
  minLength: z.int().gte(0).optional().nullable(),
  maxLength: z.int().gte(0).optional().nullable(),
})

export const questionSchema = baseQuestionSchema.extend({
  id: z.int(),
  groupId: z.int(),
  isActive: z.boolean().optional().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.uuid().nullable(),
  updatedById: z.uuid().nullable(),
  createdBy: bareUserAccountSchema.optional().nullable(),
  updatedBy: bareUserAccountSchema.optional().nullable(),
})

export const createQuestionRqSchema = baseQuestionSchema.extend({
  resources: z.array(bareResourceSchema).optional(),
})

export const bareQuestionSchema = baseQuestionSchema.extend({
  resources: z.array(bareResourceSchema).optional(),
})

export const baseQuestionGroupSchema = z.object({
  name: z.string().min(3).max(100),
  priority: z.int().gte(1),
  groupType: z.enum(QuestionGroupEnum),
})

export const questionGroupSchema = baseQuestionGroupSchema.extend({
  id: z.int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.uuid().nullable(),
  updatedById: z.uuid().nullable(),
  createdBy: bareUserAccountSchema.nullable().optional(),
  updatedBy: bareUserAccountSchema.nullable().optional(),
  questions: z.array(bareQuestionSchema),
})

export const createQuestionGroupRqSchema = baseQuestionGroupSchema.extend({})

export const bareQuestionGroupSchema = baseQuestionGroupSchema.extend({})

export const createRqSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string().max(100),
      groupType: z.enum(QuestionGroupEnum),
      priority: z.int(),
      questions: z.array(bareQuestionSchema),
    }),
  ),
})

export const fetchQuestionListRsSchema = z.object({
  data: z.array(
    bareQuestionGroupSchema.extend({
      questions: z.array(bareQuestionSchema),
    }),
  ),
  pagination: paginationRsSchema,
})

export const fetchQuestionQySchema = z.object({ ...paginationQySchema.shape, ...sortQySchema.shape }).extend({})

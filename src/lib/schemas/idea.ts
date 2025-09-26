import { z } from 'zod/v4'

import { IdeaDecisionEnum, IdeaStageEnum } from '@/lib/enums'
import { bareParticipantSchema } from '@/lib/schemas/client'
import { paginationQySchema, paginationRsSchema, sortQySchema } from '@/lib/schemas/common'

import { ideaCollaborationSchema } from './idea-collaborator'
import { ideaProfileAnswerSchema } from './idea-profile'

const baseIdeaSchema = z.object({
  title: z.string().min(10).max(100),
  desc: z.string().optional(),
})

export const ideaSchema = baseIdeaSchema.extend({
  id: z.uuid(),
  displayId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  createdById: z.uuid().nullable(),
  createdBy: bareParticipantSchema,
  stage: z.enum(IdeaStageEnum),
  decision: z.enum(IdeaDecisionEnum),
  attempts: z.object({ preValidation: z.int(), readiness: z.int(), validation: z.int() }),
  ownerId: z.uuid(),
  owner: bareParticipantSchema,
  collaborators: z.array(ideaCollaborationSchema).nullable(),
  profileAnswers: z.array(ideaProfileAnswerSchema).nullable(),
})

export const listIdeaSchema = ideaSchema.omit({
  collaborators: true,
  profileAnswers: true,
})

export const fetchIdeaRsSchema = ideaSchema

export const fetchIdeaListRsSchema = z.object({
  data: z.array(listIdeaSchema),
  pagination: paginationRsSchema,
})

export const fetchIdeaListQy = z.object({
  ...paginationQySchema.shape,
  ...sortQySchema.shape,
  search: z.string().optional(),
  stage: z.enum(IdeaStageEnum).optional(),
  decision: z.enum(IdeaDecisionEnum).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  ownedOnly: z.coerce.boolean().optional(),
  currentUserId: z.uuid().optional(),
})

import { z } from 'zod/v4'

import { IdeaActionEnum, IdeaStageEnum, IdeaStatusEnum } from '@/lib/enums'
import { bareParticipantSchema } from '@/lib/schemas/client'
import { paginationQySchema, paginationRsSchema, sortQySchema } from '@/lib/schemas/common'

import { bareCollaboratorSchema, ideaCollaborationSchema } from './idea-collaborator'
import { participantAnswerSchema } from './idea-question'
import { bareUserAccountSchema } from './user-account'

export const baseIdeaActivitySchema = z.object({
  ideaId: z.uuid(),
  response: z.string().optional(),
  action: z.enum(IdeaActionEnum),
})

export const ideaActivitySchema = baseIdeaActivitySchema.extend({
  id: z.number(),
  userId: z.string().optional(),
  collaboratorId: z.number().optional(),
  updatedAt: z.string(),
  oldStage: z.enum(IdeaStageEnum).optional(),
  oldStatus: z.enum(IdeaStatusEnum).optional(),
  newStage: z.enum(IdeaStageEnum).optional(),
  newStatus: z.enum(IdeaStatusEnum).optional(),
  user: bareUserAccountSchema.optional(),
  collaborator: bareCollaboratorSchema.optional(),
})

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
  status: z.enum(IdeaStatusEnum),
  attempts: z.object({ preValidation: z.int(), readiness: z.int(), validation: z.int() }),
  ownerId: z.uuid(),
  facultyId: z.uuid().nullable(),
  owner: bareParticipantSchema,
  collaborators: z.array(ideaCollaborationSchema).nullable(),
  answers: z.array(participantAnswerSchema).nullable(),
  allowedActions: z.array(z.enum(IdeaActionEnum)),
  faculty: bareUserAccountSchema.optional(),
})

export const listIdeaSchema = ideaSchema.omit({
  collaborators: true,
  answers: true,
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
  status: z.enum(IdeaStatusEnum).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  ownedOnly: z.coerce.boolean().optional(),
  currentUserId: z.uuid().optional(),
})

export const createIdeaActivityRqSchema = z.object({
  response: z.string().optional(),
  action: z.enum(IdeaActionEnum),
  facultyId: z.uuid().optional(),
})
export const generateCreateIdeaActivityDynamicRqSchema = (isOptional: boolean) => {
  return z.object({
    response: isOptional ? z.string().optional() : z.string().min(200),
    action: z.enum(IdeaActionEnum),
    facultyId: z.uuid().optional(),
  })
}

export const fetchIdeaActivityRsSchema = z.array(ideaActivitySchema)

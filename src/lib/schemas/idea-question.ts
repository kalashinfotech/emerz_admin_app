import { z } from 'zod/v4'

import { ideaCollaborationSchema } from './idea-collaborator'
import { QuestionGroupEnum, baseQuestionGroupSchema, baseQuestionSchema } from './parameters/question'

const questionSchema = baseQuestionSchema.extend({
  id: z.number(),
  group: baseQuestionGroupSchema,
})

export const baseParticipantAnswerSchema = z.object({
  answer: z.string(),
})

export const participantAnswerSchema = baseParticipantAnswerSchema.extend({
  id: z.number(),
  question: questionSchema,
})

export const createParticipantIdeaAnswerRqSchema = baseParticipantAnswerSchema
  .extend({
    questionId: z.int(),
  })
  .array()

export const updateParticipantAnswerRqSchema = baseParticipantAnswerSchema
  .extend({
    id: z.int(),
    questionId: z.int(),
  })
  .array()

export const fetchQuestionRsSchema = z.object({
  data: z.array(questionSchema),
})

const answersSchema = z.object({
  id: z.int(),
  answer: z.string(),
  answeredAt: z.date(),
  collaborator: ideaCollaborationSchema.nullable(),
})

export const fetchParticipantIdeaAnswersRsSchema = z.object({
  id: z.int(),
  name: z.string(),
  priority: z.int(),
  questions: z.array(questionSchema.extend({ answer: answersSchema.optional().nullable() })),
})

export const fetchQuestionGroupListRsSchema = baseQuestionGroupSchema
  .extend({
    id: z.int(),
  })
  .array()

export const createParticipantAnswersRqSchema = z.object({
  data: z.array(
    z.object({
      id: z.int().optional(),
      questionId: z.int(),
      answerText: z.string(),
    }),
  ),
})

export const fetchQuestionGroupQySchema = z.object({
  group: z.enum(QuestionGroupEnum),
})

import type { z } from 'zod/v4'

import type {
  createQuestionGroupRqSchema,
  createQuestionRqSchema,
  createRqSchema,
  fetchQuestionQySchema,
} from '@/lib/schemas/parameters/question'

export type CreateQuestionGroupRqDto = z.infer<typeof createQuestionGroupRqSchema>
export type CreateQuestionRqDto = z.infer<typeof createQuestionRqSchema>
export type CreateRqDto = z.infer<typeof createRqSchema>
export type FetchQuestionQyDto = z.infer<typeof fetchQuestionQySchema>

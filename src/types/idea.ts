import type { z } from 'zod/v4'

import type {
  createIdeaActivityRqSchema,
  fetchIdeaActivityRsSchema,
  fetchIdeaListRsSchema,
  fetchIdeaRsSchema,
  ideaActivitySchema,
  ideaSchema,
  listIdeaSchema,
} from '@/lib/schemas/idea'

export type FetchIdeaListRsDto = z.infer<typeof fetchIdeaListRsSchema>
export type FetchIdeaRsDto = z.infer<typeof fetchIdeaRsSchema>
export type IdeaModel = z.infer<typeof ideaSchema>
export type ListIdeaModel = z.infer<typeof listIdeaSchema>
export type CreateIdeaActivityRqDto = z.infer<typeof createIdeaActivityRqSchema>
export type FetchIdeaActivityRsDto = z.infer<typeof fetchIdeaActivityRsSchema>
export type IdeaActivityModel = z.infer<typeof ideaActivitySchema>

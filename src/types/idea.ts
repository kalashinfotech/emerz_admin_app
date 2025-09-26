import type { z } from 'zod/v4'

import type { fetchIdeaListRsSchema, fetchIdeaRsSchema, listIdeaSchema } from '@/lib/schemas/idea'

export type FetchIdeaListRsDto = z.infer<typeof fetchIdeaListRsSchema>
export type FetchIdeaRsDto = z.infer<typeof fetchIdeaRsSchema>
export type ListIdeaModel = z.infer<typeof listIdeaSchema>

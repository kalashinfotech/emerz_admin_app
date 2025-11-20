import type { z } from 'zod/v4'

import type {
  createFacultyRqSchema,
  fetchFacultyListQySchema,
  fetchFacultyListRsSchema,
  fetchFacultyListSchema,
  fetchFacultyRsSchema,
} from '@/lib/schemas/faculty'

export type CreateFacultyRqDto = z.infer<typeof createFacultyRqSchema>
export type FetchFacultyListQyDto = z.infer<typeof fetchFacultyListQySchema>
export type FetchFacultyListRsDto = z.infer<typeof fetchFacultyListRsSchema>
export type FetchFacultyRsDto = z.infer<typeof fetchFacultyRsSchema>

export type FacultyModel = z.infer<typeof fetchFacultyListSchema>

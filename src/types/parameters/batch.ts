import type { z } from 'zod/v4'

import type {
  createBatchRqSchema,
  fetchBatchListRsSchema,
  fetchBatchRsSchema,
  updateBatchRqSchema,
} from '@/lib/schemas/parameters/batch'

export type CreateBatchRqDto = z.infer<typeof createBatchRqSchema>
export type UpdateBatchRqDto = z.infer<typeof updateBatchRqSchema>
export type FetchBatchRsDto = z.infer<typeof fetchBatchRsSchema>
export type FetchBatchListRsDto = z.infer<typeof fetchBatchListRsSchema>

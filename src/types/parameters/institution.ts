import type { z } from 'zod/v4'

import type {
  createInstitutionRqSchema,
  fetchInstitutionQySchema,
  updateInstitutionRqSchema,
  updateInstitutionStatusRqSchema,
} from '@/lib/schemas/parameters/institution'

export type CreateInstitutionRqDto = z.infer<typeof createInstitutionRqSchema>
export type UpdateInstitutionRqDto = z.infer<typeof updateInstitutionRqSchema>
export type UpdateInstitutionStatusRqSchema = z.infer<typeof updateInstitutionStatusRqSchema>
export type FetchInstitutionQyDto = z.infer<typeof fetchInstitutionQySchema>

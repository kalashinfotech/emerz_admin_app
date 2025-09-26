import type { z } from 'zod/v4'

import type { fetchParticipantListRsSchema, fetchParticipantSchema } from '@/lib/schemas/client'

export type FetchParticipantRsDto = z.infer<typeof fetchParticipantSchema>
export type FetchParticipantListRsDto = z.infer<typeof fetchParticipantListRsSchema>
export type ParticipantModel = z.infer<typeof fetchParticipantSchema>

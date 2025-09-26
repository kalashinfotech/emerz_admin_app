import { z } from 'zod/v4'

import { CollaboratorStatus } from '@/lib/enums'
import { bareParticipantSchema } from '@/lib/schemas/client'

const baseIdeaCollaborationSchema = z.object({
  designation: z.string().optional(),
  emailId: z.email(),
})

export const ideaCollaborationSchema = baseIdeaCollaborationSchema.extend({
  id: z.number(),
  participantId: z.uuid().nullable(),
  participant: bareParticipantSchema.nullable(),
  status: z.enum(CollaboratorStatus),
  invitedAt: z.string(),
  acceptedAt: z.string().nullable(),
})

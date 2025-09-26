import { z } from 'zod/v4'

import { paginationRsSchema } from './common'
import { bareCountrySchema, bareStateSchema } from './parameters'
import { bareBatchSchemaWithInstitution } from './parameters/batch'

export const GenderEnum = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const

export const baseParticipantSchema = z.object({
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  emailId: z.email(),
  mobileNo: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.enum(GenderEnum).nullable(),
  countryId: z.coerce.number().nullable(),
  stateId: z.coerce.number().nullable(),
  city: z.string().max(100).nullable(),
})

export const participantSchema = baseParticipantSchema.extend({
  id: z.uuid(),
  displayId: z.string(),
  batchId: z.number().nullable(),
  isActive: z.boolean(),
  verifiedDate: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  lastPasswordChangeDate: z.string().nullable(),
  lastLogin: z.string().nullable(),
  loginCount: z.int(),
  profileImageId: z.number().optional().nullable(),
  batch: bareBatchSchemaWithInstitution.nullable(),
  state: bareStateSchema.nullable(),
  country: bareCountrySchema.nullable(),
})

export const bareParticipantSchema = participantSchema
  .pick({
    id: true,
    displayId: true,
    firstName: true,
    middleName: true,
    lastName: true,
    emailId: true,
  })
  .extend({ fullName: z.string().optional() })
  .transform((data) => {
    const fullName = [data.firstName, data.middleName, data.lastName]
      .filter((part) => part && part.trim().length > 0)
      .join(' ')
      .trim()
    return { ...data, fullName }
  })

export const fetchParticipantRsSchema = participantSchema.extend({
  completionPercentage: z.number().default(0),
})

export const fetchParticipantSchema = participantSchema
  .extend({
    fullName: z.string().optional(),
    completionPercentage: z.number().default(0),
  })
  .transform((data) => {
    const fullName = [data.firstName, data.middleName, data.lastName]
      .filter((part) => part && part.trim().length > 0)
      .join(' ')
      .trim()
    return { fullName, ...data }
  })

export const fetchParticipantListRsSchema = z.object({
  data: z.array(fetchParticipantSchema),
  pagination: paginationRsSchema,
})

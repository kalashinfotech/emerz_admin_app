export const CollaboratorStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  ACCEPTED_SHADOW: 'ACCEPTED_SHADOW',
} as const

export type CollaboratorStatus = (typeof CollaboratorStatus)[keyof typeof CollaboratorStatus]

export const UserTypeEnum = {
  SUPERADMIN: 'SUPERADMIN',
  FACULTY: 'FACULTY',
  REGULAR: 'REGULAR',
} as const

export type UserTypeEnum = (typeof UserTypeEnum)[keyof typeof UserTypeEnum]

export const IdeaStageEnum = {
  DRAFT: 'DRAFT',
  PRE_VALIDATION: 'PRE_VALIDATION',
  READINESS: 'READINESS',
  VALIDATION: 'VALIDATION',
  FINALIZED: 'FINALIZED',
  ARCHIVED: 'ARCHIVED',
  DELETED: 'DELETED',
} as const

export type IdeaStageEnum = (typeof IdeaStageEnum)[keyof typeof IdeaStageEnum]

export const IdeaDecisionEnum = {
  PENDING: 'PENDING',
  OK: 'OK',
  REJECT: 'REJECT',
  REDO: 'REDO',
} as const

export type IdeaDecisionEnum = (typeof IdeaDecisionEnum)[keyof typeof IdeaDecisionEnum]

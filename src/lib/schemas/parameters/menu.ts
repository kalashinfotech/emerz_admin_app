import { z } from 'zod/v4'

import { AccessTypeEnum, bareModuleSchema, moduleSchema } from './module'

export const baseMenuGroupSchema = z.object({
  name: z.string(),
})

export const baseMenuItemSchema = z.object({
  groupId: z.int(),
  name: z.string(),
})
export const menuItemSchema = baseMenuItemSchema.extend({
  id: z.int(),
  module: moduleSchema,
  accessType: z.array(z.enum(AccessTypeEnum)),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export const bareMenuItemSchema = menuItemSchema
  .pick({
    id: true,
    name: true,
    accessType: true,
  })
  .extend({
    module: bareModuleSchema,
  })

export const menuGroupSchema = baseMenuGroupSchema.extend({
  id: z.int(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  menuItems: z.array(menuItemSchema),
})

export const bareMenuGroupSchema = menuGroupSchema
  .pick({
    id: true,
    name: true,
  })
  .extend({
    menuItems: z.array(bareMenuItemSchema),
  })

export const fetchMenuRsSchema = z.object({
  menu: z.object({
    menuGroups: z.array(bareMenuGroupSchema),
  }),
})

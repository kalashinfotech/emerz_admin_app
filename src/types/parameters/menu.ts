import type { LucideIcon } from 'lucide-react'
import type { z } from 'zod/v4'

import type { fetchMenuRsSchema } from '@/lib/schemas/parameters/menu'

export type MenuItem = {
  id: number
  name: string
  to: string
  icon: LucideIcon
  animateClass?: string
}

export type MenuGroup = {
  id: number
  name?: string
  menuItems: MenuItem[]
}

export type Menu = {
  menuGroups: MenuGroup[]
}

export type FetchMenuRsDto = z.infer<typeof fetchMenuRsSchema>

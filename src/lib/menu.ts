import { NotebookPen, Terminal, Users } from 'lucide-react'

// Menu items.
const MENU_ITEMS_MAP = [
  {
    module: 'me',
    to: '/profile',
    icon: Users,
  },
  {
    module: 'user_account',
    to: '/user-account',
    icon: Users,
  },
  {
    module: 'role',
    to: '/roles',
    icon: Terminal,
  },
  // {
  //   module: 'email_template',
  //   to: '/email-templates',
  //   icon: Mail,
  // },
  // {
  //   module: 'menu',
  //   to: '/menu',
  //   icon: Menu,
  // },
  // {
  //   module: 'module',
  //   to: '/module',
  //   icon: Menu,
  // },
  {
    module: 'participant',
    to: '/participant',
    icon: Users,
  },
  {
    module: 'idea',
    to: '/idea',
    icon: NotebookPen,
  },
] as const

export const NON_MENU_MODULES = [] as const

const getMenuItem = (module: string) => {
  return MENU_ITEMS_MAP.find((item) => item.module === module)
}

export type ModuleType = (typeof MENU_ITEMS_MAP)[number]['module'] | (typeof NON_MENU_MODULES)[number]['module']

export { getMenuItem }

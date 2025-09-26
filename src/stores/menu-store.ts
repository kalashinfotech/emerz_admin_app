// stores/menuStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { FetchMenuRsDto } from '@/types/parameters/menu'

interface MenuStore {
  menu: FetchMenuRsDto['menu']
  setMenu: (menu: FetchMenuRsDto['menu']) => void
  clearMenu: () => void
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menu: { menuGroups: [] },
      setMenu: (menu) => set({ menu }),
      clearMenu: () => set({ menu: { menuGroups: [] } }),
    }),
    {
      name: 'app_menu',
    },
  ),
)

// export const useMenuStore = create<MenuStore>((set) => ({
//   menu: { menuGroups: [] },
//   setMenu: (menu) => set({ menu }),
//   clearMenu: () => set({ menu: { menuGroups: [] } }),
// }));

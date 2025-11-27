import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, Dot, LogOut, LucideLayoutDashboard, UserCog } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { useAuth } from '@/hooks/use-auth'

import { getMenuItem } from '@/lib/menu'
import { useMenuStore } from '@/stores/menu-store'

export function AppSidebar() {
  const navigate = useNavigate()
  const { state } = useSidebar()
  const { sessionInfo, signOut, setSessionInfo } = useAuth()
  const menu = useMenuStore((s) => s.menu)
  if (!sessionInfo) return null
  const initials = `${sessionInfo.firstName[0]}${sessionInfo.lastName[0]}`

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="pointer-events-none h-auto">
              {state === 'expanded' ? (
                <div className="flex items-end gap-1">
                  <img src="/logo-full.png" className="h-6" />
                  <span className="text-xs font-semibold">ADMIN</span>
                </div>
              ) : (
                <img src="/logo-small.png" className="h-4" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                General
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild size="default">
                      <Link to="/dashboard">
                        <LucideLayoutDashboard className="text-primary" />
                        <span className="text-foreground">Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        {menu.menuGroups.map((group) => (
          <Collapsible key={`group-id-${group.id}`} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {group.name}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.menuItems.map((menuItem) => {
                      let item = getMenuItem(menuItem.module.name)
                      if (!item) {
                        item = { module: 'user_account', to: '/user-account', icon: Dot }
                      }
                      return (
                        <SidebarMenuItem key={`menu-item-${menuItem.id}`}>
                          <SidebarMenuButton asChild size="default">
                            <Link to={item.to}>
                              <item.icon className="text-primary" />
                              <span className="text-foreground">{menuItem.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8 rounded-sm">
                    {sessionInfo.profilePicId && (
                      <AvatarImage
                        className="object-cover"
                        src={`${import.meta.env.VITE_BACKEND_URL}/admin/user-account/profile/${sessionInfo.profilePicId}?size=thumbnail`}
                      />
                    )}
                    <AvatarFallback className="rounded-sm">
                      <span className="text-xs">{initials}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{sessionInfo.firstName}</p>
                    <p className="text-xs">{sessionInfo.emailId}</p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem className="pointer-events-none">
                  <UserCog />
                  <div>
                    Role
                    <p className="text-muted-foreground text-xs">{sessionInfo.roles[0].name}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut()
                    setSessionInfo(null)
                    navigate({ to: '/login', search: { redirect: '/dashboard' } })
                  }}>
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

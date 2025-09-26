import React from 'react'
import type { JSX } from 'react'

import { TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useAuth } from '@/hooks/use-auth'
import { useHasAccess } from '@/hooks/use-has-access'

import type { ModuleType } from '@/lib/menu'
import { cn } from '@/lib/utils'

type LooseAutocomplete<T extends string> = T | Omit<string, T>
type AccessType = LooseAutocomplete<'read' | 'write'>

interface MainProps extends React.HTMLAttributes<React.ComponentRef<'main'>> {
  title: string
  subtitle?: string
  module: ModuleType | ModuleType[]
  requiredPermission: AccessType
  description?: string
  ActionComponent?: JSX.Element
  Icon?: LucideIcon
}

export const Container = React.forwardRef<React.ComponentRef<'main'>, MainProps>(
  (
    { module, requiredPermission, children, className, title, subtitle, description, ActionComponent, Icon, ...props },
    ref,
  ) => {
    const { authInitialized, sessionInfo } = useAuth()
    if (!authInitialized && !sessionInfo) return <div>Loading...</div>
    const [hasAccess] = useHasAccess()
    const isAccessible = hasAccess(module, requiredPermission)

    let IconComponent = null

    if (Icon) {
      IconComponent = Icon
    }
    return (
      <main ref={ref} className={cn('mx-auto w-full px-8', className)} {...props}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {IconComponent && (
                <div className="border-primary border-r py-1 pr-2">
                  <IconComponent className="text-primary h-5 w-5" />
                </div>
              )}
              <h2 className="text-2xl font-medium">
                {title}
                {subtitle && <span className="text-muted-foreground text-xs uppercase"> / {subtitle}</span>}
              </h2>
            </div>
            {description && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
          </div>
          {ActionComponent && ActionComponent}
        </div>

        {isAccessible ? (
          <div className="mt-3">{children}</div>
        ) : (
          <div className={cn('flex min-h-[80vh] flex-col items-center justify-center px-4 text-center')}>
            <div className="mx-auto flex max-w-md flex-col items-center gap-2">
              <div className="bg-destructive flex h-12 w-12 items-center justify-center rounded-full">
                <TriangleAlert size={30} className="text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl">Access Denied!</h1>
              <p className="text-muted-foreground mb-8 text-sm">
                You do not have access to this page. Contact administrator if you want to access this page.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Button variant="ghost" className="min-w-[140px]">
                  Go Back
                </Button>
                <Button onClick={() => (window.location.href = '/dashboard')} className="min-w-[140px]">
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  },
)

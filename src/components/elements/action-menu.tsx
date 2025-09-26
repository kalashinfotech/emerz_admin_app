import { useState } from 'react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

import type { Row } from '@tanstack/table-core'
import type { VariantProps } from 'class-variance-authority'
import { MoreHorizontal } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

import type { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { Error } from '@/components/elements/error'
import { Loader } from '@/components/elements/loader'

import { useAuth } from '@/hooks/use-auth'
import { useHasAccess } from '@/hooks/use-has-access'

import type { ModuleType } from '@/lib/menu'
import { cn } from '@/lib/utils'

export interface Action<T> {
  label: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  slug?: ModuleType | ModuleType[]
  requiredPermission?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  onClick: (row: T) => void
  separator?: boolean // Adds a separator before this item if true
  disabled?: boolean | ((row: T) => boolean)
  cond?: (row: T) => boolean
}

interface ActionMenuProps<T> {
  row: Row<T>
  actions: Action<T>[]
  disabled?: boolean
}

const ActionMenu = <T,>({ row, actions, disabled = false }: ActionMenuProps<T>) => {
  const { sessionInfo, authInitialized } = useAuth()
  const [open, setOpen] = useState(false)
  const [hasAccess] = useHasAccess()

  if (!authInitialized) return <Loader />
  if (!sessionInfo) return <Error />
  const filteredActions = actions.filter((action) => {
    const hasPermission = !action.slug || !action.requiredPermission || hasAccess(action.slug, action.requiredPermission)
    const condition = action.cond ? action.cond(row.original) : true
    return hasPermission && condition
  })

  if (filteredActions.length === 0) return null

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hover:bg-transparent" disabled={disabled}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center">Actions</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div className="mx-auto flex items-center justify-center gap-0">
            {filteredActions.map((action, index) => {
              return (
                <div className="flex h-full" key={`action-${index}`}>
                  {action.separator && <Separator orientation="vertical" />}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          'w-12 cursor-pointer rounded-none ring-0 focus-visible:opacity-90 focus-visible:ring-0',
                          {
                            'rounded-s-full': index === 0,
                            'rounded-e-full': index === filteredActions.length - 1,
                          },
                        )}
                        variant={action.variant ? action.variant : 'default'}
                        onClick={() => {
                          setOpen(false)
                          action.onClick(row.original)
                        }}
                        disabled={
                          typeof action.disabled === 'function'
                            ? action.disabled(row.original)
                            : action.disabled
                              ? true
                              : false
                        }>
                        <action.icon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className={cn({ 'bg-destructive': action.variant === 'destructive' })}
                      iconClassName={cn({ 'bg-destructive fill-destructive': action.variant === 'destructive' })}>
                      <span className={cn('font-medium', { 'text-background': action.variant === 'destructive' })}>
                        {action.label}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ActionMenu

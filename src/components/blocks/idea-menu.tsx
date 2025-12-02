import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, BadgeCheck, BadgeX, MoreHorizontalIcon, RefreshCcw, Star, Users2 } from 'lucide-react'

import type { IdeaModel } from '@/types'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAuth } from '@/hooks/use-auth'

import type { IdeaActionEnum } from '@/lib/enums'

type IdeaMenuProps = {
  idea: IdeaModel
  setAction: (action: IdeaActionEnum) => void
  setOpenActivityModal: (o: boolean) => void
}

function IdeaMenu({ idea, setAction, setOpenActivityModal }: IdeaMenuProps) {
  const { sessionInfo } = useAuth()
  const router = useRouter()
  const canGoBack = useCanGoBack()

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Back"
          disabled={!canGoBack}
          onClick={() => router.history.back()}>
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
      {['SUPERADMIN', 'REGULAR'].includes(sessionInfo?.userType || '') && (
        <ButtonGroup>
          <Button
            variant="outline"
            onClick={() => {
              setAction('REJECT')
              setOpenActivityModal(true)
            }}
            disabled={!idea.allowedActions.includes('REJECT') && !(idea.stage === 'STAGE_1')}>
            <BadgeX className="text-destructive" />
            Reject
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAction('REWORK')
              setOpenActivityModal(true)
            }}
            disabled={!idea.allowedActions.includes('REWORK') && !(idea.stage === 'STAGE_1')}>
            <RefreshCcw className="text-primary" />
            Rework
          </Button>
          {idea.allowedActions.includes('ACCEPT_ASSIGN') ? (
            <Button
              variant="outline"
              onClick={() => {
                setAction('ACCEPT_ASSIGN')
                setOpenActivityModal(true)
              }}
              disabled={!idea.allowedActions.includes('ACCEPT_ASSIGN') && !(idea.stage === 'STAGE_1')}>
              <BadgeCheck className="text-secondary" />
              Accept & Assign
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setAction('ACCEPT')
                setOpenActivityModal(true)
              }}
              disabled={!idea.allowedActions.includes('ACCEPT') && !(idea.stage === 'STAGE_1')}>
              <BadgeCheck className="text-secondary" />
              Accept
            </Button>
          )}
        </ButtonGroup>
      )}
      {['FACULTY'].includes(sessionInfo?.userType || '') && (
        <>
          <ButtonGroup>
            <Button
              variant="outline"
              onClick={() => {
                setAction('REJECT')
                setOpenActivityModal(true)
              }}
              disabled={!idea.allowedActions.includes('REJECT')}>
              <BadgeX className="text-destructive" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAction('ACCEPT')
                setOpenActivityModal(true)
              }}
              disabled={!idea.allowedActions.includes('ACCEPT')}>
              <BadgeCheck className="text-secondary" />
              Accept
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              variant="outline"
              onClick={() => {
                setAction('ACCEPT')
                setOpenActivityModal(true)
              }}
              disabled={!idea.allowedActions.includes('RATE')}>
              <Star className="text-primary" />
              Rate Idea
            </Button>
          </ButtonGroup>
        </>
      )}
      <ButtonGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Users2 />
                View Collaborators
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export { IdeaMenu }

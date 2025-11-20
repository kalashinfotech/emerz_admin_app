import * as React from 'react'

import {
  ArchiveIcon,
  ArrowLeftIcon,
  BadgeCheck,
  BadgeX,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterPlusIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  RefreshCcw,
  TagIcon,
  Trash2Icon,
} from 'lucide-react'

import type { IdeaModel } from '@/types'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { IdeaActionEnum } from '@/lib/enums'

type IdeaMenuProps = {
  idea: IdeaModel
  setAction: (action: IdeaActionEnum) => void
  setOpenActivityModal: (o: boolean) => void
}

function IdeaMenu({ setAction, setOpenActivityModal }: IdeaMenuProps) {
  const [label, setLabel] = React.useState('personal')

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          variant="outline"
          onClick={() => {
            setAction('REJECT')
            setOpenActivityModal(true)
          }}>
          <BadgeX />
          Reject
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setAction('REWORK')
            setOpenActivityModal(true)
          }}>
          <RefreshCcw />
          Rework
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setAction('ACCEPT')
            setOpenActivityModal(true)
          }}>
          <BadgeCheck />
          Accept
        </Button>
      </ButtonGroup>
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
                <MailCheckIcon />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterPlusIcon />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={label} onValueChange={setLabel}>
                    <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export { IdeaMenu }

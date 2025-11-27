import { useState } from 'react'

import type { AxiosError } from 'axios'
import type { VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { BadgeCheck, BadgeX, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

import type { CreateIdeaActivityRqDto, IdeaModel, TError } from '@/types'

import { Button } from '@/components/ui/button'
import type { buttonVariants } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'

import { UseCreateIdeaActivity } from '@/api/idea'

import { useAppForm } from '@/hooks/use-app-form'

import type { IdeaActionEnum, IdeaStatusEnum } from '@/lib/enums'
import { generateCreateIdeaActivityDynamicRqSchema } from '@/lib/schemas/idea'

import { UserSearchMenu } from '../blocks/user-search-popover'
import type { UserSearchMenuOption } from '../blocks/user-search-popover'

type IdeaActivityModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  idea: IdeaModel
  action: IdeaActionEnum
  successFn?: () => void
  errorFn?: () => void
}

type actionMap = {
  button: string
  title: string
  description: string
  success: string
  icon: LucideIcon
  buttonVariant?: VariantProps<typeof buttonVariants>['variant']
  status?: Partial<Record<IdeaStatusEnum, Partial<Omit<actionMap, 'status'>>>>
}

const actionMap: Partial<Record<IdeaActionEnum, actionMap>> = {
  ACCEPT: {
    button: 'Accept',
    title: 'Accept Idea',
    description: 'Provide your comments or reasons for approving this idea.',
    success: 'Idea accepted successfully.',
    icon: BadgeCheck,
    buttonVariant: 'secondary',
    status: {
      COACH_PENDING: {
        title: 'Accept Idea Assignment',
        description: 'Optionally provide comments for accepting this idea assignment.',
        success: 'Idea assignment accepted successfully.',
      },
    },
  },

  REJECT: {
    button: 'Reject',
    title: 'Reject Idea',
    description: 'Provide clear reasons for rejecting this idea.',
    success: 'Idea rejected successfully.',
    icon: BadgeX,
    buttonVariant: 'destructive',
    status: {
      COACH_PENDING: {
        title: 'Reject Idea Assignment',
        description: 'Provide comments for rejecting this idea assignment.',
        success: 'Idea assignment rejected successfully.',
      },
    },
  },

  REWORK: {
    button: 'Rework',
    title: 'Request Rework',
    description: 'Explain what needs to be improved or revised in this idea.',
    success: 'Idea sent for rework successfully.',
    icon: RefreshCcw,
    buttonVariant: 'default',
  },
  ACCEPT_ASSIGN: {
    button: 'Accept',
    title: 'Accept Idea',
    description: 'Provide your comments or reasons for approving this idea.',
    success: 'Idea accepted & assigned successfully.',
    icon: BadgeCheck,
    buttonVariant: 'secondary',
  },
}
export const IdeaActivityModal = ({ open, onOpenChange, idea, action, successFn, errorFn }: IdeaActivityModalProps) => {
  const { createIdeaActivity } = UseCreateIdeaActivity(idea.id)
  const [option, setOption] = useState<UserSearchMenuOption | undefined>()

  const schema = generateCreateIdeaActivityDynamicRqSchema(idea.status === 'COACH_PENDING')

  const form = useAppForm({
    defaultValues: { response: '', action: action } as CreateIdeaActivityRqDto,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        await createIdeaActivity({ request: { ...value, facultyId: option?.id } })
        toast.success('Success!', {
          description: actionMap[action]?.status?.[idea.status]?.success || actionMap[action]!.success,
        })
        onOpenChange(false)
        form.reset()
        if (successFn) successFn()
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(err.response?.data.error?.message || 'Something went wrong. Please contact administrator')
        if (errorFn) errorFn()
      }
    },
  })
  const handleUserSearch = (opt?: UserSearchMenuOption) => {
    form.setFieldValue('facultyId', opt?.obj?.id ?? '')
  }

  return (
    <form
      className="flex flex-col space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
      <Credenza
        open={open}
        onOpenChange={(o) => {
          onOpenChange(o)
          form.reset()
        }}>
        <CredenzaContent className="p-8">
          <CredenzaHeader>
            <CredenzaTitle>{actionMap[action]?.status?.[idea.status]?.title || actionMap[action]!.title}</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaDescription>
            {actionMap[action]?.status?.[idea.status]?.description || actionMap[action]!.description}
          </CredenzaDescription>
          <CredenzaBody className="text-sm">
            <div className="space-y-3">
              {action === 'ACCEPT_ASSIGN' && (
                <UserSearchMenu
                  option={option}
                  setOption={(opts) => {
                    handleUserSearch(opts)
                    setOption(opts)
                  }}
                  userType="FACULTY"
                />
              )}
              <form.AppField name="response">
                {(field) => (
                  <field.TextArea
                    maxLength={1000}
                    className="h-100"
                    label="Response"
                    placeholder="Enter your response..."
                    mandatory={!(idea.status === 'COACH_PENDING' && action === 'ACCEPT')}
                  />
                )}
              </form.AppField>
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <form.AppForm>
              <CredenzaClose asChild>
                <Button variant="cancel">Close</Button>
              </CredenzaClose>
              <form.SubscribeButton
                type="submit"
                label={actionMap[action]!.button}
                icon={actionMap[action]!.icon}
                variant={actionMap[action]!.buttonVariant}
                onClick={form.handleSubmit}
              />
            </form.AppForm>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </form>
  )
}

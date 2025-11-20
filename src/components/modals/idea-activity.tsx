import type { AxiosError } from 'axios'
import { BadgeCheck, BadgeX, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

import type { CreateIdeaActivityRqDto, TError } from '@/types'

import { Button } from '@/components/ui/button'
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

import type { IdeaActionEnum } from '@/lib/enums'
import { createIdeaActivityRqSchema } from '@/lib/schemas/idea'
import { capitalize } from '@/lib/text-utils'

type IdeaActivityModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ideaId: string
  action: IdeaActionEnum
  successFn?: () => void
  errorFn?: () => void
}
export const IdeaActivityModal = ({ open, onOpenChange, ideaId, action, successFn, errorFn }: IdeaActivityModalProps) => {
  const { createIdeaActivity } = UseCreateIdeaActivity(ideaId)
  const form = useAppForm({
    defaultValues: { response: '', action: action } as CreateIdeaActivityRqDto,
    validators: {
      onSubmit: createIdeaActivityRqSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createIdeaActivity({ request: value })
        let msg = 'Idea updated successfully.'
        if (action === 'ACCEPT') {
          msg = 'Idea accepted successfully.'
        } else if (action === 'REJECT') {
          msg = 'Idea rejected successfully. Idea will be in review before completely rejecting it.'
        } else {
          msg = 'Idea sent back for rework.'
        }
        toast.success('Success!', { description: msg })
        onOpenChange(false)
        form.reset()
        if (successFn) successFn()
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(err.response?.data.error.message)
        if (errorFn) errorFn()
      }
    },
  })
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
            <CredenzaTitle>{capitalize(action)} Idea</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaDescription>Enter your comments/reasons clearly to update this idea.</CredenzaDescription>
          <CredenzaBody className="text-sm">
            <div className="space-y-3">
              <form.AppField name="response">
                {(field) => (
                  <field.TextArea
                    maxLength={1000}
                    className="h-100"
                    label="Response"
                    placeholder="Enter your response..."
                    mandatory={true}
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
                label={capitalize(action)}
                icon={action === 'ACCEPT' ? BadgeCheck : action === 'REJECT' ? BadgeX : RefreshCcw}
                variant={action === 'ACCEPT' ? 'default' : action === 'REJECT' ? 'destructive' : 'secondary'}
                onClick={form.handleSubmit}
              />
            </form.AppForm>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </form>
  )
}

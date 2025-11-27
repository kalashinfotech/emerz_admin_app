import type { AxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import type { CreateFacultyRqDto, TError } from '@/types'

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

import { UseCreateFaculty } from '@/api/faculty'

import { useAppForm } from '@/hooks/use-app-form'

import type { UserTypeEnum } from '@/lib/enums'
import { createFacultyRqSchema } from '@/lib/schemas/faculty'

type FacultyAddModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userType: UserTypeEnum
  successFn?: () => void
  errorFn?: () => void
}
export const FacultyAddModal = ({ open, onOpenChange, userType, successFn, errorFn }: FacultyAddModalProps) => {
  const { createFaculty } = UseCreateFaculty(userType)
  const form = useAppForm({
    defaultValues: { certifications: [] as string[] } as CreateFacultyRqDto,
    validators: {
      onSubmit: createFacultyRqSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createFaculty({ request: value })
        toast.success('Success!', {
          description: 'New user account created successfully.',
        })
        onOpenChange(false)
        form.reset()
        if (successFn) successFn()
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(err.response?.data.error?.message || 'Something went wrong. Please contact administrator!')
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
        }}>
        <CredenzaContent className="p-8">
          <CredenzaHeader>
            <CredenzaTitle>New Faculty User</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaDescription>
            Create new faculty user account. User will receive email with onboarding instructions once account is created.
          </CredenzaDescription>
          <CredenzaBody className="text-sm">
            <div className="space-y-3">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField
                    maxLength={100}
                    label="First Name"
                    placeholder="Enter first name..."
                    mandatory={true}
                  />
                )}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField maxLength={100} label="Last Name" placeholder="Enter last name..." mandatory={true} />
                )}
              </form.AppField>
              <div className="grid grid-cols-1 gap-3">
                <form.AppField name="emailId">
                  {(field) => <field.TextField label="Email ID" placeholder="Enter email id..." mandatory={true} />}
                </form.AppField>
                <form.AppField name="role">
                  {(field) => (
                    <field.Select
                      mandatory={true}
                      label="Role"
                      values={[
                        { label: 'Business Coach', value: '4' },
                        { label: 'Business Mentor', value: '5' },
                      ]}
                      placeholder="Select role"
                    />
                  )}
                </form.AppField>
              </div>
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <form.AppForm>
              <CredenzaClose asChild>
                <Button variant="cancel">Close</Button>
              </CredenzaClose>
              <form.SubscribeButton type="submit" label="Create" icon={Plus} onClick={form.handleSubmit} />
            </form.AppForm>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </form>
  )
}

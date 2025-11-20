import { useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Lightbulb, NotebookText, Users2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IdeaMenu } from '@/components/blocks/idea-menu'
import { Container } from '@/components/elements/container'
import { ProfileAvatar } from '@/components/elements/profile-avatar'
import { IdeaActivityModal } from '@/components/modals/idea-activity'
import { IdeaAcitivityTab } from '@/components/tabs/idea-activity'

import { fetchIdeaById } from '@/api/idea'

import { formatUtcStringToLocalDisplay } from '@/lib/date-utils'
import type { IdeaActionEnum } from '@/lib/enums'
import { titleCase } from '@/lib/text-utils'

export const Route = createFileRoute('/_private/idea/$ideaId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { ideaId } = Route.useParams()
  const { data } = useSuspenseQuery(fetchIdeaById(ideaId))
  const [action, setAction] = useState<IdeaActionEnum>()
  const [openActivityModal, setOpenActivityModal] = useState(false)
  return (
    <>
      <Container title="Ideas" subtitle={data.title} requiredPermission="read" module={['idea', 'me_idea']}>
        <Tabs defaultValue="tab-1">
          <ScrollArea>
            <TabsList className="mb-3">
              <TabsTrigger value="tab-1">
                <Lightbulb className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="tab-2" className="group">
                <Users2 className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Team
                <Badge
                  className="bg-primary ms-1.5 h-5 w-5 min-w-5 px-1 text-[0.625rem] transition-opacity group-data-[state=inactive]:opacity-50"
                  variant="secondary">
                  {data.collaborators?.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="tab-3" className="group">
                <NotebookText className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Activity
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="tab-1" className="space-y-2">
            <IdeaMenu idea={data} setAction={setAction} setOpenActivityModal={setOpenActivityModal} />
            <Card className="w-[80%]">
              <CardHeader>
                <CardTitle>{data.title}</CardTitle>{' '}
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-start gap-6">
                  <ProfileAvatar
                    firstName={data.owner.firstName}
                    lastName={data.owner.lastName}
                    subText={data.owner.emailId}
                  />
                  <Separator orientation="vertical" className="min-h-12 max-w-px" />
                  <div>
                    <p>{data.displayId}</p>
                    <p className="text-muted-foreground text-[0.7rem] font-medium">
                      {formatUtcStringToLocalDisplay(data.createdAt)}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="min-h-12 max-w-px shrink-0" />
                  <div className="flex items-center gap-2">
                    <div>
                      <p>{titleCase(data.stage.replace('_', ' '))}</p>
                      <p className="text-muted-foreground text-[0.7rem] font-medium">{titleCase(data.status, '_')}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Idea Overview</p>
                  <div className="mt-2 space-y-4">
                    {data.answers?.map((q, index) => {
                      return (
                        <div key={`question-${index}`} className="space-y-1">
                          <p className="text-muted-foreground">
                            {index + 1}. {q.question.name}
                          </p>
                          <p className="ml-5">{q.answer}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div></div>
              </CardContent>
              <CardFooter className="justify-end-safe gap-2"></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="tab-2">
            <Card className="w-[80%]">
              <CardHeader>
                <CardTitle>Idea Partners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="text-muted-foreground grid grid-cols-5 items-center text-xs font-medium">
                  <p>User</p>
                  <p>Role</p>
                  <p>Status</p>
                  <p>Invited At</p>
                  <p>Accepted At</p>
                </div>
                <Separator />
                {data.collaborators?.map((c, index) => {
                  return (
                    <div key={`collaborator-${index}`}>
                      <div className="grid grid-cols-5 items-center">
                        {c.participant?.firstName && c.participant.lastName ? (
                          <ProfileAvatar
                            firstName={c.participant.firstName}
                            lastName={c.participant.lastName}
                            subText={c.participant.emailId}
                          />
                        ) : (
                          <ProfileAvatar firstName={' '} lastName={' '} subText={c.emailId} />
                        )}
                        <p>{c.designation}</p>
                        <p>{titleCase(c.status)}</p>
                        <p>{formatUtcStringToLocalDisplay(c.invitedAt)}</p>
                        <p>
                          {c.designation === 'Owner'
                            ? formatUtcStringToLocalDisplay(c.invitedAt)
                            : c.acceptedAt
                              ? formatUtcStringToLocalDisplay(c.acceptedAt)
                              : '-'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab-3">
            <IdeaAcitivityTab ideaId={ideaId} />
          </TabsContent>
        </Tabs>
      </Container>
      <IdeaActivityModal ideaId={ideaId} action={action!} open={openActivityModal} onOpenChange={setOpenActivityModal} />
    </>
  )
}

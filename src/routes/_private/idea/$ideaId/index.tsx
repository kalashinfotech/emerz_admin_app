import { useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Lightbulb, NotebookText, Users2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IdeaMenu } from '@/components/blocks/idea-menu'
import { Container } from '@/components/elements/container'
import { ProfileAvatar } from '@/components/elements/profile-avatar'
import { IdeaActivityModal } from '@/components/modals/idea-activity'
import { IdeaAcitivityTab } from '@/components/tabs/idea-activity'
import { IdeaOverviewTab } from '@/components/tabs/idea-overview'
import { IdeaStage2Tab } from '@/components/tabs/idea-stage2'

import { fetchIdeaById } from '@/api/idea'

import { formatUtcStringToLocalDisplay } from '@/lib/date-utils'
import type { IdeaActionEnum } from '@/lib/enums'
import { titleCase } from '@/lib/text-utils'

export const Route = createFileRoute('/_private/idea/$ideaId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { ideaId } = Route.useParams()
  const { data, refetch } = useSuspenseQuery(fetchIdeaById(ideaId))
  const [action, setAction] = useState<IdeaActionEnum>()
  const [openActivityModal, setOpenActivityModal] = useState(false)
  const stage2Answers = data.answers?.filter((a) => a.question.group.groupType === 'STAGE_2')
  return (
    <>
      <Container title="Idea" Icon={Lightbulb} requiredPermission="read" module={['idea', 'me_idea']}>
        <Tabs defaultValue="tab-1">
          <ScrollArea>
            <TabsList className="mb-3">
              <TabsTrigger value="tab-1">
                <Lightbulb className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Overview
              </TabsTrigger>
              {stage2Answers && stage2Answers.length > 0 && (
                <TabsTrigger value="tab-4">
                  <Lightbulb className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                  BIVR
                </TabsTrigger>
              )}
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
            </CardContent>
          </Card>
          <TabsContent value="tab-1" className="space-y-2">
            <IdeaOverviewTab idea={data} />
          </TabsContent>
          <TabsContent value="tab-4">
            <IdeaStage2Tab idea={data} />
          </TabsContent>
          <TabsContent value="tab-2">
            <Card className="w-[80%]">
              <CardHeader>
                <CardTitle>Idea Partners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="text-muted-foreground grid grid-cols-6 items-center text-xs font-medium">
                  <p className="col-span-2">User</p>
                  <p>Role</p>
                  <p>Status</p>
                  <p>Invited At</p>
                  <p>Accepted At</p>
                </div>
                <Separator />
                {data.collaborators?.map((c, index) => {
                  return (
                    <div key={`collaborator-${index}`}>
                      <div className="grid grid-cols-6 items-center">
                        <div className="col-span-2">
                          {c.participant?.firstName && c.participant.lastName ? (
                            <ProfileAvatar
                              firstName={c.participant.firstName}
                              lastName={c.participant.lastName}
                              subText={c.participant.emailId}
                            />
                          ) : (
                            <ProfileAvatar firstName={' '} lastName={' '} subText={c.emailId} />
                          )}
                        </div>
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
      {action && (
        <IdeaActivityModal
          idea={data}
          action={action}
          open={openActivityModal}
          onOpenChange={setOpenActivityModal}
          successFn={refetch}
        />
      )}
    </>
  )
}

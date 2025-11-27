import type { IdeaModel } from '@/types'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type IdeaOverviewTabProps = {
  idea: IdeaModel
}
const IdeaOverviewTab = ({ idea: data }: IdeaOverviewTabProps) => {
  const answers = data.answers?.filter((a) => a.question.group.groupType === 'STAGE_0')
  return (
    <Card className="w-[80%]">
      <CardHeader>
        <CardTitle>Idea Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {answers?.map((q, index) => {
          return (
            <div key={`question-${index}`} className="space-y-1">
              <p className="text-muted-foreground">
                {index + 1}. {q.question.name}
              </p>
              <p className="ml-5">{q.answer}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export { IdeaOverviewTab }

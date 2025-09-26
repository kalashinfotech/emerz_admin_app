import type { Row } from '@tanstack/table-core'

import { formatUtcStringToLocalDisplay } from '@/lib/date-utils'

type HasCreatedAt = {
  createdAt: string // or `Date` if you're using Date objects
}

type CreationDateProps<T extends HasCreatedAt> = {
  row: Row<T>
}

export const CreationDate = <T extends HasCreatedAt>({ row }: CreationDateProps<T>) => {
  const dt = row.original.createdAt
  return <>{dt ? <p>{formatUtcStringToLocalDisplay(dt)}</p> : <p>-</p>}</>
}

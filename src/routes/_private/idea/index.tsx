import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { CircleDashed, ClipboardCopy, Trash2 } from 'lucide-react'

import type { ListIdeaModel } from '@/types'
import type { FilterOption } from '@/types/common/filter'
import type { QueryParams } from '@/types/common/search-params'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import DataTable from '@/components/ui/data-table'

import ActionMenu from '@/components/elements/action-menu'
import type { Action } from '@/components/elements/action-menu'
import { Container } from '@/components/elements/container'
import { ProfileAvatar } from '@/components/elements/profile-avatar'

import { fetchIdeas } from '@/api/idea'

import { useAuth } from '@/hooks/use-auth'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useHasAccess } from '@/hooks/use-has-access'
import { useSearchParams } from '@/hooks/use-search-params'

import { formatUtcStringToLocalDisplay } from '@/lib/date-utils'
import { IdeaDecisionEnum, IdeaStageEnum } from '@/lib/enums'
import { filterToState, sortByToState, stateToFilter, stateToSortBy } from '@/lib/search-params'
import { titleCase } from '@/lib/text-utils'
import { enumToOptions } from '@/lib/utils'

export const Route = createFileRoute('/_private/idea/')({
  component: RouteComponent,
  validateSearch: () => ({}) as QueryParams,
})

const filterOptions: FilterOption[] = [
  { id: 'search', label: 'Title, created by, email, etc.' },
  { id: 'decision', label: 'Decision', options: enumToOptions(IdeaDecisionEnum) },
  { id: 'stage', label: 'Stage', options: enumToOptions(IdeaStageEnum) },
]

function RouteComponent() {
  const { sessionInfo } = useAuth()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { searchParams, setSearchParams } = useSearchParams(Route.id)
  const pagination = { pageIndex: searchParams.pageIndex ?? 0, pageSize: searchParams.pageSize ?? 10 }
  const columnSorters = sortByToState(searchParams.sortBy)
  const columnFilters = filterToState(searchParams)
  const { data, isPending, isError, error, isFetching } = useQuery(
    fetchIdeas(pagination.pageIndex, columnFilters, columnSorters, pagination.pageSize),
  )
  const [hasAccess] = useHasAccess()
  const { copy } = useCopyToClipboard()
  const actions: Action<ListIdeaModel>[] = useMemo(
    () => [
      {
        label: 'Copy ID',
        requiredPermission: 'read',
        icon: ClipboardCopy,
        onClick: async (row) => copy(row.displayId),
      },
      {
        label: 'Delete',
        slug: 'idea',
        requiredPermission: 'write',
        variant: 'destructive',
        icon: Trash2,
        onClick: (row) => {
          console.log(row)
        },
      },
    ],
    [sessionInfo?.id],
  )

  const tableColumns: ColumnDef<ListIdeaModel>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            className="data-[state=checked]:border-input bg-transparent"
            checked={table.getIsSomeRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
            onCheckedChange={(e) => {
              table.toggleAllRowsSelected(e as boolean)
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <Checkbox
              className="bg-card"
              disabled={!row.getCanSelect()}
              checked={row.getIsSelected()}
              onCheckedChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        enableSorting: true,
        cell: ({ row }) => {
          const fn = row.original.title
          return (
            <div className="flex items-center gap-2">
              <Button asChild variant="avatar">
                <Link to="/idea/$ideaId" params={{ ideaId: row.original.id }}>
                  <div>
                    {fn}
                    <p className="text-muted-foreground text-[0.7rem] font-medium">{row.original.displayId}</p>
                  </div>
                </Link>
              </Button>
            </div>
          )
        },
      },
      {
        accessorKey: 'stage',
        header: 'Stage',
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <CircleDashed className="size-4" />
              {titleCase(row.original.stage.replace('_', ' '))}
            </div>
          )
        },
      },
      {
        accessorKey: 'decision',
        header: 'Decision',
        enableSorting: true,
        cell: ({ row }) => {
          return <Badge variant="warning">{titleCase(row.original.decision)}</Badge>
        },
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        enableSorting: true,
        cell: ({ row }) => {
          const owner = row.original.owner
          return <ProfileAvatar firstName={owner.firstName} lastName={owner.lastName} imageUrl={undefined} />
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Registration',
        enableSorting: true,
        cell: ({ row }) => {
          const dt = row.original.createdAt
          return <>{dt ? <p>{formatUtcStringToLocalDisplay(dt)}</p> : <p>-</p>}</>
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          return <ActionMenu actions={actions} row={row} />
        },
      },
    ],
    [actions, hasAccess],
  )

  return (
    <>
      <Container title="Ideas" subtitle="List" module="participant" requiredPermission="read">
        <DataTable
          columns={tableColumns}
          data={isFetching ? [] : data?.data || []}
          pagination={pagination}
          setPagination={(updaterOrValue) => {
            setSearchParams(typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue)
          }}
          rowCount={data?.pagination.totalRows || 0}
          pageCount={data?.pagination.totalPages || 0}
          isFetching={isPending || isFetching}
          isError={isError}
          error={error}
          filterOptions={filterOptions}
          columnFilters={columnFilters}
          setColumnFilters={(updaterOrValue) => {
            const newFilterState = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue
            return setSearchParams(stateToFilter(newFilterState), true)
          }}
          sorting={columnSorters}
          setSorting={(updaterOrValue) => {
            const newSortingState = typeof updaterOrValue === 'function' ? updaterOrValue(columnSorters) : updaterOrValue
            return setSearchParams({ sortBy: stateToSortBy(newSortingState) })
          }}
          enableSorting={true}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          enableRowSelection={true}
        />
      </Container>
    </>
  )
}

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { ClipboardCopy, MarsIcon, NonBinary, Trash2, VenusIcon } from 'lucide-react'

import type { ParticipantModel } from '@/types'
import type { FilterOption } from '@/types/common/filter'
import type { QueryParams } from '@/types/common/search-params'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CopyButton } from '@/components/ui/copy-button'
import DataTable from '@/components/ui/data-table'

import ActionMenu from '@/components/elements/action-menu'
import type { Action } from '@/components/elements/action-menu'
import { Container } from '@/components/elements/container'
import { ProfileAvatar } from '@/components/elements/profile-avatar'

import { fetchParticipants } from '@/api/participant'

import { useAuth } from '@/hooks/use-auth'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useHasAccess } from '@/hooks/use-has-access'
import { useSearchParams } from '@/hooks/use-search-params'

import { formatUtcStringToLocalDisplay } from '@/lib/date-utils'
import { filterToState, sortByToState, stateToFilter, stateToSortBy } from '@/lib/search-params'

export const Route = createFileRoute('/_private/participant/')({
  component: RouteComponent,
  validateSearch: () => ({}) as QueryParams,
})

const filterOptions: FilterOption[] = [
  { id: 'search', label: 'Name, address, mobile, email, etc.' },
  {
    id: 'gender',
    label: 'Gender',
    options: [
      { label: 'Male', value: 'MALE' },
      { label: 'Female', value: 'FEMALE' },
      { label: 'Other', value: 'OTHER' },
    ],
  },
]

function RouteComponent() {
  const { sessionInfo } = useAuth()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { searchParams, setSearchParams } = useSearchParams(Route.id)
  const pagination = { pageIndex: searchParams.pageIndex ?? 0, pageSize: searchParams.pageSize ?? 10 }
  const columnSorters = sortByToState(searchParams.sortBy)
  const columnFilters = filterToState(searchParams)
  const { data, isPending, isError, error, isFetching } = useQuery(
    fetchParticipants(pagination.pageIndex, columnFilters, columnSorters, pagination.pageSize),
  )
  const [hasAccess] = useHasAccess()
  const { copy } = useCopyToClipboard()
  const actions: Action<ParticipantModel>[] = useMemo(
    () => [
      {
        label: 'Copy ID',
        requiredPermission: 'read',
        icon: ClipboardCopy,
        onClick: async (row) => copy(row.displayId),
      },
      {
        label: 'Delete',
        slug: 'participant',
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

  const tableColumns: ColumnDef<ParticipantModel>[] = useMemo(
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
        accessorKey: 'fullName',
        header: 'Name',
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Button asChild variant="avatar">
                <Link to="/">
                  <div>
                    <ProfileAvatar
                      firstName={row.original.firstName}
                      lastName={row.original.lastName}
                      imageUrl={undefined}
                      subText={row.original.displayId}
                    />
                  </div>
                </Link>
              </Button>
            </div>
          )
        },
      },
      {
        accessorKey: 'emailId',
        header: 'Email ID',
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <>
              {row.original.emailId ? (
                <div className="flex items-center gap-2">
                  <p>{row.original.emailId}</p>
                  <CopyButton text={row.original.emailId} />
                </div>
              ) : (
                <p>-</p>
              )}
            </>
          )
        },
      },
      {
        accessorKey: 'mobileNo',
        header: 'Mobile No',
        enableSorting: true,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        enableSorting: true,
        cell: ({ row }) => {
          if (row.original.gender === 'MALE') {
            return (
              <div className="flex items-center gap-1">
                <MarsIcon className="size-3" />
                Male
              </div>
            )
          } else if (row.original.gender === 'FEMALE') {
            return (
              <div className="flex items-center gap-1">
                <VenusIcon className="size-3" />
                Female
              </div>
            )
          } else if (row.original.gender === 'OTHER') {
            return (
              <div className="flex items-center gap-1">
                <NonBinary className="size-3" />
                Other
              </div>
            )
          } else {
            return '-'
          }
        },
      },
      {
        accessorKey: 'dateOfBirth',
        header: 'Date of Birth',
        enableSorting: true,
        cell: ({ row }) => {
          const dt = row.original.dateOfBirth
          if (dt) return <p>{formatUtcStringToLocalDisplay(dt)}</p>
          else return <p>-</p>
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
      <Container title="Participants" subtitle="List" module="participant" requiredPermission="read">
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

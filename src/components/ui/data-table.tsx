import type {
  ColumnDef,
  ColumnFiltersState,
  Header,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { AxiosError } from 'axios'
import { ChevronDown, ChevronUp, CircleX } from 'lucide-react'

import type { TError } from '@/types'
import type { FilterOption } from '@/types/common/filter'

import { Button } from '@/components/ui/button'
import Pager from '@/components/ui/pager'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeadRow,
  TableHeader,
  TableRow,
  TableSkeletonRows,
} from '@/components/ui/table'
import TableRowComponent from '@/components/ui/table-row'

import { Error } from '@/components/elements/error'
import Filter from '@/components/elements/filter'
import { Paginator } from '@/components/elements/paginator'

import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: PaginationState
  setPagination?: OnChangeFn<PaginationState>
  enableSorting?: boolean
  sorting?: SortingState
  setSorting?: OnChangeFn<SortingState>
  columnFilters?: ColumnFiltersState
  setColumnFilters?: OnChangeFn<ColumnFiltersState>
  rowCount?: number
  pageCount?: number
  isFetching: boolean
  isError: boolean
  error?: AxiosError<TError> | null
  filterOptions?: FilterOption[]
  enableRowSelection?: boolean
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
}

const DataTable = <TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
  rowCount,
  pageCount,
  isFetching,
  isError,
  error,
  filterOptions,
  enableSorting = false,
  enableRowSelection = false,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: rowCount,
    pageCount: pageCount,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    // ...paginationOptions,
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    enableSorting,
    manualSorting: true,
    onSortingChange: setSorting,
    state: {
      pagination,
      columnFilters,
      sorting,
      rowSelection,
    },
    enableRowSelection: enableRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableMultiSort: false,
    debugTable: true,
    getRowId: (row) => (row as { id: string }).id,
  })

  const footers = table
    .getFooterGroups()
    .map((group) => group.headers.map((header) => header.column.columnDef.footer))
    .flat()
    .filter(Boolean)

  const sortToggler = (header: Header<TData, unknown>) => {
    if (header.column.getCanSort()) {
      header.column.toggleSorting(undefined, true)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {filterOptions && setColumnFilters && (
            <Filter
              filterOptions={filterOptions}
              columnFilters={columnFilters || []}
              setColumnFilter={setColumnFilters}
            />
          )}
          {Object.keys(rowSelection).length > 0 && (
            <Button variant="secondary" onClick={() => setRowSelection({})}>
              Clear
              <CircleX />
            </Button>
          )}
        </div>
        <Table className="border-separate border-spacing-0 rounded-lg border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeadRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-primary text-background font-medium first:rounded-tl-lg last:rounded-tr-lg"
                      key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={() => sortToggler(header)}
                          className={cn({ 'hover:cursor-pointer': header.column.getCanSort() }, 'flex')}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {(header.column.getCanSort() ||
                            header.column.getIsSorted() === 'asc' ||
                            header.column.getIsSorted() === 'desc') && (
                            <span className="-ml-0.5">
                              {header.column.getIsSorted() === 'asc' ? (
                                <div className="mt-0.5 -space-y-0.5">
                                  <ChevronUp className="h-2" strokeWidth={4} />
                                  <ChevronDown className="h-2 opacity-50" strokeWidth={4} />
                                </div>
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <div className="mt-0.5 -space-y-0.5">
                                  <ChevronUp className="h-2 opacity-50" strokeWidth={4} />
                                  <ChevronDown className="h-2" strokeWidth={4} />
                                </div>
                              ) : (
                                <div className="mt-0.5 -space-y-0.5">
                                  <ChevronUp className="h-2 opacity-50" strokeWidth={4} />
                                  <ChevronDown className="h-2 opacity-50" strokeWidth={4} />
                                </div>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableHeadRow>
            ))}
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={columns.length}>
                  {error?.response?.data.statusCode === 40401 ? (
                    <Error message="No results found" />
                  ) : (
                    <Error
                      message={
                        error?.response?.data.error?.message || 'Something went wrong. Please contact administrator'
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : isFetching ? (
              <TableSkeletonRows rows={table.getState().pagination.pageSize || 2} columns={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table
                .getRowModel()
                .rows.map((row, rowIndex) => (
                  <TableRowComponent key={row.id} row={row} index={rowIndex} rowCount={table.getRowModel().rows.length} />
                ))
            ) : (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Error message="Data not found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {footers.length > 0 &&
              table.getFooterGroups().map((footerEl) => (
                <TableRow key={footerEl.id}>
                  {footerEl.headers.map((columnEl) => (
                    <TableCell className="bg-muted" key={columnEl.id} colSpan={columnEl.colSpan}>
                      {flexRender(columnEl.column.columnDef.footer, columnEl.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableFooter>
        </Table>
        {pagination && setPagination && (
          <div className="flex items-center justify-between px-2 text-sm">
            <div className="">
              {Object.keys(rowSelection).length > 0 ? (
                <p>{`${Object.keys(rowSelection).length} of ${table.getRowCount()} record(s) selected.`}</p>
              ) : (
                <p>{`Found ${table.getRowCount()} record(s).`}</p>
              )}
            </div>
            <div className="flex items-center gap-8">
              <Pager pageSize={pagination.pageSize} setPageSize={table.setPageSize} />
              <Paginator table={table} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DataTable

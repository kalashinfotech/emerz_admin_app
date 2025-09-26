import type { Table } from '@tanstack/react-table'

import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type PaginatorProps<TData> = {
  table: Table<TData>
}

export function Paginator<TData>({ table }: PaginatorProps<TData>) {
  const pageNo = table.getPageCount() === 0 ? 0 : table.getState().pagination.pageIndex + 1
  return (
    <div className="flex items-center gap-4">
      <span>
        Page {pageNo} of {table.getPageCount()}
      </span>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              className="text-xs"
              onClick={() => table.firstPage()}
              isActive={table.getCanPreviousPage()}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              className="text-xs"
              onClick={() => table.previousPage()}
              isActive={table.getCanPreviousPage()}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext className="text-xs" onClick={() => table.nextPage()} isActive={table.getCanNextPage()} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast className="text-xs" onClick={() => table.lastPage()} isActive={table.getCanNextPage()} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

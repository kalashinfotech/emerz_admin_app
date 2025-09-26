import { flexRender } from '@tanstack/react-table'
import type { Row } from '@tanstack/table-core'

import { cn } from '@/lib/utils'

import { TableCell, TableRow } from './table'

interface Props<TData> {
  row: Row<TData>
  index: number
  rowCount: number
}

function TableRowComponent<TData>({ row, index, rowCount }: Props<TData>) {
  const isFirstRow = index === 0
  const isLastRow = index === rowCount - 1

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      className={cn(
        'group hover:bg-muted:bg-opacity-50 data-[state=selected]:bg-muted relative z-0 transition-colors hover:z-10 [&_td]:border-t',
      )}>
      {row.getVisibleCells().map((cell, cellIndex) => {
        const isFirstCell = cellIndex === 0
        const isLastCell = cellIndex === row.getVisibleCells().length - 1

        let borderRadiusClasses = ''

        if (isFirstRow && isFirstCell) {
          borderRadiusClasses = '' // Top-left
        } else if (isFirstRow && isLastCell) {
          borderRadiusClasses = '' // Top-right
        } else if (isLastRow && isFirstCell) {
          borderRadiusClasses = 'rounded-bl-lg' // Bottom-left
        } else if (isLastRow && isLastCell) {
          borderRadiusClasses = 'rounded-br-lg' // Bottom-right
        }

        return (
          <TableCell key={cell.id} className={cn(borderRadiusClasses, 'p-2')}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export default TableRowComponent

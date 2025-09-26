import { useEffect, useState } from 'react'

import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table'

import type { FilterOption } from '@/types/common/filter'

import { Button } from '@/components/ui/button'

import { FilterItem } from '@/components/elements/filter-item'

type FilterProps = {
  filterOptions: FilterOption[]
  columnFilters: ColumnFiltersState
  setColumnFilter: OnChangeFn<ColumnFiltersState>
  disabled?: boolean
}

const Filter: React.FC<FilterProps> = ({ filterOptions, columnFilters, setColumnFilter, disabled = false }) => {
  const [filters, setFilters] = useState<Record<string, string>>(() =>
    columnFilters.reduce(
      (acc, i) => {
        // @ts-expect-error unknown key
        acc[i.id] = i.value
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      const defaultFilters = filterOptions.reduce<Record<string, string>>((acc, filterItem) => {
        if (filterItem.defaultOption) {
          acc[filterItem.id] = filterItem.defaultOption
        }
        return acc
      }, {})
      if (Object.keys(defaultFilters).length > 0) setFilters(defaultFilters)
    }
  }, [filterOptions])

  const handleClearFilters = () => {
    setFilters({})
    setColumnFilter([])
  }

  const handleSubmit = () => {
    const f = Object.entries(filters).map(([id, value]) => {
      const t = filterOptions.find((val) => val.id === id)

      if (t && t.transform) {
        value = t.transform(value)
      }
      return { id, value }
    })
    setColumnFilter(f)
  }

  const handleFilterChange = (filterId: string, selectedOptions: string) => {
    setFilters({
      ...filters,
      [filterId]: selectedOptions,
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((filterId) => (
        <FilterItem
          key={filterId.id}
          filter={filterOptions.find((option) => option.id === filterId.id)!}
          filterValue={filters[filterId.id] || filterId.defaultOption || ''}
          onFilterChange={(selectedOptions) => handleFilterChange(filterId.id, selectedOptions)}
        />
      ))}
      <Button onClick={handleSubmit} disabled={Object.keys(filters).length === 0 || disabled}>
        Go
      </Button>
      <Button variant="destructive" onClick={handleClearFilters} disabled={Object.keys(filters).length === 0 || disabled}>
        Reset
      </Button>
    </div>
  )
}

export default Filter

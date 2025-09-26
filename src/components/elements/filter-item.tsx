import { useEffect, useState } from 'react'

import { format } from 'date-fns'

import type { FilterOption, FilterOptionOptions } from '@/types/common/filter'

import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type FilterItemProps = {
  filter: FilterOption
  filterValue: string
  onFilterChange: (selectedOptions: string) => void
}

export function FilterItem({ filter, filterValue, onFilterChange }: FilterItemProps) {
  const [options, setOptions] = useState<FilterOptionOptions[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      if (typeof filter.options === 'function') {
        try {
          const fetchedOptions = await filter.options()
          setOptions(fetchedOptions)
        } catch (error) {
          console.error('Error fetching filter options:', error)
        }
      } else {
        setOptions(filter.options || [])
      }
    }

    fetchOptions()
  }, [filter.options])
  return (
    <div>
      <div className="flex items-center justify-around gap-2">
        {filter.options && !filter.multiSelect ? (
          <Select onValueChange={(value) => onFilterChange(value)} value={filterValue} required>
            <SelectTrigger className="min-w-30">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <>
                {options.map((item, index) => (
                  <SelectItem
                    className=""
                    key={`filter-option-${index}`}
                    value={typeof item.value === 'number' ? item.value.toString() : item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </>
            </SelectContent>
          </Select>
        ) : filter.options && filter.multiSelect ? (
          <MultiSelect
            // className="w-60"
            options={options.map((item) => {
              return { value: item.value.toString(), label: item.label }
            })}
            onValueChange={(vals) => onFilterChange(vals.join(','))}
            defaultValue={filterValue ? filterValue.split(',') : []}
            placeholder={filter.label}
            animation={0}
            maxCount={1}
          />
        ) : filter.type === 'date' ? (
          <div className="w-40">
            <DatePicker
              placeholder={filter.label}
              value={filterValue}
              onChange={(value) => value && onFilterChange(format(value, 'dd/MM/yyyy'))}
            />
          </div>
        ) : (
          <Input
            className="w-60"
            placeholder={filter.label}
            value={filterValue}
            onChange={(e) => {
              onFilterChange(e.currentTarget.value)
            }}
          />
        )}
      </div>
      {filter.desc && <p className="text-muted-foreground py-0.5 text-[0.685rem]">{filter.desc}</p>}
    </div>
  )
}

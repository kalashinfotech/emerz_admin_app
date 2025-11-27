import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'

import type { BareUserAccountModel } from '@/types'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { fetchUserAccountsBareList } from '@/api/user-account'

import { useDebouncedSearch } from '@/hooks/use-debounced-search'

import type { UserTypeEnum } from '@/lib/enums'
import { cn } from '@/lib/utils'

import { Error } from '../elements/error'
import { Loader } from '../elements/loader'

export type UserSearchMenuOption = {
  id: string
  value: string
  obj?: BareUserAccountModel
}

type UserSearchMenuProps = {
  option?: UserSearchMenuOption
  setOption: (opt?: UserSearchMenuOption) => void
  disabled?: boolean
  userType: UserTypeEnum
}

export function UserSearchMenu({ option, setOption, disabled, userType }: UserSearchMenuProps) {
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedSearch(searchInput, 300)
  const columnFilters = debouncedSearch ? [{ id: 'search', value: debouncedSearch }] : []
  columnFilters.push({ id: 'isActive', value: 'true' })
  columnFilters.push({ id: 'isVerified', value: 'true' })
  columnFilters.push({ id: 'userType', value: userType })
  const { data, isError, isLoading, error } = useQuery(fetchUserAccountsBareList(columnFilters))

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild className={cn({ 'pointer-events-none': disabled })} disabled={disabled}>
          <div className="flex w-full items-center gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn('hover:bg-background text-muted-foreground w-full justify-between pr-4', {
                'text-foreground': option?.value,
              })}
              onClick={() => setOpen(true)}>
              <p>{option?.value || 'Search users...'}</p>
              <p
                onClick={(e) => {
                  e.stopPropagation()
                  setOption()
                }}>
                <CircleX />
              </p>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent style={{ width: 'var(--radix-popover-trigger-width)' }} className={cn('p-0')} align="center">
          <Command shouldFilter={false}>
            <CommandInput
              value={searchInput}
              onValueChange={(e) => setSearchInput(e)}
              placeholder="User name, id, email id..."
            />
            <CommandList>
              <CommandGroup>
                {isLoading ? (
                  <Loader />
                ) : isError ? (
                  <Error message={error.response?.data.error?.message} />
                ) : !data ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <>
                    {data.data.map((item) => {
                      return (
                        <CommandItem
                          onSelect={(val) => {
                            setOption({ id: item.id, value: val, obj: item })
                            setOpen(false)
                          }}
                          key={item.id}>
                          <span>{item.fullName} </span>
                          <span className="text-muted-foreground text-[0.625rem] font-medium">({item.displayId})</span>
                        </CommandItem>
                      )
                    })}
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

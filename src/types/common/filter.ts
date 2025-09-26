export type FilterOptionOptions<T = string | number> = {
  value: T
  label: string
}

export type FilterOption = {
  id: string
  label: string
  options?: FilterOptionOptions[] | (() => Promise<FilterOptionOptions[]>)
  defaultOption?: string
  desc?: string
  type?: string
  multiSelect?: boolean
  transform?: (value: any) => any
}

import type { PaginationState } from '@tanstack/react-table'

export type PaginationParams = PaginationState
export type SortParams = { sortBy: `${string}.${'asc' | 'desc'}` }
export type QueryParams = Record<string, any> & Partial<PaginationParams & SortParams>

import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function enumToOptions<T extends Record<string, string>>(e: T) {
  return Object.values(e).map((value) => ({
    label: value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' '), // format for display
    value,
  }))
}

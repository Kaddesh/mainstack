import { createContext } from 'react'
import type { Transaction } from '../types/api'

export interface FilterState {
  startDate: Date | null
  endDate: Date | null
  selectedTransactionTypes: string[]
  selectedTransactionStatuses: string[]
  isApplied: boolean
}

export interface FilterContextType extends FilterState {
  setStartDate: (date: Date | null) => void
  setEndDate: (date: Date | null) => void
  setSelectedTransactionTypes: (types: string[]) => void
  setSelectedTransactionStatuses: (statuses: string[]) => void
  setQuickFilter: (period: 'Today' | 'Last 7 days' | 'This month' | 'Last 3 months' | 'All Time') => void
  quickFilter?: 'Today' | 'Last 7 days' | 'This month' | 'Last 3 months' | 'All Time' | null
  applyFilters: () => void
  clearFilters: () => void
  getActiveFilterCount: () => number
  filterTransactions: (transactions: Transaction[]) => Transaction[]
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined)
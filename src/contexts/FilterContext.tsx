import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Transaction } from '../types/api'
import { FilterContext } from './FilterTypes'
import { parseTransactionDate, normalizeToDate } from './filterUtils'
import { transactionTypeMap, statusMap } from './filterConstants'

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Set default to last 7 days
  const getDefaultDates = (): { start: Date; end: Date } => {
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)
    return { start: sevenDaysAgo, end: today }
  }

  const defaultDates = getDefaultDates()
  
  const [startDate, _setStartDate] = useState<Date | null>(defaultDates.start)
  const [endDate, _setEndDate] = useState<Date | null>(defaultDates.end)
  const [selectedTransactionTypes, _setSelectedTransactionTypes] = useState<string[]>([])
  const [selectedTransactionStatuses, _setSelectedTransactionStatuses] = useState<string[]>([])
  const [isApplied, setIsApplied] = useState(false)
  const [quickFilter, setQuickFilterState] = useState<'Today' | 'Last 7 days' | 'This month' | 'Last 3 months' | 'All Time' | null>('Last 7 days')

  const applyFilters = () => {
    setIsApplied(true)
  }

  const setQuickFilter = (period: 'Today' | 'Last 7 days' | 'This month' | 'Last 3 months' | 'All Time') => {
    const today = new Date()
    let start: Date | null = null
    let end: Date | null = null

    switch (period) {
      case 'Today':
        start = new Date(today)
        end = new Date(today)
        break
      case 'Last 7 days':
        start = new Date(today)
        start.setDate(today.getDate() - 7)
        end = new Date(today)
        break
      case 'This month':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today)
        break
      case 'Last 3 months':
        start = new Date(today)
        start.setMonth(today.getMonth() - 3)
        end = new Date(today)
        break
      case 'All Time':
        start = null
        end = null
        break
    }

    setStartDate(start)
    setEndDate(end)
    setQuickFilterState(period)
    // don't auto-apply; user must click Apply
  }

  // Exclusive setters: setting one dimension clears the others so only one filter is active at a time
  const setStartDate = (date: Date | null) => {
    _setStartDate(date)
    // clearing other filters
    _setSelectedTransactionTypes([])
    _setSelectedTransactionStatuses([])
    setQuickFilterState(null)
  }

  const setEndDate = (date: Date | null) => {
    _setEndDate(date)
    // clearing other filters
    _setSelectedTransactionTypes([])
    _setSelectedTransactionStatuses([])
    setQuickFilterState(null)
  }

  const setSelectedTransactionTypes = (types: string[]) => {
    _setSelectedTransactionTypes(types)
    // clear date filters and quick filter
    _setStartDate(null)
    _setEndDate(null)
    setQuickFilterState(null)
  }

  const setSelectedTransactionStatuses = (statuses: string[]) => {
    _setSelectedTransactionStatuses(statuses)
    // clear date filters and quick filter
    _setStartDate(null)
    _setEndDate(null)
    setQuickFilterState(null)
  }

  const clearFilters = () => {
    const newDefaults = getDefaultDates()
    setStartDate(newDefaults.start)
    setEndDate(newDefaults.end)
    setSelectedTransactionTypes([])
    setSelectedTransactionStatuses([])
    setIsApplied(false)
  }

  const getActiveFilterCount = () => {
    // If filters haven't been applied, show zero active filters
    if (!isApplied) return 0

    let count = 0

    // Count date range as 1 filter if not default or if quickFilter is not default
    const defaultDates = getDefaultDates()
    const hasCustomDateRange = (startDate && endDate) ? (
      startDate.getTime() !== defaultDates.start.getTime() || endDate.getTime() !== defaultDates.end.getTime()
    ) : (quickFilter !== 'Last 7 days')
    if (hasCustomDateRange) count++

    // Count transaction types
    if (selectedTransactionTypes.length > 0) count++

    // Count transaction statuses  
    if (selectedTransactionStatuses.length > 0) count++

    return count
  }

  const filterTransactions = (transactions: Transaction[]) => {
    if (!isApplied) return transactions

    return transactions.filter(transaction => {
      // Date range filter (by date only, normalized to local date)
      if (startDate || endDate) {
        const transactionDate = parseTransactionDate(transaction.date)

        const txnLabel = transaction.payment_reference ?? transaction.metadata?.name ?? `amt:${transaction.amount}`

        // Debug: show parsed transaction date and transaction type/status
        console.log('[filter] txn=', txnLabel, 'raw=', transaction.date, 'parsed=', transactionDate, 'type=', transaction.type, 'status=', transaction.status)

        if (!transactionDate) {
          console.log('[filter] exclude txn=', txnLabel, 'reason=unparseable')
          return false
        }

        if (startDate) {
          const start = normalizeToDate(startDate)
          const txnDay = normalizeToDate(transactionDate)
          console.log('[filter] compare start inclusive=', start.toISOString())
          if (txnDay < start) {
            console.log('[filter] exclude txn=', txnLabel, 'reason=before_start', 'txn=', txnDay.toISOString())
            return false
          }
        }

        if (endDate) {
          const end = normalizeToDate(endDate)
          const txnDay = normalizeToDate(transactionDate)
          console.log('[filter] compare end inclusive=', end.toISOString())
          if (txnDay > end) {
            console.log('[filter] exclude txn=', txnLabel, 'reason=after_end', 'txn=', txnDay.toISOString())
            return false
          }
        }

        console.log('[filter] include txn=', txnLabel, 'txnDate=', normalizeToDate(transactionDate).toISOString())
      }

      // Transaction type filter
      if (selectedTransactionTypes.length > 0) {
        const apiTypes = selectedTransactionTypes
          .map(type => transactionTypeMap[type])
          .filter(Boolean)

        if (apiTypes.length > 0 && !apiTypes.includes(transaction.type)) {
          console.log('[filter] exclude txn type mismatch=', transaction.payment_reference ?? transaction.metadata?.name ?? transaction.amount, 'wanted=', apiTypes, 'got=', transaction.type)
          return false
        }
      }

      // Transaction status filter
      if (selectedTransactionStatuses.length > 0) {
        const apiStatuses = selectedTransactionStatuses
          .map(status => statusMap[status])
          .filter(Boolean)

        if (apiStatuses.length > 0 && !apiStatuses.includes(transaction.status)) {
          console.log('[filter] exclude txn status mismatch=', transaction.payment_reference ?? transaction.metadata?.name ?? transaction.amount, 'wanted=', apiStatuses, 'got=', transaction.status)
          return false
        }
      }

      return true
    })
  }

  return (
    <FilterContext.Provider value={{
      startDate,
      endDate,
      selectedTransactionTypes,
      selectedTransactionStatuses,
      isApplied,
      setStartDate,
      setEndDate,
      setSelectedTransactionTypes,
      setSelectedTransactionStatuses,
      quickFilter,
      setQuickFilter,
      applyFilters,
      clearFilters,
      getActiveFilterCount,
      filterTransactions
    }}>
      {children}
    </FilterContext.Provider>
  )
}


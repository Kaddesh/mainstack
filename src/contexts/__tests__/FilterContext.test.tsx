import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { FilterProvider } from '../FilterContext'
import { useFilter } from '../../hooks/useFilter'
import type { Transaction } from '../../types/api'

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FilterProvider>{children}</FilterProvider>
)

const sample: Transaction[] = [
  { amount: 100, status: 'successful', type: 'deposit', date: '2022-03-03', metadata: { name: 'X' } },
  { amount: 50, status: 'pending', type: 'withdrawal', date: '2022-03-02' },
  { amount: 200, status: 'failed', type: 'deposit', date: '2022-03-01', metadata: { name: 'Y' } },
]

describe('FilterProvider behavior', () => {
  it('initially not applied, returns all transactions', () => {
    const { result } = renderHook(() => useFilter(), { wrapper })
    const res = result.current.filterTransactions(sample)
    expect(res.length).toBe(sample.length)
  })

  it('quick filters set dates without auto-applying', () => {
    const { result } = renderHook(() => useFilter(), { wrapper })
    act(() => result.current.setQuickFilter('Today'))
    expect(result.current.isApplied).toBe(false)
    // dates should be set (non-null), but not applied yet
    expect(result.current.startDate).not.toBeNull()
    expect(result.current.endDate).not.toBeNull()
  })

  it('applyFilters enables filtering', () => {
    const { result } = renderHook(() => useFilter(), { wrapper })
    act(() => result.current.setQuickFilter('Last 7 days'))
    act(() => result.current.applyFilters())
    expect(result.current.isApplied).toBe(true)
    const res = result.current.filterTransactions(sample)
    expect(Array.isArray(res)).toBe(true)
  })

  it('exclusive setters clear other dimensions (types vs dates)', () => {
    const { result } = renderHook(() => useFilter(), { wrapper })
    act(() => result.current.setQuickFilter('Last 7 days'))
    const startBefore = result.current.startDate
    act(() => result.current.setSelectedTransactionTypes(['Withdrawals']))
    expect(result.current.startDate).toBeNull()
    expect(result.current.endDate).toBeNull()
    expect(result.current.selectedTransactionTypes).toEqual(['Withdrawals'])
    // re-set date and ensure types cleared when setting date directly
    act(() => result.current.setStartDate(new Date()))
    expect(result.current.selectedTransactionTypes).toEqual([])
    expect(result.current.quickFilter).toBeNull()
    expect(result.current.startDate).not.toBeNull()
    expect(startBefore).not.toBeNull()
  })

  it('clearFilters resets to default last 7 days and not applied', () => {
    const { result } = renderHook(() => useFilter(), { wrapper })
    act(() => result.current.setSelectedTransactionStatuses(['Successful']))
    act(() => result.current.applyFilters())
    act(() => result.current.clearFilters())
    expect(result.current.isApplied).toBe(false)
    expect(result.current.selectedTransactionStatuses).toEqual([])
    // start/end dates reset to defaults
    expect(result.current.startDate).not.toBeNull()
    expect(result.current.endDate).not.toBeNull()
  })

  it('getActiveFilterCount reflects applied filters only', () => {
    const { result } = renderHook(() => useFilter(), { wrapper })
    // not applied -> 0
    expect(result.current.getActiveFilterCount()).toBe(0)
    // set types and apply -> count >= 1
    act(() => result.current.setSelectedTransactionTypes(['Withdrawals']))
    act(() => result.current.applyFilters())
    expect(result.current.getActiveFilterCount()).toBeGreaterThanOrEqual(1)
  })
})

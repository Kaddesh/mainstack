import { describe, it, expect } from 'vitest'
import { parseTransactionDate, normalizeToDate, filterTransactionsPure, type FilterOptions } from '../filterUtils'
import type { Transaction } from '../../types/api'

describe('parseTransactionDate', () => {
  it('parses ISO 8601 date strings', () => {
    const d = parseTransactionDate('2022-03-03')
    expect(d).toBeInstanceOf(Date)
    expect(d && !Number.isNaN(d.getTime())).toBe(true)
  })

  it('parses month name formats', () => {
    const d1 = parseTransactionDate('March 3, 2022')
    const d2 = parseTransactionDate('Mar 03, 2022')
    expect(d1 && !Number.isNaN(d1.getTime())).toBe(true)
    expect(d2 && !Number.isNaN(d2.getTime())).toBe(true)
  })

  it('parses MM/DD/YYYY', () => {
    const d = parseTransactionDate('03/03/2022')
    expect(d && !Number.isNaN(d.getTime())).toBe(true)
  })

  it('parses unix seconds and milliseconds', () => {
    const seconds = Math.floor(new Date('2022-03-03').getTime() / 1000)
    const millis = new Date('2022-03-03').getTime()
    const d1 = parseTransactionDate(String(seconds))
    const d2 = parseTransactionDate(String(millis))
    expect(d1 && !Number.isNaN(d1.getTime())).toBe(true)
    expect(d2 && !Number.isNaN(d2.getTime())).toBe(true)
  })

  it('returns null for invalid inputs', () => {
    expect(parseTransactionDate('not-a-date')).toBeNull()
    expect(parseTransactionDate(undefined as unknown as string)).toBeNull()
    expect(parseTransactionDate(null as unknown as string)).toBeNull()
  })
})

describe('normalizeToDate', () => {
  it('sets time to midnight local', () => {
    const d = new Date('2022-03-03T15:22:11.123')
    const n = normalizeToDate(d)
    expect(n.getHours()).toBe(0)
    expect(n.getMinutes()).toBe(0)
    expect(n.getSeconds()).toBe(0)
    expect(n.getMilliseconds()).toBe(0)
  })
})

describe('filterTransactionsPure - comprehensive', () => {
  const txns: Transaction[] = [
    { amount: 500, status: 'successful', type: 'deposit', date: '2022-03-03', metadata: { name: 'A' } },
    { amount: 400, status: 'pending', type: 'deposit', date: '2022-03-02', metadata: { name: 'B' } },
    { amount: 300, status: 'failed', type: 'withdrawal', date: '2022-03-01' },
    { amount: 200, status: 'successful', type: 'withdrawal', date: '2022-02-28' },
  ]

  it('returns all when not applied', () => {
    const opts: FilterOptions = { isApplied: false }
    const res = filterTransactionsPure(txns, opts)
    expect(res.length).toBe(txns.length)
  })

  it('filters by inclusive date range', () => {
    const start = new Date('2022-03-01')
    const end = new Date('2022-03-02')
    const opts: FilterOptions = { startDate: start, endDate: end, isApplied: true }
    const res = filterTransactionsPure(txns, opts)
    // 2022-03-02 (deposit), 2022-03-01 (withdrawal)
    expect(res.map(r => r.date)).toEqual(['2022-03-02', '2022-03-01'])
  })

  it('filters by UI type labels via map', () => {
    const opts: FilterOptions = { selectedTransactionTypes: ['Withdrawals'], isApplied: true }
    const res = filterTransactionsPure(txns, opts)
    expect(res.every(r => r.type === 'withdrawal')).toBe(true)
  })

  it('filters by UI status labels via map', () => {
    const opts: FilterOptions = { selectedTransactionStatuses: ['Successful'], isApplied: true }
    const res = filterTransactionsPure(txns, opts)
    expect(res.every(r => r.status === 'successful')).toBe(true)
  })

  it('unknown UI labels do not filter (ignored after mapping)', () => {
    const opts: FilterOptions = { selectedTransactionTypes: ['Unknown Type'], isApplied: true }
    const res = filterTransactionsPure(txns, opts)
    // mapping results in empty apiTypes, so no type filter applied
    expect(res.length).toBe(txns.length)
  })
})

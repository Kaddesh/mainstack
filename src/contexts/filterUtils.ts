import type { Transaction } from '../types/api'
import { parseISO, parse, isValid } from 'date-fns'
import { transactionTypeMap, statusMap } from './filterConstants'

export const parseTransactionDate = (raw?: string | null): Date | null => {
  if (!raw) return null

  const numeric = raw.trim()
  if (/^\d+$/.test(numeric)) {
    const asNum = Number(numeric)
    const ms = asNum < 1e12 ? asNum * 1000 : asNum
    const d = new Date(ms)
    if (isValid(d)) return d
  }

  try {
    const iso = parseISO(raw)
    if (isValid(iso)) return iso
  } catch {
    // ignore
  }

  const formats = ['MMMM d, yyyy', 'MMM d, yyyy', 'MMMM dd, yyyy', 'MMM dd, yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd']
  for (const fmt of formats) {
    try {
      const d = parse(raw, fmt, new Date())
      if (isValid(d)) return d
    } catch {
      // ignore
    }
  }

  const fallback = new Date(raw)
  if (isValid(fallback)) return fallback

  return null
}

export const normalizeToDate = (d: Date): Date => {
  const n = new Date(d)
  n.setHours(0, 0, 0, 0)
  return n
}

export type FilterOptions = {
  startDate?: Date | null
  endDate?: Date | null
  selectedTransactionTypes?: string[]
  selectedTransactionStatuses?: string[]
  isApplied?: boolean
}

export const filterTransactionsPure = (transactions: Transaction[], options: FilterOptions): Transaction[] => {
  const {
    startDate = null,
    endDate = null,
    selectedTransactionTypes = [],
    selectedTransactionStatuses = [],
    isApplied = false
  } = options

  if (!isApplied) return transactions

  return transactions.filter(transaction => {
    // Date filter
    if (startDate || endDate) {
      const txnDate = parseTransactionDate(transaction.date)
      if (!txnDate) return false

      if (startDate) {
        const start = normalizeToDate(startDate)
        const txn = normalizeToDate(txnDate)
        if (txn < start) return false
      }

      if (endDate) {
        const end = normalizeToDate(endDate)
        const txn = normalizeToDate(txnDate)
        if (txn > end) return false
      }
    }

    // Type filter
    if (selectedTransactionTypes.length > 0) {
        const apiTypes = selectedTransactionTypes.map(t => transactionTypeMap[t]).filter(Boolean)
      if (apiTypes.length > 0 && !apiTypes.includes(transaction.type)) return false
    }

    // Status filter
    if (selectedTransactionStatuses.length > 0) {
      const apiStatuses = selectedTransactionStatuses.map(s => statusMap[s]).filter(Boolean)
      if (apiStatuses.length > 0 && !apiStatuses.includes(transaction.status)) return false
    }

    return true
  })
}

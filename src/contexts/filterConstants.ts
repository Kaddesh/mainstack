export const transactionTypeMap: { [key: string]: string } = {
  // UI labels -> API canonical types
  'Store Transaction': 'deposit',
  'Get Tipped': 'tipped',
  'Chargebacks': 'chargebacks',
  'Cashbacks': 'cashbacks',
  'Refer & Earn': 'referral',
  'Withdrawal': 'withdrawal',
  'Withdrawals': 'withdrawal'
}

export const statusMap: { [key: string]: string } = {
  'Successful': 'successful',
  'Pending': 'pending',
  'Failed': 'failed'
}

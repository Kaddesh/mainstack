
import { Box, VStack, HStack, Text, Image, Spinner } from '@chakra-ui/react'
import { useWallet } from '../../hooks/useApi'

const LedgerBalance = () => {
  const { data: wallet, isLoading, isError } = useWallet()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Box width="271px" height="360px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="md" color="#131316" />
      </Box>
    )
  }

  if (isError || !wallet) {
    return (
      <Box width="271px" height="360px">
        <Text color="red.500" fontSize="sm">Failed to load wallet data</Text>
      </Box>
    )
  }

  return (
    <Box width="271px" height="360px">
      <VStack gap="32px" align="stretch">
        <Box>
          <HStack justify="space-between" align="center" mb={2}>
            <Text fontSize="sm">Ledger balance</Text>
            <Image src="/info.svg" alt="info" width="16px" height="16px" color="#888F95" />
          </HStack>
          <Text fontSize="28px" fontWeight="bold">
            {formatCurrency(wallet.ledger_balance)}
          </Text>
        </Box>

        <Box>
          <HStack justify="space-between" align="center" mb={2}>
            <Text fontSize="sm">Total payout</Text>
            <Image src="/info.svg" alt="info" width="16px" height="16px" />
          </HStack>
          <Text fontSize="28px" fontWeight="bold">
            {formatCurrency(wallet.total_payout)}
          </Text>
        </Box>

        <Box>
          <HStack justify="space-between" align="center" mb={2}>
            <Text fontSize="sm">Total Revenue</Text>
            <Image src="/info.svg" alt="info" width="16px" height="16px" />
          </HStack>
          <Text fontSize="28px" fontWeight="bold">
            {formatCurrency(wallet.total_revenue)}
          </Text>
        </Box>

        <Box>
          <HStack justify="space-between" align="center" mb={2}>
            <Text fontSize="sm">Pending Payout</Text>
            <Image src="/info.svg" alt="info" width="16px" height="16px" />
          </HStack>
          <Text fontSize="28px" fontWeight="bold">
            {formatCurrency(wallet.pending_payout)}
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default LedgerBalance

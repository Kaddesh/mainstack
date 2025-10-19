

import { Box, Flex, VStack, HStack, Text, Image, Button, Spinner } from '@chakra-ui/react'
import Filter from '../filter'
import { useTransactions } from '../../hooks/useApi'
import { useMemo } from 'react'

const Transaction = () => {
  const { data: transactions, isLoading, isError } = useTransactions()

  // Transform API data to display format
  const displayTransactions = useMemo(() => {
    if (!transactions) return []

    return transactions.map((transaction, index) => ({
      id: transaction.payment_reference || `transaction-${index}`,
      type: transaction.type,
      title: transaction.type === 'deposit' 
        ? transaction.metadata?.product_name || transaction.metadata?.type || 'Deposit'
        : 'Cash Withdrawal',
      description: transaction.type === 'deposit'
        ? transaction.metadata?.name || 'Customer'
        : transaction.status,
      amount: transaction.type === 'deposit' ? transaction.amount : -transaction.amount,
      date: new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      }),
      icon: transaction.type === 'deposit' ? '/call_received.svg' : '/call_made.svg',
      bgColor: transaction.type === 'deposit' ? '#E3FCF2' : '#F9E3E0',
      status: transaction.status
    }))
  }, [transactions])

  const getStatusColor = (status: string) => {
    if (status === 'successful') return '#0EA163'
    if (status === 'pending') return '#A77A07'
    if (status === 'failed') return '#DC2626'
    return '#56616B'
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount))
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="lg" color="#131316" />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box p={4} borderRadius="md" bg="red.50" border="1px solid" borderColor="red.200">
        <Text color="red.600" fontWeight="semibold">
          Failed to load transactions
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="24px" fontWeight="bold" color="#131316">
            {displayTransactions.length} transactions
          </Text>
          <Text fontSize="sm" fontWeight="medium" color="#56616B" lineHeight="16px">
            Your transactions for the last 7 days
          </Text>
          <Box width="100%" height="1px" bg="#DBDEE5" mt={4} />
        </Box>
        
        <HStack gap={3}>
          <Filter />
          
          <Button
            bg="#DBDEE5"
            color="#131316"
            borderRadius="full"
            px={6}
            py={3}
            fontWeight="semibold"
            fontSize="base"
            _hover={{ bg: '#C4C9D0' }}
          >
            Export list ↓
          </Button>
        </HStack>
      </Flex>

      {/* Transaction List */}
      <VStack gap={4} align="stretch">
        {displayTransactions.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500" fontSize="lg">No transactions found</Text>
          </Box>
        ) : (
          displayTransactions.map((transaction) => (
            <Flex key={transaction.id} justify="space-between" align="center" w="100%">
              {/* Left Section - Icon and Details */}
              <HStack gap={4} maxW="400px" w="355px">
                <Box
                  bg={transaction.bgColor}
                  borderRadius="50%"
                  w="48px"
                  h="48px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image 
                    src={transaction.icon} 
                    alt="transaction icon" 
                    w="20px" 
                    h="20px" 
                  />
                </Box>
                
                <VStack gap={1} align="start">
                  <Text fontSize="base" fontWeight="bold" color="#131316">
                    {transaction.title}
                  </Text>
                  <Text 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color={transaction.status ? getStatusColor(transaction.status) : '#56616B'}
                  >
                    {transaction.description}
                  </Text>
                </VStack>
              </HStack>

              {/* Right Section - Amount and Date */}
              <VStack gap={1} align="end">
                <Text fontSize="base" fontWeight="bold" color="#131316">
                  USD {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                </Text>
                <Text fontSize="sm" fontWeight="medium" color="#56616B">
                  {transaction.date}
                </Text>
              </VStack>
            </Flex>
          ))
        )}
      </VStack>
    </Box>
  )
}

export default Transaction



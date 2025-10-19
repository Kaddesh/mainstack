import { Flex, Box, VStack, HStack, Text, Button, Spinner } from '@chakra-ui/react'
import Chart from "./chart"
import LedgerBalance from "./ledgerBalance"
import { useWallet } from '../../hooks/useApi'

const AvailableBalance = () => {
  const { data: wallet, isLoading, isError, error } = useWallet()

  if (isLoading) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="lg" color="#131316" />
      </Flex>
    )
  }

  if (isError) {
    return (
      <Box p={4} borderRadius="md" bg="red.50" border="1px solid" borderColor="red.200">
        <Text color="red.600" fontWeight="semibold">
          Failed to load wallet data: {error?.message}
        </Text>
      </Box>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Flex 
      align="center" 
      justify="space-between"
      flexWrap="wrap"
      maxW="1159px"
      mt="40px"
    >
      <Box>
        <HStack 
          align="center" 
          justify="center" 
          w="443px" 
          gap="64px"
          mb={6}
        >
          <VStack align="start" gap={2}>
            <Text 
              fontSize="14px" 
              color="#56616B" 
              fontWeight="500" 
              lineHeight="16px"
            >
              Available balance
            </Text>
            <Text 
              fontSize="36px" 
              fontWeight="700" 
              lineHeight="48px" 
              color="#131316"
              width="231px"
            >
              {wallet ? formatCurrency(wallet.balance) : 'USD 0.00'}
            </Text>
          </VStack>
          
          <Button
            w="167px"
            px="28px"
            py="14px"
            borderRadius="full"
            bg="#131316"
            color="white"
            fontWeight="semibold"
            _hover={{ bg: "#2a2a2a" }}
          >
            Withdraw
          </Button>
        </HStack>

        <Chart />
      </Box>
      
      <LedgerBalance />
    </Flex>
  )
}

export default AvailableBalance

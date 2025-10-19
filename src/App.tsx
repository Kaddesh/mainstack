
import { Box, VStack } from '@chakra-ui/react'
import './App.css'
import AvailableBalance from './compoenents/balance/availableBalance'
import Navigation from './compoenents/nav/navigation'
import Transaction from './compoenents/transaction/transaction'

const App = () => {
  return (
    <Box pb="100px">
      <Navigation />
      <Box width="1159px" maxWidth="1159px" mx="auto">
        <VStack gap={32} align="stretch">
          <AvailableBalance />
          <Transaction />
        </VStack>
      </Box>
    </Box>
  )
}

export default App

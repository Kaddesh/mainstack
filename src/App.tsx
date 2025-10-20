
import { Box, VStack } from '@chakra-ui/react'
import './App.css'
import AvailableBalance from './compoenents/balance/availableBalance'
import Navigation from './compoenents/nav/navigation'
import Transaction from './compoenents/transaction/transaction'
import AppBar from './compoenents/nav/appBar'

const App = () => {
  return (
    <Box pb="100px">
      <AppBar />
      <Navigation />
      <Box width="1000px" maxWidth="1440px" mx="auto">
        <VStack gap={32} align="stretch">
          <AvailableBalance />
          <Transaction />
        </VStack>
      </Box>
    </Box>
  )
}

export default App

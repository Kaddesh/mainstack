

import { Box, VStack, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'

const TransactionType = () => {
  const [selectedValue, setSelectedValue] = useState('')

  const transactionTypes = [
    'Store Transaction',
    'Get Tipped', 
    'Withdrawals',
    'Chargebacks',
    'Cashbacks',
    'Refer & Earn'
  ]

  return (
    <Box w="412px" h="314px" bg="white" p="8px">
      <VStack gap="10px" p="14px" align="stretch">
        {transactionTypes.map((type, index) => (
          <HStack key={index} gap="12px" align="center">
            <Box
              w="16px"
              h="16px"
              borderRadius="50%"
              border="2px solid"
              borderColor={selectedValue === type ? "#1C1B1F" : "gray.300"}
              bg={selectedValue === type ? "#1C1B1F" : "white"}
              position="relative"
              cursor="pointer"
              onClick={() => setSelectedValue(type)}
            >
              {selectedValue === type && (
                <Box
                  w="6px"
                  h="6px"
                  bg="white"
                  borderRadius="50%"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                />
              )}
            </Box>
            <Text 
              fontSize="14px" 
              color="black"
              cursor="pointer"
              onClick={() => setSelectedValue(type)}
            >
              {type}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}

export default TransactionType

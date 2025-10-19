

import { Box, VStack, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'

interface TransactionTypeProps {
  onSelectionChange?: (selected: string[]) => void
}

const TransactionType = ({ onSelectionChange }: TransactionTypeProps) => {
  const transactionTypes = [
    'Store Transaction',
    'Get Tipped', 
    'Withdrawals',
    'Chargebacks',
    'Cashbacks',
    'Refer & Earn'
  ]

  const [selectedValues, setSelectedValues] = useState<string[]>([transactionTypes[0]])

  const toggleSelection = (type: string) => {
    const newSelection = selectedValues.includes(type) 
      ? selectedValues.filter(item => item !== type)
      : [...selectedValues, type]
    
    setSelectedValues(newSelection)
    
    // Call the callback to update parent component
    if (onSelectionChange) {
      onSelectionChange(newSelection)
    }
  }

  const isSelected = (type: string) => selectedValues.includes(type)

  return (
    <Box 
      w="412px" 
      bg="white" 
      p="8px"
      boxShadow="0px 6px 12px 0px #5C738314, 0px 4px 8px 0px #5C738314"
      borderRadius="md"
    >
      <VStack gap={0} p="14px" align="stretch">
        {transactionTypes.map((type, index) => (
          <HStack key={index} align="center" h="48px" w="396px">
            <Box
              w="17px"
              h="17px"
              borderRadius="2px"
              border="2px solid"
              borderColor={isSelected(type) ? "#1C1B1F" : "gray.300"}
              bg={isSelected(type) ? "#1C1B1F" : "white"}
              position="relative"
              cursor="pointer"
              onClick={() => toggleSelection(type)}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {isSelected(type) && (
                <Text color="white" fontSize="10px" fontWeight="bold">
                  ✓
                </Text>
              )}
            </Box>
            <Text 
              fontSize="16px" 
              fontWeight="600"
              lineHeight="24px"
              color="black"
              cursor="pointer"
              onClick={() => toggleSelection(type)}
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



import { Box, VStack, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'

interface TransactionStatusProps {
  onSelectionChange?: (selected: string[]) => void
}

const TransactionStatus = ({ onSelectionChange }: TransactionStatusProps) => {
  const transactionStatuses = [
    'Successful',
    'Pending', 
    'Failed'
  ]

  const [selectedValues, setSelectedValues] = useState<string[]>([transactionStatuses[0]])

  const toggleSelection = (status: string) => {
    const newSelection = selectedValues.includes(status) 
      ? selectedValues.filter(item => item !== status)
      : [...selectedValues, status]
    
    setSelectedValues(newSelection)
    
    // Call the callback to update parent component
    if (onSelectionChange) {
      onSelectionChange(newSelection)
    }
  }

  const isSelected = (status: string) => selectedValues.includes(status)

  return (
    <Box 
      w="412px" 
      bg="white" 
      p="8px"
      boxShadow="0px 6px 12px 0px #5C738314, 0px 4px 8px 0px #5C738314"
      borderRadius="md"
    >
      <VStack gap={0} p="14px" align="stretch">
        {transactionStatuses.map((status, index) => (
          <HStack key={index} align="center" h="48px" w="396px">
            <Box
              w="17px"
              h="17px"
              borderRadius="2px"
              border="2px solid"
              borderColor={isSelected(status) ? "#1C1B1F" : "gray.300"}
              bg={isSelected(status) ? "#1C1B1F" : "white"}
              position="relative"
              cursor="pointer"
              onClick={() => toggleSelection(status)}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {isSelected(status) && (
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
              onClick={() => toggleSelection(status)}
            >
              {status}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}

export default TransactionStatus

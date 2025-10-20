

import { VStack, Box, Text, Button, Image } from '@chakra-ui/react'
import { useFilter } from '../../hooks/useFilter'

const Error = () => {
  const { clearFilters } = useFilter()

  return (
    <VStack 
      align="start" 
      justify="start" 
      gap="32px" 
      bg="white" 
      p={6}
      maxW="400px"
      mx="auto"
      mt={8}
    >
      <Box 
        h="48px" 
        w="48px" 
        borderRadius="16px" 
        bg="#DBDEE5"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image src="/receipt_long.svg" alt="receipt" h="24px" w="24px" />
      </Box>
      
      <Box w="369px" maxW="100%">
        <Text 
          fontSize="28px" 
          color="#131316" 
          fontWeight="bold" 
          lineHeight="40px"
          mb={3}
        >
          No matching transaction found for the selected filter
        </Text>
        <Text 
          fontSize="16px" 
          color="#56616B" 
          fontWeight="500" 
          lineHeight="24px"
        >
          Change your filters to see more result, or add a new product
        </Text>
      </Box>

      <Button 
        w="117px" 
        px="24px" 
        py="12px" 
        borderRadius="full" 
        bg="#EFF1F6"
        color="#131316"
        fontSize="14px"
        fontWeight="semibold"
        _hover={{ bg: "#E0E4EA" }}
        onClick={clearFilters}
      >
        Clear filter
      </Button>
    </VStack>
  )
}

export default Error

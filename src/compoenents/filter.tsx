import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  CloseButton
} from '@chakra-ui/react'
import { useState } from 'react'
import Calendar from './Calendar'
import TransactionType from './modal/transactionType'
import TransactionStatus from './modal/transactionStatus'

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date('2023-07-17'))
  const [endDate, setEndDate] = useState<Date | null>(new Date('2023-08-17'))
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const [showTransactionType, setShowTransactionType] = useState(false)
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>(['Store Transaction'])
  const [showTransactionStatus, setShowTransactionStatus] = useState(false)
  const [selectedTransactionStatuses, setSelectedTransactionStatuses] = useState<string[]>(['Successful'])

  const handleTransactionTypeChange = (selected: string[]) => {
    setSelectedTransactionTypes(selected)
  }

  const handleTransactionStatusChange = (selected: string[]) => {
    setSelectedTransactionStatuses(selected)
  }

  const getTransactionTypeDisplay = () => {
    if (selectedTransactionTypes.length === 0) {
      return 'Store Transaction'
    }
    return selectedTransactionTypes.join(', ')
  }

  const getTransactionStatusDisplay = () => {
    if (selectedTransactionStatuses.length === 0) {
      return 'Successful'
    }
    return selectedTransactionStatuses.join(', ')
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date'
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    })
  }

  const handleQuickFilter = (period: string) => {
    const today = new Date()
    let start = new Date()
    
    switch (period) {
      case 'Today':
        start = new Date()
        setStartDate(start)
        setEndDate(today)
        break
      case 'Last 7 days':
        start.setDate(today.getDate() - 7)
        setStartDate(start)
        setEndDate(today)
        break
      case 'This month':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        setStartDate(start)
        setEndDate(today)
        break
      case 'Last 3 months':
        start.setMonth(today.getMonth() - 3)
        setStartDate(start)
        setEndDate(today)
        break
    }
  }

  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectedTransactionTypes([])
    setSelectedTransactionStatuses([])
  }

  return (
    <Box>
      <Button 
        onClick={() => setIsOpen(true)} 
        bg="#DBDEE5"
        color="#131316"
        borderRadius="full"
        px={6}
        py={3}
        fontWeight="semibold"
        fontSize="base"
        _hover={{ bg: '#C4C9D0' }}
      >
        Filter ↓
      </Button>

      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          zIndex={1000}
          overflowY="auto"
          p={4}
          pt={8}
        >
          <Box 
            bg="white" 
            borderRadius="lg" 
            maxW="456px" 
            w="full"
            h="876px"
            maxH="876px"
            display="flex"
            flexDirection="column"
          >
            {/* Header */}
            <Box p={6} pb={0}>
              <HStack justify="space-between" mb={6}>
                <Text fontSize="24px" fontWeight="bold">Filter</Text>
                <CloseButton onClick={() => setIsOpen(false)} />
              </HStack>
            </Box>

            {/* Scrollable Content */}
            <Box flex="1" overflowY="auto" px={6}>
              <VStack gap={6} align="stretch">
            {/* Quick Filter Buttons */}
            <HStack gap={3} wrap="wrap">
              {['Today', 'Last 7 days', 'This month', 'Last 3 months'].map((period) => (
                <Button
                  key={period}
                  size="sm"
                  bg="#EFF1F6"
                  color="black"
                  px="18px"
                  py="10px"
                  border="1px"
                  borderColor="gray.200"
                  fontSize="14px"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleQuickFilter(period)}
                >
                  {period}
                </Button>
              ))}
            </HStack>

            {/* Date Range */}
            <Box>
              <Text fontSize="16px" fontWeight="semibold" mb={3}>Date Range</Text>
              <HStack gap={3}>
                <Box position="relative" flex={1}>
                  <Button
                    w="full"
                    px="16px"
                    py="14px"
                    borderRadius="12px"
                    border="1px"
                    borderColor="gray.200"
                    bg="#EFF1F6"
                    justifyContent="space-between"
                    fontSize="base"
                    color="black"
                    minW="203px"
                    onClick={() => {
                      setShowStartCalendar(!showStartCalendar)
                      setShowEndCalendar(false)
                    }}
                  >
                    <Text as="span">{formatDate(startDate)}</Text>
                    <Text as="span" fontSize="sm" color="gray.500">
                      ▼
                    </Text>
                  </Button>
                  <Calendar
                    selectedDate={startDate || undefined}
                    onDateSelect={(date) => {
                      setStartDate(date)
                      setShowStartCalendar(false)
                    }}
                    isOpen={showStartCalendar}
                  />
                </Box>

                <Box position="relative" flex={1}>
                  <Button
                    w="full"
                    px="16px"
                    py="14px"
                    borderRadius="12px"
                    border="1px"
                    borderColor="gray.200"
                    bg="#EFF1F6"
                    justifyContent="space-between"
                    fontSize="base"
                    color="black"
                    minW="203px"
                    onClick={() => {
                      setShowEndCalendar(!showEndCalendar)
                      setShowStartCalendar(false)
                    }}
                  >
                    <Text as="span">{formatDate(endDate)}</Text>
                    <Text as="span" fontSize="sm" color="gray.500">
                      ▼
                    </Text>
                  </Button>
                  <Calendar
                    selectedDate={endDate || undefined}
                    onDateSelect={(date) => {
                      setEndDate(date)
                      setShowEndCalendar(false)
                    }}
                    isOpen={showEndCalendar}
                  />
                </Box>
              </HStack>
            </Box>

            {/* Transaction Type */}
            <Box>
              <Text fontSize="16px" fontWeight="semibold" mb={3}>Transaction Type</Text>
              <Box position="relative">
                <Button
                  w="full"
                  px="16px"
                  py="14px"
                  borderRadius="12px"
                  border="1px"
                  borderColor="gray.200"
                  bg="#EFF1F6"
                  justifyContent="start"
                  fontSize="14px"
                  color="black"
                  minW="203px"
                  textAlign="left"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  onClick={() => {
                    setShowTransactionType(!showTransactionType)
                    setShowStartCalendar(false)
                    setShowEndCalendar(false)
                  }}
                >
                  <Text 
                    as="span" 
                    overflow="hidden" 
                    whiteSpace="nowrap" 
                    textOverflow="ellipsis"
                    flex="1"
                  >
                    {getTransactionTypeDisplay()}
                  </Text>
                  <Text 
                    as="span" 
                    ml={2} 
                    fontSize="sm" 
                    color="gray.500" 
                    flexShrink={0}
                    transform={showTransactionType ? "rotate(180deg)" : "rotate(0deg)"}
                    transition="transform 0.2s ease"
                  >
                    ▼
                  </Text>
                </Button>
                {showTransactionType && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    zIndex={1001}
                    mt={1}
                  >
                    <TransactionType onSelectionChange={handleTransactionTypeChange} />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Transaction Status */}
            <Box>
              <Text fontSize="16px" fontWeight="semibold" mb={3}>Transaction Status</Text>
              <Box position="relative">
                <Button
                  w="full"
                  px="16px"
                  py="14px"
                  borderRadius="12px"
                  border="1px"
                  borderColor="gray.200"
                  bg="#EFF1F6"
                  justifyContent="start"
                  fontSize="14px"
                  color="black"
                  minW="203px"
                  textAlign="left"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  onClick={() => {
                    setShowTransactionStatus(!showTransactionStatus)
                    setShowStartCalendar(false)
                    setShowEndCalendar(false)
                    setShowTransactionType(false)
                  }}
                >
                  <Text 
                    as="span" 
                    overflow="hidden" 
                    whiteSpace="nowrap" 
                    textOverflow="ellipsis"
                    flex="1"
                  >
                    {getTransactionStatusDisplay()}
                  </Text>
                  <Text 
                    as="span" 
                    ml={2} 
                    fontSize="sm" 
                    color="gray.500" 
                    flexShrink={0}
                    transform={showTransactionStatus ? "rotate(180deg)" : "rotate(0deg)"}
                    transition="transform 0.2s ease"
                  >
                    ▼
                  </Text>
                </Button>
                {showTransactionStatus && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    zIndex={1001}
                    mt={1}
                  >
                    <TransactionStatus onSelectionChange={handleTransactionStatusChange} />
                  </Box>
                )}
              </Box>
            </Box>

              </VStack>
            </Box>

            {/* Fixed Action Buttons at Bottom */}
            <Box p={6} pt={4} borderTop="1px" borderColor="gray.100">
              <HStack justify="space-between">
                <Button
                  bg="white"
                  px="24px"
                  py="12px"
                  width="198px"
                  borderRadius="full"
                  border="1px solid"
                  borderColor="gray.300"
                  color="black"
                  fontSize="14px"
                  onClick={handleClear}
                >
                  Clear
                </Button>
                <Button
                  bg="#DBDEE5"
                  px="24px"
                  py="12px"
                  width="198px"
                  borderRadius="full"
                  fontSize="14px"            
                  color="#ffffff"
                >
                  Apply
                </Button>
              </HStack>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Filter

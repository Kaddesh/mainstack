import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  CloseButton,
  Image,
  Circle
} from '@chakra-ui/react'
import { useState } from 'react'
import Calendar from './Calendar'
import TransactionType from './modal/transactionType'
import TransactionStatus from './modal/transactionStatus'
import { useFilter } from '../hooks/useFilter'

const Filter = () => {
  const {
    startDate,
    endDate,
    selectedTransactionTypes,
    selectedTransactionStatuses,
    setStartDate,
    setEndDate,
    setSelectedTransactionTypes,
    setSelectedTransactionStatuses,
    applyFilters,
    clearFilters,
    getActiveFilterCount,
    quickFilter
  } = useFilter()

  const [isOpen, setIsOpen] = useState(false)
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const [showTransactionType, setShowTransactionType] = useState(false)
  const [showTransactionStatus, setShowTransactionStatus] = useState(false)

  // Helper function to close all modals and calendars
  const closeAllModals = () => {
    setShowStartCalendar(false)
    setShowEndCalendar(false)
    setShowTransactionType(false)
    setShowTransactionStatus(false)
  }

  // Helper function to toggle a specific modal while closing others
  const toggleModal = (modalType: 'startCalendar' | 'endCalendar' | 'transactionType' | 'transactionStatus') => {
    const isCurrentlyOpen = {
      startCalendar: showStartCalendar,
      endCalendar: showEndCalendar,
      transactionType: showTransactionType,
      transactionStatus: showTransactionStatus
    }[modalType]

    // Close all modals first
    closeAllModals()
    
    // If the clicked modal wasn't open, open it
    if (!isCurrentlyOpen) {
      switch (modalType) {
        case 'startCalendar':
          setShowStartCalendar(true)
          break
        case 'endCalendar':
          setShowEndCalendar(true)
          break
        case 'transactionType':
          setShowTransactionType(true)
          break
        case 'transactionStatus':
          setShowTransactionStatus(true)
          break
      }
    }
  }

  const handleTransactionTypeChange = (selected: string[]) => {
    setSelectedTransactionTypes(selected)
  }

  const handleTransactionStatusChange = (selected: string[]) => {
    setSelectedTransactionStatuses(selected)
  }

  const handleApply = () => {
    applyFilters()
    setIsOpen(false)
  }

  const getTransactionTypeDisplay = () => {
    if (selectedTransactionTypes.length === 0) {
      return ''
    }
    return selectedTransactionTypes.join(', ')
  }

  const getTransactionStatusDisplay = () => {
    if (selectedTransactionStatuses.length === 0) {
      return ''
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

  // Use context-provided quick filter setter when available
  // setQuickFilter updates start/end dates according to the selected quick period
  const { setQuickFilter } = useFilter()

  const handleQuickFilter = (period: 'Today' | 'Last 7 days' | 'This month' | 'Last 3 months' | 'All Time') => {
    if (setQuickFilter) {
      setQuickFilter(period)
    }
  }

  const handleClear = () => {
    clearFilters()
  }

  // Determine if there are pending selections to apply
  const getDefaultDatesLocal = () => {
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)
    return { start: sevenDaysAgo, end: today }
  }

  const isSameDay = (a?: Date | null, b?: Date | null) => {
    if (!a || !b) return false
    return a.toDateString() === b.toDateString()
  }

  const defaults = getDefaultDatesLocal()
  const hasTypes = selectedTransactionTypes.length > 0
  const hasStatuses = selectedTransactionStatuses.length > 0
  const hasQuickFilterChange = quickFilter && quickFilter !== 'Last 7 days'
  const hasDateChange = startDate && endDate
    ? !(isSameDay(startDate, defaults.start) && isSameDay(endDate, defaults.end))
    : false
  const hasPendingChanges = !!(hasTypes || hasStatuses || hasQuickFilterChange || hasDateChange)

  return (
    <Box>
      <Button 
        onClick={() => setIsOpen(true)} 
        bg="#DBDEE5"
        color="#131316"
        borderRadius="full"
        px={{ base: 4, md: 6 }}
        py={3}
        fontWeight="semibold"
        fontSize={{ base: "14px", md: "16px" }}
        _hover={{ bg: '#C4C9D0' }}
        position="relative"
        flex={{ base: "1", sm: "0" }}
      >
        Filter
        {getActiveFilterCount() > 0 && (
          <Circle
            size="20px"
            bg="black"
            color="white"
            fontSize="12px"
            fontWeight="bold"
            
          >
            {getActiveFilterCount()}
          </Circle>
        )}
        <Image src="/expand_more.svg" alt="filter" color="#131316" w="11px" h="6px" ml={2} />
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
          p={{ base: 0, md: 4 }}
          pt={{ base: 0, md: 8 }}
        >
          <Box 
            bg="white" 
            borderRadius={{ base: "0", md: "lg" }}
            maxW={{ base: "100%", md: "456px" }}
            w="full"
            h={{ base: "100vh", md: "876px" }}
            maxH={{ base: "100vh", md: "876px" }}
            display="flex"
            flexDirection="column"
          >
            {/* Header */}
            <Box p={{ base: 4, md: 6 }} pb={0}>
              <HStack justify="space-between" mb={{ base: 4, md: 6 }}>
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="bold">Filter</Text>
                <CloseButton onClick={() => setIsOpen(false)} bg="none" h="13px"  w="13px"/>
              </HStack>
            </Box>

            {/* Scrollable Content */}
            <Box flex="1" overflowY="auto" px={{ base: 4, md: 6 }}>
              <VStack gap={{ base: 4, md: 6 }} align="stretch">
            {/* Quick Filter Buttons */}
            <HStack gap={{ base: 2, md: 3 }} wrap="wrap">
              {(['Today', 'Last 7 days', 'This month', 'Last 3 months'] as Array<'Today' | 'Last 7 days' | 'This month' | 'Last 3 months'>).map((period) => (
                <Button
                  key={period}
                  size="sm"
                  bg="#EFF1F6"
                  color="black"
                  px={{ base: "14px", md: "18px" }}
                  py="10px"
                  border="1px"
                  borderColor="gray.200"
                  fontSize={{ base: "13px", md: "14px" }}
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleQuickFilter(period)}
                >
                  {period}
                </Button>
              ))}
            </HStack>

            {/* Date Range */}
            <Box>
              <Text fontSize={{ base: "15px", md: "16px" }} fontWeight="semibold" mb={3}>Date Range</Text>
              <HStack gap={3} flexDirection={{ base: "column", sm: "row" }}>
                <Box position="relative" flex={1} width={{ base: "100%", sm: "auto" }}>
                  <Button
                    w="full"
                    px="16px"
                    py="14px"
                    size="sm"
                    borderRadius="12px"
                    border="1px"
                    borderColor="gray.200"
                    bg="#EFF1F6"
                    justifyContent="space-between"
                    fontSize="14px"
                    color="black"
                    minW={{ base: "100%", sm: "203px" }}
                    onClick={() => toggleModal('startCalendar')}
                  >
                    <Text as="span">{formatDate(startDate)}</Text>
                    <Image src="/expand_more.svg" alt="expand more" color="#31373D" w="8px" h="5px" ml={2} />
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

                <Box position="relative" flex={1} width={{ base: "100%", sm: "auto" }}>
                  <Button
                    w="full"
                    px="16px"
                    py="14px"
                    borderRadius="12px"
                    border="1px"
                    borderColor="gray.200"
                    bg="#EFF1F6"
                    justifyContent="space-between"
                    fontSize="14px"
                    color="black"
                    minW={{ base: "100%", sm: "203px" }}
                    onClick={() => toggleModal('endCalendar')}
                  >
                    <Text as="span">{formatDate(endDate)}</Text>
                    <Image src="/expand_more.svg" alt="expand more" color="#31373D" w="8px" h="5px" ml={2} />
                  </Button>
                  <Calendar
                    selectedDate={endDate || undefined}
                    onDateSelect={(date) => {
                      setEndDate(date)
                      setShowEndCalendar(false)
                    }}
                    isOpen={showEndCalendar}
                    align="right"
                  />
                </Box>
              </HStack>
            </Box>

            {/* Transaction Type */}
            <Box>
              <Text fontSize={{ base: "15px", md: "16px" }} fontWeight="semibold" mb={3}>Transaction Type</Text>
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
                  minW={{ base: "100%", sm: "203px" }}
                  textAlign="left"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  onClick={() => toggleModal('transactionType')}
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
                    <Image src="/expand_more.svg" alt="expand more" color="#31373D" w="8px" h="5px" ml={2} />
                  </Text>
                </Button>
                {showTransactionType && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    zIndex={1001}
                    mt={1}
                    maxW={{ base: "100vw", md: "412px" }}
                  >
                    <TransactionType onSelectionChange={handleTransactionTypeChange} initialSelected={selectedTransactionTypes} />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Transaction Status */}
            <Box>
              <Text fontSize={{ base: "15px", md: "16px" }} fontWeight="semibold" mb={3}>Transaction Status</Text>
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
                  minW={{ base: "100%", sm: "203px" }}
                  textAlign="left"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  onClick={() => toggleModal('transactionStatus')}
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
                   <Image src="/expand_more.svg" alt="expand more" color="#31373D" w="8px" h="5px" ml={2} />
                  </Text>
                </Button>
                {showTransactionStatus && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    zIndex={1001}
                    mt={1}
                    maxW={{ base: "100vw", md: "412px" }}
                  >
                    <TransactionStatus onSelectionChange={handleTransactionStatusChange} initialSelected={selectedTransactionStatuses} />
                  </Box>
                )}
              </Box>
            </Box>

              </VStack>
            </Box>

            {/* Fixed Action Buttons at Bottom */}
            <Box p={{ base: 4, md: 6 }} pt={4} borderTop="1px" borderColor="gray.100">
              <HStack justify="space-between" gap={{ base: 2, md: 0 }}>
                <Button
                  bg="white"
                  px={{ base: "20px", md: "24px" }}
                  py="12px"
                  width={{ base: "48%", md: "198px" }}
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
                  bg={hasPendingChanges ? '#131316' : '#DBDEE5'}
                  px={{ base: "20px", md: "24px" }}
                  py="12px"
                  width={{ base: "48%", md: "198px" }}
                  borderRadius="full"
                  fontSize="14px"            
                  color="#ffffff"
                  _hover={{ bg: hasPendingChanges ? '#000000' : '#C4C9D0' }}
                  onClick={handleApply}
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

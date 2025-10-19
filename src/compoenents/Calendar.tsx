import { Box, HStack, Text, Button, Grid } from '@chakra-ui/react'
import { useState } from 'react'

interface CalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  isOpen?: boolean
}

const Calendar = ({ selectedDate = new Date(), onDateSelect, isOpen = false }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (date: Date | null) => {
    if (date && onDateSelect) {
      onDateSelect(date)
    }
  }

  const isSelectedDate = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  if (!isOpen) return null

  return (
    <Box
      position="absolute"
      top="100%"
      left={0}
      zIndex={1000}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      minW="280px"
    >
      {/* Calendar Header */}
      <HStack justify="space-between" mb={4}>
        <Button size="sm" variant="ghost" onClick={handlePrevMonth}>
          ←
        </Button>
        <Text fontWeight="bold" fontSize="md">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <Button size="sm" variant="ghost" onClick={handleNextMonth}>
          →
        </Button>
      </HStack>

      {/* Days of Week */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2}>
        {daysOfWeek.map((day) => (
          <Text key={day} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.500">
            {day}
          </Text>
        ))}
      </Grid>

      {/* Calendar Days */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {getDaysInMonth(currentMonth).map((date, index) => (
          <Button
            key={index}
            size="sm"
            variant={isSelectedDate(date) ? 'solid' : 'ghost'}
            colorScheme={isSelectedDate(date) ? 'blue' : 'gray'}
            onClick={() => handleDateClick(date)}
            disabled={!date}
            minH="32px"
            fontSize="sm"
          >
            {date ? date.getDate() : ''}
          </Button>
        ))}
      </Grid>
    </Box>
  )
}

export default Calendar
import { Box } from '@chakra-ui/react'
import { DayPicker, type MonthCaptionProps, useNavigation } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import './calendar.css'

interface CalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  isOpen?: boolean
  align?: 'left' | 'right'
}

// Custom caption component with arrows at extremes
function CustomCaption(props: MonthCaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation()
  
  const formatCaption = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <div className="custom-caption">
      <button
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className="caption-nav-button"
      >
        ←
      </button>
      <span className="caption-label">{formatCaption(props.calendarMonth.date)}</span>
      <button
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className="caption-nav-button"
      >
        →
      </button>
    </div>
  )
}

  const Calendar = ({ selectedDate, onDateSelect, isOpen = false, align = 'left' }: CalendarProps) => {
  if (!isOpen) return null

  return (
    <Box
      position="absolute"
      top="100%"
      left={align === 'left' ? 0 : 'auto'}
      right={align === 'right' ? 0 : 'auto'}
      zIndex={1000}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      minW="300px"
      className="custom-calendar"
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date && onDateSelect) {
            onDateSelect(date)
          }
        }}
        showOutsideDays={false}
        defaultMonth={selectedDate}
        weekStartsOn={1}
        components={{
          MonthCaption: CustomCaption
        }}
      />
    </Box>
  )
}

export default Calendar
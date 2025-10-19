

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Box, Text, Spinner } from '@chakra-ui/react'
import { useTransactions } from '../../hooks/useApi'
import { useMemo } from 'react'




// Custom tooltip to show values on hover
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      date: string
      value: number
      displayDate: string
    }
  }>
  label?: string
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Box 
        bg="white" 
        p={2} 
        border="1px solid" 
        borderColor="gray.200" 
        borderRadius="md"
        boxShadow="md"
      >
        <Box fontSize="sm" color="gray.600">
          {payload[0].payload.displayDate}
        </Box>
        <Box fontSize="md" fontWeight="bold" color="#FF5403">
          ${payload[0].value.toLocaleString()}
        </Box>
      </Box>
    )
  }
  return null
}

const Chart = () => {
  const { data: transactions, isLoading, isError } = useTransactions()

  // Process transaction data for chart
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return []
    }

    // Group transactions by date and calculate cumulative balance
    const transactionsByDate = transactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc, transaction) => {
        const date = transaction.date
        const amount = transaction.type === 'deposit' ? transaction.amount : -transaction.amount
        
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += amount
        
        return acc
      }, {} as Record<string, number>)

    // Convert to cumulative chart data
    let cumulativeBalance = 0
    const chartPoints = Object.entries(transactionsByDate)
      .map(([date, dailyAmount]) => {
        cumulativeBalance += dailyAmount
        return {
          date,
          value: Math.max(0, cumulativeBalance), // Don't show negative balances
          displayDate: new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        }
      })

    return chartPoints
  }, [transactions])

  if (isLoading) {
    return (
      <Box maxWidth="765px" height="257px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="#FF5403" />
      </Box>
    )
  }

  if (isError || !chartData.length) {
    return (
      <Box maxWidth="765px" maxHeight="257px" width="100%">
        <Box 
          width="100%" 
          height="200px" 
          mb={4} 
          bg="gray.50" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          borderRadius="md"
        >
          <Text color="gray.500">No transaction data available</Text>
        </Box>
      </Box>
    )
  }

  const startDate = chartData[0]?.displayDate || ''
  const endDate = chartData[chartData.length - 1]?.displayDate || ''

  return (
    <Box maxWidth="765px" maxHeight="257px" width="100%">
      {/* Chart Container */}
      <Box width="100%" height="200px" mb={4} bg="gray.50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            {/* Hidden axes - no ticks, no lines, no labels */}
            <XAxis 
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={false}
              height={0}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={false}
              width={0}
              domain={['dataMin - 200', 'dataMax + 200']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FF5403"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#FF5403', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Date Range Line Below Chart */}
      <Box position="relative" width="100%" height="40px">
        {/* Horizontal line */}
        <Box
          position="absolute"
          top="50%"
          left="20px"
          right="20px"
          height="2px"
          bg="#DBDEE5"
          transform="translateY(-50%)"
        />
        
        {/* Start date with dot */}
        <Box position="absolute" left="20px" top="50%" transform="translate(-50%, -50%)">
          <Box width="8px" height="8px" bg="#DBDEE5" borderRadius="50%" />
        </Box>
        <Text position="absolute" left="50px" top="50%" transform="translateX(-50%)" mt={4} fontSize="sm" color="gray.600">
          {startDate}
        </Text>
        
        {/* End date with dot */}
        <Box position="absolute" right="20px" top="50%" transform="translate(50%, -50%)">
          <Box width="8px" height="8px" bg="#DBDEE5" borderRadius="50%" />
        </Box>
        <Text position="absolute" right="50px" top="50%" transform="translateX(50%)" mt={4} fontSize="sm" color="gray.600">
          {endDate}
        </Text>
      </Box>
    </Box>
  )
}

export default Chart


import {Box, Flex, HStack, Text, Image, Spinner} from '@chakra-ui/react'
import { useUser } from '../../hooks/useApi'

// Simple NavItem component for the UI
interface NavItemProps {
  icon: string
  label: string
  isActive?: boolean
  iconWidth?: string
  iconHeight?: string
}

const NavItem = ({ icon, label, isActive = false, iconWidth = "20px", iconHeight = "20px" }: NavItemProps) => {
  return (
    <Box
      as="button"
      position="relative"
      bg={isActive ? 'black' : 'transparent'}
      color={isActive ? 'white' : 'inherit'}
      borderRadius="50px"
      width="112px"
      p={2}
      transition="all 0.2s"
      border="1px solid transparent"
      _hover={{
        borderColor: 'black',
        transform: 'scale(1.05)',
      }}
    >
      <HStack gap={1} display="flex" alignItems="center" justifyContent="center">
        <Image src={icon} alt={label} width={iconWidth} height={iconHeight} />
        <Text fontSize="16px" fontWeight="medium">
          {label}
        </Text>
      </HStack>
    </Box>
  )
}

// Main Navigation Component - Simple UI only
const Navigation = () => {
  const { data: user, isLoading } = useUser()

  // Generate user initials
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'OL' // fallback
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <Box
      as="nav"
      bg="white"
      borderRadius="100px"
      p={4}
      m={2}
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      width="calc(100% - 16px)"
    >
      <Flex
        align="center"
        justify="space-between"
        maxW="container.xl"
        mx="auto"
        gap={4}
      >
        {/* Logo Section */}
        <Box flexShrink={0}>
          <Image
            src="/mainstack-logo.svg"
            alt="Mainstack Logo"
            height="36px"
            width="36px"
          />
        </Box>

        {/* Navigation Items */}
        <HStack gap={5} flex={1} justify="center">
          <NavItem icon="/home.svg" label="Home" iconWidth="12px" iconHeight="14px" />
          <NavItem icon="/analytics.svg" label="Analytics" iconWidth="14px" iconHeight="14px" />
          <NavItem icon="/Vector (2).svg" label="Revenue" isActive={true} iconWidth="17px" iconHeight="12px" />
          <NavItem icon="/avatar.svg" label="CRM" iconWidth="17px" iconHeight="12px" />
          <NavItem icon="/widgets.svg" label="App" iconWidth="14px" iconHeight="14px" />
        </HStack>

        {/* Action Items */}
        <HStack gap={3} flexShrink={0}>
          <Image src="/notifications.svg" alt="Notifications" width="13px" height="16px" />
          <Image src="/chat.svg" alt="Messages" width="16px" height="14px" />
          
          <Box
            bg="black"
            color="white"
            borderRadius="50%"
            w="32px"
            h="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="sm"
          >
            {isLoading ? (
              <Spinner size="xs" color="white" />
            ) : (
              getUserInitials(user?.first_name, user?.last_name)
            )}
          </Box>

          <Image src="/menu.svg" alt="Menu" width="17px" height="10px" />
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navigation

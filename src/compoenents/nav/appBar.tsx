import { Box, VStack, Button, Image } from '@chakra-ui/react'

const AppBar = () => {
  return (
    <Box
      as="nav"
      position="fixed"
      left="16px"
      top="50%"
      transform="translateY(-50%)"
      zIndex={999}
      bg="transparent"
      aria-label="Application navigation"
    >
  <VStack gap={4} align="center">
        <Button aria-label="Home" variant="ghost" borderRadius="full" p={2} _hover={{ bg: 'transparent' }}>
          <Image src="/Appicon1.svg" alt="home" boxSize="24px" filter="grayscale(1) brightness(1.1)" />
        </Button>

        <Button aria-label="Activity" variant="ghost" borderRadius="full" p={2} _hover={{ bg: 'transparent' }}>
          <Image src="/Appicon2.svg" alt="activity" boxSize="24px" filter="grayscale(1) brightness(1.1)" />
        </Button>

        <Button aria-label="Reports" variant="ghost" borderRadius="full" p={2} _hover={{ bg: 'transparent' }}>
          <Image src="/Appicon3.svg" alt="reports" boxSize="24px" filter="grayscale(1) brightness(1.1)" />
        </Button>

        <Button aria-label="Settings" variant="ghost" borderRadius="full" p={2} _hover={{ bg: 'transparent' }}>
          <Image src="/Appicon4.svg" alt="settings" boxSize="24px" filter="grayscale(1) brightness(1.1)" />
        </Button>
      </VStack>
    </Box>
  )
}

export default AppBar

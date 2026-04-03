import { useState } from 'react'
import {
  Box,
  Container,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link as RouterLink, Outlet } from 'react-router-dom'

const navLinkStyles = {
  px: 3,
  py: 2,
  borderRadius: 'md',
  minH: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 'medium',
  color: 'fg',
  _hover: { bg: 'bg.muted', color: 'green.700' },
}

function NavLinks({ onNavigate, direction = 'row' }) {
  const Stack = direction === 'row' ? HStack : VStack
  const gap = direction === 'row' ? 1 : 0

  const link = (to, label) => (
    <Box
      key={to}
      as={RouterLink}
      to={to}
      onClick={onNavigate}
      {...navLinkStyles}
      w={direction === 'column' ? 'full' : undefined}
      justifyContent={direction === 'column' ? 'flex-start' : undefined}
    >
      {label}
    </Box>
  )

  return (
    <Stack gap={gap} align={direction === 'column' ? 'stretch' : 'center'}>
      {link('/#main', 'Main')}
      <Box
        key="menu-pdf"
        as="a"
        href="/bamboo-menu.pdf"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        {...navLinkStyles}
        w={direction === 'column' ? 'full' : undefined}
        justifyContent={direction === 'column' ? 'flex-start' : undefined}
      >
        Menu
      </Box>
      {link('/#location', 'Location & hours')}
    </Stack>
  )
}

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <Box minH="100dvh" display="flex" flexDirection="column" bg="bg">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex="sticky"
        borderBottomWidth="1px"
        borderColor="border"
        bg="bg/95"
        backdropFilter="blur(8px)"
      >
        <Container maxW="container.lg" py={3}>
          <Flex align="center" justify="space-between" gap={4}>
            <Box
              as={RouterLink}
              to="/"
              onClick={closeDrawer}
              display="flex"
              alignItems="center"
              gap={{ base: 2, md: 3 }}
              fontWeight="bold"
              fontSize="lg"
              color="green.800"
              letterSpacing="tight"
              minH="44px"
              _hover={{ opacity: 0.9 }}
            >
              <Image
                src="/bamboo-logo.png"
                alt="Bamboo Express Ltd. — Oriental take out"
                h={{ base: '38px', md: '44px' }}
                w={{ base: '38px', md: '44px' }}
                fit="contain"
                flexShrink={0}
                draggable={false}
              />
              <Text as="span">Bamboo Express</Text>
            </Box>

            <HStack gap={1} display={{ base: 'none', md: 'flex' }}>
              <NavLinks />
            </HStack>

            <DrawerRoot open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)}>
              <DrawerTrigger asChild display={{ base: 'inline-flex', md: 'none' }}>
                <IconButton
                  aria-label="Open navigation menu"
                  variant="ghost"
                  size="md"
                  minW="44px"
                  minH="44px"
                  colorPalette="green"
                >
                  <MenuIcon />
                </IconButton>
              </DrawerTrigger>
              <DrawerBackdrop />
              <DrawerPositioner>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Navigate</DrawerTitle>
                    <DrawerCloseTrigger top="3" insetEnd="3" position="absolute" />
                  </DrawerHeader>
                  <DrawerBody pt={2}>
                    <NavLinks onNavigate={closeDrawer} direction="column" />
                  </DrawerBody>
                </DrawerContent>
              </DrawerPositioner>
            </DrawerRoot>
          </Flex>
        </Container>
      </Box>

      <Box as="main" flex="1">
        <Outlet />
      </Box>

      <Box as="footer" borderTopWidth="1px" borderColor="border" py={6} px={4} mt="auto">
        <Container maxW="container.lg">
          <Text fontSize="sm" color="fg.muted" textAlign="center">
            © {new Date().getFullYear()} Bamboo Express · Richmond, BC
          </Text>
        </Container>
      </Box>
    </Box>
  )
}

function MenuIcon() {
  return (
    <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" boxSize="1.35rem">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </Box>
  )
}

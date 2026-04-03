import { Box, HStack, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

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

export function NavLinks({ onNavigate, direction = 'row', flexWrap }) {
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
    <Stack
      gap={gap}
      align={direction === 'column' ? 'stretch' : 'center'}
      flexWrap={direction === 'row' ? flexWrap : undefined}
    >
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
      {link('/#order-options', 'Order Options')}
      {link('/#location', 'Location & Hours')}
    </Stack>
  )
}

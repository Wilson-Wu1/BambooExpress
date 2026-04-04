import { Box, HStack, VStack } from '@chakra-ui/react'
import {
  MdHome,
  MdLocationOn,
  MdOutlineTakeoutDining,
  MdRestaurantMenu,
} from 'react-icons/md'
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

  const link = (to, label, Icon) => (
    <Box
      key={to}
      as={RouterLink}
      to={to}
      onClick={onNavigate}
      {...navLinkStyles}
      w={direction === 'column' ? 'full' : undefined}
      justifyContent={direction === 'column' ? 'flex-start' : undefined}
    >
      {direction === 'column' && Icon ? (
        <HStack gap={3} w="full">
          <Box as="span" color="green.700" lineHeight={0} flexShrink={0} aria-hidden>
            <Icon size={22} />
          </Box>
          {label}
        </HStack>
      ) : (
        label
      )}
    </Box>
  )

  return (
    <Stack
      gap={gap}
      align={direction === 'column' ? 'stretch' : 'center'}
      flexWrap={direction === 'row' ? flexWrap : undefined}
    >
      {link('/#main', 'Home', MdHome)}
      {link('/menu', 'Menu', MdRestaurantMenu)}
      {link('/#order-options', 'Order Options', MdOutlineTakeoutDining)}
      {link('/#location', 'Location & Hours', MdLocationOn)}
    </Stack>
  )
}

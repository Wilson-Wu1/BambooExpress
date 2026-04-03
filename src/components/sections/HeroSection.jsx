import { Box, Button, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { GiChopsticks } from 'react-icons/gi'
import { MdPhone } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'

export function HeroSection() {
  return (
    <Box
      as="section"
      id="main"
      position="relative"
      overflow="hidden"
      scrollMarginTop="5rem"
      color="white"
      minH={{ base: '420px', md: 'min(72vh, 600px)' }}
      display="flex"
      alignItems="center"
      py={{ base: 16, md: 20 }}
      px={4}
    >
      <Box
        position="absolute"
        inset={0}
        css={{
          backgroundImage: 'url(/hero-ss-pork.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />
      <Box
        position="absolute"
        inset={0}
        css={{
          background:
            'linear-gradient(105deg, rgba(10, 42, 26, 0.94) 0%, rgba(10, 42, 26, 0.78) 38%, rgba(14, 65, 42, 0.5) 62%, rgba(12, 55, 48, 0.35) 100%)',
        }}
        aria-hidden
      />
      <Container maxW="7xl" position="relative" zIndex={1} w="full">
        <VStack align="start" gap={5}>
          <Heading
            as="h1"
            fontSize={{ base: '2.25rem', md: '3.25rem', lg: '3.75rem' }}
            fontWeight="bold"
            textShadow="0 2px 24px rgba(0,0,0,0.35)"
          >
            Bamboo Express
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} opacity={0.95} maxW="2xl" textShadow="0 1px 12px rgba(0,0,0,0.3)">
            We serve delicious Chinese cuisine in Richmond. Conveniently located in Blundell Centre. Take-out or
            delivery.
          </Text>
          <Flex direction={{ base: 'column', sm: 'row' }} gap={3} w={{ base: 'full', sm: 'auto' }} flexWrap="wrap">
            <Button
              asChild
              size="lg"
              minH="48px"
              fontWeight="semibold"
              bg="green.700"
              color="white"
              _hover={{ bg: 'green.600' }}
            >
              <Box
                as={RouterLink}
                to="/menu"
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
                  <GiChopsticks size={22} />
                </Box>
                View Menu
              </Box>
            </Button>
            <Button
              asChild
              size="lg"
              minH="48px"
              fontWeight="semibold"
              variant="outline"
              borderColor="whiteAlpha.800"
              color="white"
              _hover={{ bg: 'whiteAlpha.200', borderColor: 'white' }}
            >
              <Box
                as="a"
                href="tel:+16042776666"
                display="inline-flex"
                alignItems="center"
                gap={2}
                aria-label="Call Bamboo Express at (604) 277-6666"
              >
                <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
                  <MdPhone size={22} />
                </Box>
                Call now
              </Box>
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
}

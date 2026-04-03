import { Box, Button, Container, Heading, Link, Text, VStack } from '@chakra-ui/react'

export function HeroSection() {
  return (
    <Box
      as="section"
      id="main"
      scrollMarginTop="5rem"
      color="white"
      py={{ base: 24, md: 32 }}
      px={4}
      css={{
        background: 'linear-gradient(160deg, #14532d 0%, #166534 45%, #134e4a 100%)',
      }}
    >
      <Container maxW="container.lg">
        <VStack align="start" gap={5}>
          <Heading as="h1" fontSize={{ base: '2.25rem', md: '3.25rem', lg: '3.75rem' }} fontWeight="bold">
            Bamboo Express
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} opacity={0.95} maxW="2xl">
            Humble counter-serve outpost serving a small menu of basic Chinese classics—from soups to egg
            rolls.
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }}>
            <Link href="tel:+16042776666" color="green.200" fontWeight="semibold" textDecoration="underline">
              (604) 277-6666
            </Link>
          </Text>
          <Button
            asChild
            size="lg"
            minH="48px"
            fontWeight="semibold"
            bg="white"
            color="green.800"
            _hover={{ bg: 'gray.100' }}
          >
            <a href="/bamboo-menu.pdf" target="_blank" rel="noopener noreferrer">
              View Menu
            </a>
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

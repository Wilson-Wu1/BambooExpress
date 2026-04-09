import { Box, Container, Flex, HStack, IconButton, Image, Text } from '@chakra-ui/react'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'
import { NavLinks } from './NavLinks'

export function SiteFooter() {
  return (
    <Box as="footer" borderTopWidth="1px" borderColor="border" py={{ base: 8, md: 10 }} px={4} mt="auto" bg="bg.subtle">
      <Container maxW="7xl">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align={{ base: 'center', lg: 'center' }}
          justify="space-between"
          gap={{ base: 6, lg: 8 }}
        >
          <Box
            as={RouterLink}
            to="/"
            display="flex"
            alignItems="center"
            gap={3}
            flexShrink={0}
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
              h="44px"
              w="44px"
              fit="contain"
              flexShrink={0}
              draggable={false}
            />
            <Text as="span">Bamboo Express</Text>
          </Box>

          <Flex justify="center" flex="1" minW={0}>
            <NavLinks flexWrap="wrap" />
          </Flex>

          <HStack gap={1} flexShrink={0}>
            <IconButton
              asChild
              variant="ghost"
              size="md"
              minW="44px"
              minH="44px"
              colorPalette="green"
              aria-label="Bamboo Express on Instagram"
            >
              <a href="https://www.instagram.com/bamboo.express/" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={22} />
              </a>
            </IconButton>
            <IconButton
              asChild
              variant="ghost"
              size="md"
              minW="44px"
              minH="44px"
              colorPalette="green"
              aria-label="Bamboo Express on Facebook"
            >
              <a href="https://www.facebook.com/BambooXpress" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={22} />
              </a>
            </IconButton>
          </HStack>
        </Flex>

        <Text
          fontSize="sm"
          color="fg.muted"
          textAlign="left"
          mt={{ base: 6, md: 6 }}
          pt={{ base: 6, md: 0 }}
          borderTopWidth={{ base: '1px', md: 0 }}
          borderColor="border"
        >
          © {new Date().getFullYear()} Bamboo Express · Richmond, BC
        </Text>
      </Container>
    </Box>
  )
}

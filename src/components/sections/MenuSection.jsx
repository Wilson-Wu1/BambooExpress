import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FaPepperHot } from 'react-icons/fa'
import { GiChopsticks } from 'react-icons/gi'
import { MENU_SECTION_NOTES, MENU_SECTIONS } from '../../data/menuItems'

function MenuItemCard({ num, zh, en, price, spicy }) {
  return (
    <Box
      bg="bg"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border"
      p={{ base: 4, md: 4 }}
      h="full"
      transition="border-color 0.2s ease, box-shadow 0.2s ease"
      _hover={{ borderColor: 'green.200', boxShadow: 'sm' }}
    >
      <Flex align="flex-start" justify="space-between" gap={3}>
        <Box minW={0} flex="1">
          <Flex align="center" gap={2} flexWrap="wrap" mb={1}>
            {num ? (
              <Badge colorPalette="green" variant="subtle" fontSize="xs" px={2} py={0.5} borderRadius="md">
                #{num}
              </Badge>
            ) : null}
            {spicy ? (
              <Box as="span" color="red.600" lineHeight={0} aria-label="Spicy" title="Spicy">
                <FaPepperHot size={14} />
              </Box>
            ) : null}
          </Flex>
          <Text fontWeight="semibold" fontSize="md" lineHeight="snug">
            {en}
          </Text>
          <Text color="fg.muted" fontSize="sm" mt={1} lineHeight="tall" lang="zh-Hant">
            {zh}
          </Text>
        </Box>
        <Text fontWeight="bold" fontSize="sm" color="green.800" flexShrink={0} whiteSpace="nowrap">
          {price}
        </Text>
      </Flex>
    </Box>
  )
}

export function MenuSection() {
  return (
    <Box as="section" id="menu" scrollMarginTop="5rem" py={{ base: 12, md: 16 }} px={4} bg="bg.subtle">
      <Container maxW="7xl">
        <VStack align="stretch" gap={{ base: 8, md: 10 }}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'flex-end' }}
            justify="space-between"
            gap={4}
          >
            <Box>
              <Heading as="h2" size="2xl" fontWeight="bold">
                Menu
              </Heading>
              <Text color="fg.muted" fontSize="md" maxW="3xl" lineHeight="tall" mt={3}>
                Full à la carte menu in English and Chinese. Prices from our February 2025 menu — confirm when you
                order.
              </Text>
            </Box>
            <Button
              asChild
              variant="outline"
              colorPalette="green"
              size="lg"
              minH="48px"
              alignSelf={{ base: 'stretch', md: 'center' }}
            >
              <Box
                as="a"
                href="/bamboo-menu.pdf"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Box as="span" lineHeight={0} aria-hidden>
                  <GiChopsticks size={20} />
                </Box>
                Printable PDF
              </Box>
            </Button>
          </Flex>

          <VStack align="stretch" gap={{ base: 10, md: 14 }}>
            {MENU_SECTIONS.map((section) => (
              <Box key={section.id} id={`menu-${section.id}`} scrollMarginTop="6rem">
                <Box
                  bg="green.700"
                  color="white"
                  borderRadius="md"
                  px={{ base: 4, md: 5 }}
                  py={3}
                  mb={4}
                  boxShadow="sm"
                >
                  <Heading as="h3" size="lg" fontWeight="bold">
                    <Text as="span">{section.titleEn}</Text>
                    <Text as="span" mx={2} opacity={0.85} aria-hidden>
                      ·
                    </Text>
                    <Text as="span" lang="zh-Hant">
                      {section.titleZh}
                    </Text>
                  </Heading>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={{ base: 3, md: 4 }}>
                  {section.items.map((item, idx) => (
                    <MenuItemCard
                      key={`${section.id}-${item.num || 'x'}-${idx}`}
                      num={item.num}
                      zh={item.zh}
                      en={item.en}
                      price={item.price}
                      spicy={item.spicy}
                    />
                  ))}
                </SimpleGrid>

                {MENU_SECTION_NOTES[section.id] ? (
                  <Text fontSize="sm" color="fg.muted" mt={3} fontStyle="italic">
                    {MENU_SECTION_NOTES[section.id]}
                  </Text>
                ) : null}

                {section.id === 'dinner-combos' ? (
                  <Text fontSize="sm" color="fg.muted" mt={3} fontStyle="italic">
                    Set combinations include fixed dishes — see the printable menu for Style A / B details and full
                    line-ups.
                  </Text>
                ) : null}
              </Box>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

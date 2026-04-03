import { Box, Container, Flex, Heading, Link, Text, VStack } from '@chakra-ui/react'
import { FaCar } from 'react-icons/fa'
import { GrGroup } from 'react-icons/gr'
import { MdOutlineTakeoutDining } from 'react-icons/md'

function BulletList({ items }) {
  return (
    <VStack as="ul" align="stretch" gap={2.5} listStyleType="none" m={0} p={0}>
      {items.map((text) => (
        <Flex key={text} as="li" align="flex-start" gap={2.5}>
          <Text as="span" color="green.700" fontWeight="bold" lineHeight="tall" flexShrink={0} mt={0.5}>
            •
          </Text>
          <Text color="fg" lineHeight="tall">
            {text}
          </Text>
        </Flex>
      ))}
    </VStack>
  )
}

function OptionCard({ title, icon, children }) {
  return (
    <Box
      bg="bg"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border"
      boxShadow="sm"
      p={{ base: 5, md: 6 }}
      h="full"
    >
      <Flex align="center" gap={3} mb={4}>
        <Box color="green.700" flexShrink={0} lineHeight={0} aria-hidden>
          {icon}
        </Box>
        <Heading as="h3" size="lg" fontWeight="bold">
          {title}
        </Heading>
      </Flex>
      {children}
    </Box>
  )
}

export function OrderOptionsSection() {
  return (
    <Box as="section" id="order-options" scrollMarginTop="5rem" py={{ base: 12, md: 16 }} px={4} bg="bg">
      <Container maxW="container.lg">
        <VStack align="stretch" gap={{ base: 8, md: 10 }}>
          <Heading as="h2" size="2xl" fontWeight="bold">
            Your options
          </Heading>
          <Text color="fg.muted" fontSize="md" maxW="3xl" lineHeight="tall">
            Delivery, take-out, and large orders—choose what works for you. Call{' '}
            <Link href="tel:+16042776666" color="green.700" fontWeight="semibold" textDecoration="underline">
              (604) 277-6666
            </Link>{' '}
            to place an order.
          </Text>

          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
            gap={{ base: 5, lg: 6 }}
            alignItems="stretch"
          >
            <OptionCard title="Delivery" icon={<FaCar size={26} />}>
              <BulletList
                items={[
                  'Free delivery within 5 km of Blundell Centre.',
                  'Available daily from 4:30 p.m. on orders over $30.00 before tax.',
                  'Last call for delivery: 8:20 p.m.',
                  'Typical delivery time is about 45 minutes to an hour.',
                  'We accept cash, debit, and credit.',
                ]}
              />
            </OptionCard>

            <OptionCard title="Take-out" icon={<MdOutlineTakeoutDining size={28} />}>
              <BulletList
                items={[
                  'Order ahead by phone—we usually have it ready in 10–15 minutes.',
                  '10% off your bill when you order take-out*.',
                  'Last call for take-out: 8:45 p.m.',
                ]}
              />
              <Text fontSize="sm" color="fg.muted" mt={4} lineHeight="tall">
                *Discount applies to orders over $30.00 before tax.
              </Text>
            </OptionCard>

            <OptionCard title="Large group orders" icon={<GrGroup size={26} />}>
              <BulletList
                items={[
                  'Hosting a party, office lunch, or family dinner? We can handle larger orders.',
                  'Call ahead with your head count and pickup time—we’ll help with portions and timing.',
                  'Advance notice helps us prepare everything fresh and on schedule.',
                ]}
              />
            </OptionCard>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

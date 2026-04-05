import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  FieldLabel,
  FieldRoot,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { GiChopsticks } from 'react-icons/gi'
import { MdClose, MdList, MdPhotoCamera, MdSearch } from 'react-icons/md'
import { PiPepperLight } from 'react-icons/pi'
import { MENU_SECTION_NOTES, MENU_SECTIONS } from '../../data/menuItems'

/**
 * English search aliases: `w/` ↔ "with", `&` ↔ "and" (menu copy uses shorthand).
 * Order: normalize `w/` before `&` so strings like "Beef & Ginger w/ …" stay correct.
 */
function normalizeEnglishForSearch(s) {
  return String(s)
    .toLowerCase()
    .replace(/\bw\/\s*/g, 'with ')
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Single-word queries that must not expand an entire section: `&` in titles becomes "and",
 * so e.g. "Western Chow Mein & Fried Rice" would otherwise match the query `and` and list every dish.
 */
const SECTION_TITLE_SINGLETON_STOPWORDS = new Set(['and', 'or'])

function isSingletonSectionTitleStopwordQuery(qNormEn) {
  const t = qNormEn.trim()
  if (!t) return true
  const tokens = t.split(/\s+/)
  return tokens.length === 1 && SECTION_TITLE_SINGLETON_STOPWORDS.has(t)
}

function dinnerComboItemMatches(item, qNormEn, qRaw) {
  if (item.headlineZh?.includes(qRaw)) return true
  if (item.headlineEn && normalizeEnglishForSearch(item.headlineEn).includes(qNormEn)) return true
  if (item.hintEn && normalizeEnglishForSearch(item.hintEn).includes(qNormEn)) return true
  if (item.price && normalizeEnglishForSearch(item.price).includes(qNormEn)) return true
  for (const opt of item.options || []) {
    if (opt.label && normalizeEnglishForSearch(opt.label).includes(qNormEn)) return true
    for (const line of opt.dishes || []) {
      if (normalizeEnglishForSearch(line).includes(qNormEn)) return true
    }
  }
  for (const line of item.dishes || []) {
    if (normalizeEnglishForSearch(line).includes(qNormEn)) return true
  }
  return false
}

function itemMatchesQuery(item, qNormEn, qRaw) {
  if (item.type === 'dinner_combo') return dinnerComboItemMatches(item, qNormEn, qRaw)
  if (item.en && normalizeEnglishForSearch(item.en).includes(qNormEn)) return true
  if (item.zh && item.zh.includes(qRaw)) return true
  if (item.num && normalizeEnglishForSearch(String(item.num)).includes(qNormEn)) return true
  if (item.price && normalizeEnglishForSearch(item.price).includes(qNormEn)) return true
  return false
}

function sectionTitleMatches(section, qNormEn, qRaw) {
  if (
    !isSingletonSectionTitleStopwordQuery(qNormEn) &&
    normalizeEnglishForSearch(section.titleEn).includes(qNormEn)
  ) {
    return true
  }
  if (section.titleZh.includes(qRaw)) return true
  return false
}

function buildSearchResults(trimmed) {
  const qRaw = trimmed
  const qNormEn = normalizeEnglishForSearch(trimmed)
  const out = []
  for (const section of MENU_SECTIONS) {
    if (section.id === 'dinner-combos') continue
    const allInSection = sectionTitleMatches(section, qNormEn, qRaw)
    const items = allInSection
      ? section.items
      : section.items.filter((item) => itemMatchesQuery(item, qNormEn, qRaw))
    if (items.length) {
      out.push({ section, items })
    }
  }
  return out
}

const PRICE_SPLIT_RE = /\s*·\s*/

function splitMenuPriceRows(price) {
  if (typeof price !== 'string') return []
  return price.split(PRICE_SPLIT_RE).map((s) => s.trim()).filter(Boolean)
}

function MenuItemCard({ num, zh, en, price, spicy, imageSrc, imageAlt }) {
  const hasPhoto = Boolean(imageSrc && imageAlt)
  const [photoOpen, setPhotoOpen] = useState(false)
  const priceRows = splitMenuPriceRows(price)
  const multiSizeLayout = priceRows.length > 1

  const openPhoto = () => setPhotoOpen(true)
  const onPhotoKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openPhoto()
    }
  }

  return (
    <>
      <Box
        bg="bg"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border"
        p={{ base: 4, md: 4 }}
        h="full"
        display="flex"
        flexDirection="column"
        textAlign="left"
        w="full"
        transition={hasPhoto ? 'border-color 0.2s ease, box-shadow 0.2s ease' : undefined}
        _hover={hasPhoto ? { borderColor: 'green.200', boxShadow: 'sm' } : undefined}
        cursor={hasPhoto ? 'pointer' : undefined}
        onClick={hasPhoto ? openPhoto : undefined}
        onKeyDown={hasPhoto ? onPhotoKeyDown : undefined}
        role={hasPhoto ? 'button' : undefined}
        tabIndex={hasPhoto ? 0 : undefined}
        aria-label={hasPhoto ? `View photo of ${en}` : undefined}
        _focusVisible={
          hasPhoto
            ? { outline: '2px solid', outlineColor: 'green.600', outlineOffset: '2px' }
            : undefined
        }
      >
        {multiSizeLayout ? (
          <Flex justify="space-between" align="flex-start" gap={3} mb={1} flexWrap="wrap">
            <VStack align="flex-start" gap={1} flex="1" minW={0}>
              {num ? (
                <Badge colorPalette="green" variant="subtle" fontSize="xs" px={2} py={0.5} borderRadius="md">
                  #{num}
                </Badge>
              ) : null}
              <Box fontWeight="semibold" fontSize="md" lineHeight="snug" w="full">
                <Text as="span" fontWeight="inherit" fontSize="inherit" lineHeight="inherit">
                  {en}
                </Text>
                {spicy ? (
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    ml={2}
                    color="green.700"
                    lineHeight={1}
                    aria-label="Spicy"
                    title="Spicy"
                    css={{
                      '& svg': {
                        display: 'block',
                        transform: 'translateY(0.14em)',
                      },
                    }}
                  >
                    <PiPepperLight size={18} aria-hidden />
                  </Box>
                ) : null}
              </Box>
              <Text color="fg.muted" fontSize="sm" lineHeight="tall" lang="zh-Hant">
                {zh}
              </Text>
            </VStack>
            <VStack align="flex-end" gap={0.5} flexShrink={0}>
              {priceRows.map((line, rowIdx) => (
                <Text
                  key={rowIdx}
                  fontWeight="bold"
                  fontSize="sm"
                  color="green.800"
                  whiteSpace="nowrap"
                  lineHeight="short"
                >
                  {line}
                </Text>
              ))}
            </VStack>
          </Flex>
        ) : (
          <>
            <Flex align="center" justify="space-between" gap={3} mb={1} flexWrap="wrap">
              {num ? (
                <Badge colorPalette="green" variant="subtle" fontSize="xs" px={2} py={0.5} borderRadius="md">
                  #{num}
                </Badge>
              ) : null}
              <Text
                fontWeight="bold"
                fontSize="sm"
                color="green.800"
                flexShrink={0}
                whiteSpace="nowrap"
                ml="auto"
              >
                {price}
              </Text>
            </Flex>
            <Box fontWeight="semibold" fontSize="md" lineHeight="snug" w="full">
              <Text as="span" fontWeight="inherit" fontSize="inherit" lineHeight="inherit">
                {en}
              </Text>
              {spicy ? (
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  ml={2}
                  color="green.700"
                  lineHeight={1}
                  aria-label="Spicy"
                  title="Spicy"
                  css={{
                    '& svg': {
                      display: 'block',
                      transform: 'translateY(0.14em)',
                    },
                  }}
                >
                  <PiPepperLight size={18} aria-hidden />
                </Box>
              ) : null}
            </Box>
            <Text color="fg.muted" fontSize="sm" mt={1} lineHeight="tall" lang="zh-Hant">
              {zh}
            </Text>
          </>
        )}
        {hasPhoto ? (
          <Flex mt="auto" pt={3} justify="flex-end" align="center" gap={2} color="green.700" userSelect="none">
            <Box as="span" lineHeight={0} flexShrink={0} aria-hidden>
              <MdPhotoCamera size={17} />
            </Box>
            <Text fontSize="xs" fontWeight="medium">
              View photo
            </Text>
          </Flex>
        ) : null}
      </Box>

      {hasPhoto ? (
        <DialogRoot open={photoOpen} onOpenChange={(e) => setPhotoOpen(e.open)}>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent maxW="min(100vw - 2rem, 42rem)">
              <DialogHeader position="relative" pr={12}>
                <DialogTitle fontWeight="semibold" pr={2}>
                  {en}
                </DialogTitle>
                <DialogCloseTrigger asChild position="absolute" top="2" insetEnd="2">
                  <IconButton
                    aria-label="Close photo"
                    variant="ghost"
                    size="sm"
                    colorPalette="gray"
                    minW="40px"
                    minH="40px"
                    borderRadius="md"
                  >
                    <Box as="span" lineHeight={0} aria-hidden>
                      <MdClose size={22} />
                    </Box>
                  </IconButton>
                </DialogCloseTrigger>
              </DialogHeader>
              <DialogBody pb={6}>
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  w="full"
                  borderRadius="md"
                  maxH="min(70vh, 520px)"
                  objectFit="contain"
                  bg="bg.muted"
                />
              </DialogBody>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      ) : null}
    </>
  )
}

function ComboDishList({ dishes, dense = false }) {
  return (
    <VStack as="ul" align="stretch" gap={dense ? 1.5 : 2.5} listStyleType="none" m={0} p={0}>
      {dishes.map((line, i) => (
        <Box as="li" key={i} display="flex" gap={dense ? 2 : 2.5} alignItems="flex-start">
          <Text
            as="span"
            color="green.600"
            flexShrink={0}
            mt={dense ? 0 : 0.5}
            aria-hidden
            fontSize={dense ? 'xs' : 'sm'}
            lineHeight={dense ? 1.25 : undefined}
          >
            •
          </Text>
          <Text fontSize={dense ? 'xs' : 'sm'} lineHeight={dense ? 'short' : 'tall'} color="fg">
            {line}
          </Text>
        </Box>
      ))}
    </VStack>
  )
}

function DinnerComboCard({ combo, compact = false, dense = false }) {
  const { headlineEn, headlineZh, price, hintEn, layout, options, dishes } = combo
  const headingSize = compact || dense ? 'sm' : 'md'
  const priceSize = compact || dense ? 'md' : 'lg'
  const cardRadius = dense ? 'md' : 'lg'

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius={cardRadius}
      overflow="hidden"
      bg="bg"
      boxShadow="sm"
      w="full"
    >
      <Flex
        bg="green.700"
        color="white"
        px={{ base: dense ? 3 : 4, md: dense ? 4 : 5 }}
        py={dense ? 2 : 3}
        justify="space-between"
        align="flex-start"
        gap={dense ? 2 : 3}
        flexWrap="wrap"
      >
        <VStack align="flex-start" gap={dense ? 0 : 0.5}>
          <Heading as="h4" size={headingSize} fontWeight="bold" lineHeight={dense ? 'short' : undefined}>
            {headlineEn}
          </Heading>
          <Text fontSize={dense ? 'xs' : 'sm'} opacity={0.92} lang="zh-Hant" lineHeight={dense ? 'short' : undefined}>
            {headlineZh}
          </Text>
        </VStack>
        <Text fontWeight="bold" fontSize={priceSize} whiteSpace="nowrap" color="white">
          {price}
        </Text>
      </Flex>
      <Box p={{ base: dense ? 3 : 4, md: dense ? 4 : 5 }}>
        {hintEn ? (
          <Text
            fontSize={dense ? 'xs' : 'sm'}
            color="fg.muted"
            mb={dense ? 2 : 4}
            fontWeight="medium"
            lineHeight={dense ? 'short' : undefined}
          >
            {hintEn}
          </Text>
        ) : null}
        {layout === 'fixed' ? (
          <ComboDishList dishes={dishes || []} dense={dense} />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: dense ? 2 : 3, md: dense ? 3 : 4 }}>
            {(options || []).map((opt) => (
              <Box
                key={opt.label}
                bg="bg"
                borderRadius={cardRadius}
                borderWidth="1px"
                borderColor="border"
                boxShadow="sm"
                p={{ base: dense ? 3 : 5, md: dense ? 4 : 6 }}
              >
                <Text
                  fontWeight="bold"
                  fontSize={dense ? 'sm' : 'lg'}
                  mb={dense ? 2 : 4}
                  textAlign="center"
                  color="fg"
                >
                  {opt.label}
                </Text>
                <ComboDishList dishes={opt.dishes} dense={dense} />
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  )
}

function DinnerCombosColumn({ sectionId, items }) {
  const blocks = []
  let i = 0
  while (i < items.length) {
    const item = items[i]
    if (item.type !== 'dinner_combo') {
      blocks.push(
        <MenuItemCard
          key={`${sectionId}-${item.num || 'x'}-${i}`}
          num={item.num}
          zh={item.zh}
          en={item.en}
          price={item.price}
          spicy={item.spicy}
          imageSrc={item.imageSrc}
          imageAlt={item.imageAlt}
        />,
      )
      i += 1
      continue
    }
    const next = items[i + 1]
    const pairFourSix =
      item.headlineEn === 'Dinner For Four' &&
      next?.type === 'dinner_combo' &&
      next.headlineEn === 'Dinner For Six'
    if (pairFourSix) {
      blocks.push(
        <SimpleGrid
          key={`${sectionId}-dinner-four-six-${i}`}
          columns={{ base: 1, md: 2 }}
          gap={{ base: 4, md: 5 }}
          w="full"
          alignItems="stretch"
        >
          <DinnerComboCard combo={item} dense />
          <DinnerComboCard combo={next} dense />
        </SimpleGrid>,
      )
      i += 2
    } else {
      blocks.push(<DinnerComboCard key={`${sectionId}-dinner-${i}`} combo={item} dense />)
      i += 1
    }
  }
  return (
    <VStack align="stretch" gap={{ base: 4, md: 5 }} w="full">
      {blocks}
    </VStack>
  )
}

function SectionNavList({ activeSectionId, onPick, tabIdPrefix }) {
  return (
    <VStack align="stretch" gap={1} role="tablist" aria-label="Menu section categories">
      {MENU_SECTIONS.map((s) => {
        const selected = s.id === activeSectionId
        return (
          <Button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={selected}
            id={`${tabIdPrefix}-${s.id}`}
            aria-controls="menu-section-panel"
            variant={selected ? 'subtle' : 'ghost'}
            colorPalette="green"
            justifyContent="flex-start"
            textAlign="left"
            h="auto"
            minH="44px"
            py={2.5}
            px={3}
            fontWeight={selected ? 'semibold' : 'medium'}
            borderLeftWidth="3px"
            borderLeftColor={selected ? 'green.700' : 'transparent'}
            rounded="md"
            onClick={() => onPick(s.id)}
          >
            <VStack align="start" gap={0.5} w="full">
              <Text fontSize="sm" lineHeight="short">
                {s.titleEn}
              </Text>
              <Text
                fontSize="xs"
                lineHeight="short"
                color={selected ? 'green.800' : 'fg.muted'}
                fontWeight="normal"
                lang="zh-Hant"
                opacity={selected ? 0.92 : 1}
              >
                {s.titleZh}
              </Text>
            </VStack>
          </Button>
        )
      })}
    </VStack>
  )
}

function MenuSectionPanel({ section }) {
  if (!section) {
    return null
  }

  return (
    <Box id={`menu-${section.id}`} scrollMarginTop="7rem" w="full">
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

      {MENU_SECTION_NOTES[section.id] ? (
        <VStack align="stretch" gap={2} mb={4}>
          <Text fontSize="sm" color="fg.muted" fontStyle="italic">
            {MENU_SECTION_NOTES[section.id]}
          </Text>
        </VStack>
      ) : null}

      {section.id === 'dinner-combos' ? (
        <DinnerCombosColumn sectionId={section.id} items={section.items} />
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 2, sm: 3, md: 4 }}>
          {section.items.map((item, idx) => (
            <MenuItemCard
              key={`${section.id}-${item.num || 'x'}-${idx}`}
              num={item.num}
              zh={item.zh}
              en={item.en}
              price={item.price}
              spicy={item.spicy}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

function menuSearchResultCells(section, items) {
  const cells = []
  let i = 0
  while (i < items.length) {
    const item = items[i]
    if (section.id === 'dinner-combos' && item.type === 'dinner_combo') {
      const next = items[i + 1]
      const pairFourSix =
        item.headlineEn === 'Dinner For Four' &&
        next?.type === 'dinner_combo' &&
        next.headlineEn === 'Dinner For Six'
      if (pairFourSix) {
        cells.push(
          <Box
            key={`search-${section.id}-dinner-four-six-${i}`}
            gridColumn={{ sm: '1 / -1' }}
            w="full"
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 2, sm: 3, md: 4 }} alignItems="stretch">
              <DinnerComboCard combo={item} compact />
              <DinnerComboCard combo={next} compact />
            </SimpleGrid>
          </Box>,
        )
        i += 2
        continue
      }
    }
    if (item.type === 'dinner_combo') {
      cells.push(
        <Box
          key={`search-${section.id}-dinner-${i}`}
          gridColumn={{ sm: '1 / -1' }}
          w="full"
        >
          <DinnerComboCard combo={item} compact />
        </Box>,
      )
    } else {
      cells.push(
        <MenuItemCard
          key={`search-${section.id}-${item.num || 'x'}-${i}`}
          num={item.num}
          zh={item.zh}
          en={item.en}
          price={item.price}
          spicy={item.spicy}
          imageSrc={item.imageSrc}
          imageAlt={item.imageAlt}
        />,
      )
    }
    i += 1
  }
  return cells
}

function MenuSearchResultsPanel({ blocks, query }) {
  if (!blocks.length) {
    return (
      <Box borderRadius="md" borderWidth="1px" borderColor="border" bg="bg" px={4} py={8} textAlign="center">
        <Text color="fg.muted" fontSize="md">
          No dishes match &ldquo;{query}&rdquo;. Try another name, menu number, or category.
        </Text>
      </Box>
    )
  }

  return (
    <VStack align="stretch" gap={{ base: 8, md: 10 }}>
      {blocks.map(({ section, items }) => (
        <Box key={section.id} scrollMarginTop="7rem">
          <Flex
            align="baseline"
            flexWrap="wrap"
            gapX={2}
            gapY={1}
            mb={3}
            pb={2}
            borderBottomWidth="1px"
            borderColor="border"
          >
            <Heading as="h3" size="md" fontWeight="bold">
              {section.titleEn}
            </Heading>
            <Text fontSize="sm" color="fg.muted" lang="zh-Hant">
              {section.titleZh}
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 2, sm: 3, md: 4 }}>
            {menuSearchResultCells(section, items)}
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  )
}

export function MenuSection() {
  const defaultId = MENU_SECTIONS[0]?.id ?? ''
  const [activeId, setActiveId] = useState(defaultId)
  const [sectionsDrawerOpen, setSectionsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const trimmedSearch = searchQuery.trim()
  const isSearching = trimmedSearch.length > 0

  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash?.replace(/^#/, '')
      if (raw && MENU_SECTIONS.some((s) => s.id === raw)) {
        setActiveId(raw)
        setSearchQuery('')
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  const activeSection = useMemo(
    () => MENU_SECTIONS.find((s) => s.id === activeId) ?? MENU_SECTIONS[0],
    [activeId],
  )

  const searchBlocks = useMemo(
    () => (isSearching ? buildSearchResults(trimmedSearch) : []),
    [isSearching, trimmedSearch],
  )

  const searchResultCount = useMemo(
    () => searchBlocks.reduce((n, b) => n + b.items.length, 0),
    [searchBlocks],
  )

  const pickSection = (id) => {
    setActiveId(id)
    setSearchQuery('')
    window.history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSectionsDrawerOpen(false)
  }

  return (
    <Box as="section" id="menu" scrollMarginTop="5rem" py={{ base: 12, md: 16 }} px={4} bg="bg.subtle">
      <Container maxW="7xl">
        <VStack align="stretch" gap={{ base: 6, md: 8 }}>
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
                Search by dish name, menu number, or Chinese. Or pick a category to browse the full menu.
              </Text>
            </Box>
            <Button
              asChild
              size="lg"
              minH="48px"
              fontWeight="semibold"
              variant="outline"
              borderColor="green.700"
              color="green.700"
              bg="green.50"
              _hover={{ bg: 'green.100', borderColor: 'green.800', color: 'green.800' }}
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
                View Full Menu
              </Box>
            </Button>
          </Flex>

          <FieldRoot maxW={{ base: 'full', md: '36rem' }}>
            <FieldLabel htmlFor="menu-search-input" fontWeight="semibold" fontSize="sm" mb={2}>
              Search menu
            </FieldLabel>
            <InputGroup
              startElement={
                <Box as="span" lineHeight={0} color="fg.muted" aria-hidden>
                  <MdSearch size={20} />
                </Box>
              }
              endElement={
                trimmedSearch ? (
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Clear search"
                    colorPalette="gray"
                    onClick={() => setSearchQuery('')}
                  >
                    <Box as="span" lineHeight={0} aria-hidden>
                      <MdClose size={20} />
                    </Box>
                  </IconButton>
                ) : undefined
              }
            >
              <Input
                id="menu-search-input"
                placeholder="e.g. wonton, 雲吞, 12…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-controls="menu-section-panel"
              />
            </InputGroup>
            {isSearching ? (
              <Text fontSize="sm" color="fg.muted" mt={2} aria-live="polite">
                {searchResultCount === 0
                  ? 'No matches'
                  : `${searchResultCount} match${searchResultCount === 1 ? '' : 'es'}`}
              </Text>
            ) : null}
          </FieldRoot>

          <Flex
            align="flex-start"
            gap={{ base: 6, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
            mx={{ base: -4, md: 0 }}
            px={{ base: 4, md: 0 }}
          >
            <Button
              type="button"
              display={{ base: 'flex', md: 'none' }}
              variant="outline"
              colorPalette="green"
              size="lg"
              minH="48px"
              w="full"
              fontWeight="semibold"
              onClick={() => setSectionsDrawerOpen(true)}
              aria-expanded={sectionsDrawerOpen}
              aria-controls="menu-sections-drawer"
              aria-haspopup="dialog"
            >
              <Box as="span" lineHeight={0} aria-hidden flexShrink={0}>
                <MdList size={22} />
              </Box>
              <Text as="span" ml={2}>
                Browse sections
              </Text>
              <Text as="span" ml="auto" fontSize="sm" fontWeight="normal" color="fg.muted" truncate maxW="45%">
                {isSearching ? 'Search results' : activeSection?.titleEn}
              </Text>
            </Button>

            <DrawerRoot
              open={sectionsDrawerOpen}
              onOpenChange={(e) => setSectionsDrawerOpen(e.open)}
              placement="start"
              closeOnInteractOutside
            >
              <DrawerBackdrop />
              <DrawerPositioner
                onPointerDown={(e) => {
                  if (e.target === e.currentTarget) setSectionsDrawerOpen(false)
                }}
              >
                <DrawerContent id="menu-sections-drawer" maxW="min(100vw, 320px)">
                  <DrawerHeader borderBottomWidth="1px" borderColor="border">
                    <DrawerTitle>Sections</DrawerTitle>
                    <DrawerCloseTrigger asChild position="absolute" top="3" insetEnd="3">
                      <CloseButton
                        size="md"
                        aria-label="Close sections list"
                        variant="ghost"
                        colorPalette="green"
                      />
                    </DrawerCloseTrigger>
                  </DrawerHeader>
                  <DrawerBody py={4}>
                    <SectionNavList
                      activeSectionId={isSearching ? '' : activeSection?.id}
                      onPick={pickSection}
                      tabIdPrefix="menu-drawer-tab"
                    />
                  </DrawerBody>
                </DrawerContent>
              </DrawerPositioner>
            </DrawerRoot>

            <Box
              as="nav"
              display={{ base: 'none', md: 'block' }}
              aria-label="Menu sections"
              w="260px"
              flexShrink={0}
              borderRightWidth="1px"
              borderColor="border"
              pr={6}
            >
              <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mb={3}>
                Sections
              </Text>
              <SectionNavList
                activeSectionId={isSearching ? '' : activeSection?.id}
                onPick={pickSection}
                tabIdPrefix="menu-tab"
              />
            </Box>

            <Box
              flex="1"
              minW={0}
              w={{ base: 'full', md: 'auto' }}
              id="menu-section-panel"
              role="tabpanel"
              aria-label={
                isSearching
                  ? `Search results for ${trimmedSearch}`
                  : `Dishes in ${activeSection?.titleEn ?? 'category'}`
              }
            >
              {isSearching ? (
                <MenuSearchResultsPanel blocks={searchBlocks} query={trimmedSearch} />
              ) : (
                <MenuSectionPanel section={activeSection} />
              )}
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
}

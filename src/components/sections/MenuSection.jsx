import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
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

function itemMatchesQuery(item, qNormEn, qRaw) {
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

function MenuItemCard({ num, zh, en, price, spicy, imageSrc, imageAlt }) {
  const hasPhoto = Boolean(imageSrc && imageAlt)
  const [photoOpen, setPhotoOpen] = useState(false)

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
    <Box id={`menu-${section.id}`} scrollMarginTop="7rem">
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

      {MENU_SECTION_NOTES[section.id] || section.id === 'dinner-combos' ? (
        <VStack align="stretch" gap={2} mb={4}>
          {MENU_SECTION_NOTES[section.id] ? (
            <Text fontSize="sm" color="fg.muted" fontStyle="italic">
              {MENU_SECTION_NOTES[section.id]}
            </Text>
          ) : null}
          {section.id === 'dinner-combos' ? (
            <Text fontSize="sm" color="fg.muted" fontStyle="italic">
              Set combinations include fixed dishes — see the printable menu for Style A / B details and full line-ups.
            </Text>
          ) : null}
        </VStack>
      ) : null}

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
    </Box>
  )
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
            {items.map((item, idx) => (
              <MenuItemCard
                key={`search-${section.id}-${item.num || 'x'}-${idx}`}
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
            >
              <DrawerBackdrop />
              <DrawerPositioner>
                <DrawerContent id="menu-sections-drawer" maxW="min(100vw, 320px)">
                  <DrawerHeader borderBottomWidth="1px" borderColor="border">
                    <DrawerTitle>Sections</DrawerTitle>
                    <DrawerCloseTrigger top="3" insetEnd="3" position="absolute" />
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

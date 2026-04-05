import { useLayoutEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MenuSection } from '../components/sections/MenuSection'
import { MotionBox } from '../lib/chakra-motion'
import { EASE_OUT } from '../lib/motion-presets'

export function MenuPage() {
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <MotionBox
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT }}
    >
      <MenuSection />
    </MotionBox>
  )
}

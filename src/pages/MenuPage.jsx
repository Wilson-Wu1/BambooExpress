import { useLayoutEffect } from 'react'
import { MenuSection } from '../components/sections/MenuSection'

export function MenuPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <MenuSection />
}

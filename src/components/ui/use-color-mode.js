import { useTheme } from 'next-themes'
import { useCallback } from 'react'

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme()

  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light'

  const toggleColorMode = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode,
    resolvedTheme,
  }
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

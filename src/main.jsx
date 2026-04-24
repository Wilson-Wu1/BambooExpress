import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ColorModeProvider } from './components/ui/color-mode-provider'
import './index.css'

// Drawer backdrop used `z-index: var(--z-index)` with no variable set → stacks below `sticky` (1100); use `modal` (1400).
// Widen backdrop/positioner with `width: auto` + inline insets instead of `100vw` to avoid edge clipping.
const system = createSystem(defaultConfig, {
  theme: {
    semanticTokens: {
      colors: {
        brand: {
          fg: {
            value: { _light: '{colors.green.800}', _dark: '{colors.green.200}' },
          },
          fgStrong: {
            value: { _light: '{colors.green.900}', _dark: '{colors.green.100}' },
          },
          accent: {
            value: { _light: '{colors.green.700}', _dark: '{colors.green.300}' },
          },
          surface: {
            value: { _light: '{colors.green.50}', _dark: '{colors.green.950}' },
          },
          surfaceHover: {
            value: { _light: '{colors.green.100}', _dark: '{colors.green.900}' },
          },
          border: {
            value: { _light: '{colors.green.800}', _dark: '{colors.green.600}' },
          },
        },
      },
    },
    slotRecipes: {
      drawer: {
        base: {
          backdrop: {
            zIndex: 'modal',
            w: 'auto',
            insetInlineEnd: 0,
          },
          positioner: {
            width: 'auto',
            insetInlineEnd: 0,
          },
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>,
)

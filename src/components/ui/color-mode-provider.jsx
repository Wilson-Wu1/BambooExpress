import { ThemeProvider } from 'next-themes'

export function ColorModeProvider({ children, ...props }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange enableSystem defaultTheme="system" {...props}>
      {children}
    </ThemeProvider>
  )
}

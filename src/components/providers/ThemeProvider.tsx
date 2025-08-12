// Theme provider component - wraps app with light/dark theme functionality
// Props: children (ReactNode)
import { ThemeProvider as NextThemeProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  )
}
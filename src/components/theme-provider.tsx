"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ThemeContext, type Theme } from "../contexts/theme-context"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove transition temporarily if disableTransitionOnChange is true
    if (disableTransitionOnChange) {
      root.classList.add("no-transitions")
    }

    // Remove previous theme attribute/class
    if (attribute === "class") {
      root.classList.remove("light", "dark")
    } else {
      root.removeAttribute(attribute)
    }

    // Set new theme
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      if (attribute === "class") {
        root.classList.add(systemTheme)
      } else {
        root.setAttribute(attribute, systemTheme)
      }
    } else {
      if (attribute === "class") {
        root.classList.add(theme)
      } else {
        root.setAttribute(attribute, theme)
      }
    }

    // Restore transitions
    if (disableTransitionOnChange) {
      setTimeout(() => {
        root.classList.remove("no-transitions")
      }, 0)
    }
  }, [theme, attribute, enableSystem, disableTransitionOnChange])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  )
}


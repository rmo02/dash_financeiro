"use client"

import { createContext } from "react"

export type Theme = "dark" | "light" | "system"

export type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const initialThemeContext: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
}

export const ThemeContext = createContext<ThemeContextType>(initialThemeContext)


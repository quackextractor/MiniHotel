import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../components/theme-provider'
import { vi, describe, it, expect } from 'vitest'

vi.mock('next-themes', () => {
  return {
    ThemeProvider: ({ children, attribute, defaultTheme }: any) => (
      <div data-testid="mock-next-theme-provider" data-attribute={attribute} data-theme={defaultTheme}>
        {children}
      </div>
    ),
  }
})

describe('ThemeProvider Component', () => {
  it('renders children inside NextThemesProvider with props', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <span data-testid="child-element">Hello Theme</span>
      </ThemeProvider>
    )

    const provider = screen.getByTestId('mock-next-theme-provider')
    expect(provider).toBeInTheDocument()
    expect(provider).toHaveAttribute('data-attribute', 'class')
    expect(provider).toHaveAttribute('data-theme', 'dark')

    const child = screen.getByTestId('child-element')
    expect(child).toBeInTheDocument()
    expect(child.textContent).toBe('Hello Theme')
  })
})

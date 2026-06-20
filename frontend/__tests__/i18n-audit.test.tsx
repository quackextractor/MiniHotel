import React from 'react'
import { render, screen } from '@testing-library/react'
import { I18nAudit } from '../components/i18n-audit'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock Dialog components
vi.mock('@/components/ui/dialog', () => {
  return {
    Dialog: ({ children, open }: any) => open ? <div data-testid="mock-dialog">{children}</div> : null,
    DialogContent: ({ children }: any) => <div data-testid="mock-dialog-content">{children}</div>,
    DialogHeader: ({ children }: any) => <div data-testid="mock-dialog-header">{children}</div>,
    DialogTitle: ({ children }: any) => <div data-testid="mock-dialog-title">{children}</div>,
    DialogDescription: ({ children }: any) => <div data-testid="mock-dialog-description">{children}</div>,
  }
})

// Mock ScrollArea component
vi.mock('@/components/ui/scroll-area', () => {
  return {
    ScrollArea: ({ children }: any) => <div data-testid="mock-scroll-area">{children}</div>,
  }
})

describe('I18nAudit Component', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('renders null if missingTranslations array is empty', () => {
    render(<I18nAudit missingTranslations={[]} />)
    expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument()
  })

  it('renders dialog with missing translations if missingTranslations array contains items', () => {
    const missingTranslations = [
      { locale: 'cs', missingKeys: ['Common.save', 'Navigation.dashboard'] }
    ]

    render(<I18nAudit missingTranslations={missingTranslations} />)

    expect(screen.getByTestId('mock-dialog')).toBeInTheDocument()
    expect(screen.getByText('Translation Issues Detected')).toBeInTheDocument()
    expect(screen.getByText('cs')).toBeInTheDocument()
    expect(screen.getByText('2 missing keys')).toBeInTheDocument()
    expect(screen.getByText('Common.save')).toBeInTheDocument()
    expect(screen.getByText('Navigation.dashboard')).toBeInTheDocument()
  })

  it('renders null in production even if missingTranslations array has items', () => {
    process.env.NODE_ENV = 'production'
    const missingTranslations = [
      { locale: 'cs', missingKeys: ['Common.save'] }
    ]

    render(<I18nAudit missingTranslations={missingTranslations} />)
    expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument()
  })
})

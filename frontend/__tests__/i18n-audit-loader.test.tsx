import React from 'react'
import { render, screen } from '@testing-library/react'
import { I18nAuditLoader } from '../components/i18n-audit-loader'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'

// Mock fs module
vi.mock('fs', () => {
  return {
    default: {
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
      readFileSync: vi.fn(),
    },
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  }
})

// Mock I18nAudit component
vi.mock('../components/i18n-audit', () => ({
  I18nAudit: ({ missingTranslations }: any) => (
    <div data-testid="mock-i18n-audit">
      {missingTranslations.map((res: any) => (
        <div key={res.locale} data-testid={`locale-${res.locale}`}>
          {res.missingKeys.join(',')}
        </div>
      ))}
    </div>
  ),
}))

describe('I18nAuditLoader Component', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('returns null if not in development environment', () => {
    process.env.NODE_ENV = 'production'
    render(<I18nAuditLoader />)
    expect(screen.queryByTestId('mock-i18n-audit')).not.toBeInTheDocument()
  })

  it('returns null if messages directory does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    render(<I18nAuditLoader />)
    expect(screen.queryByTestId('mock-i18n-audit')).not.toBeInTheDocument()
  })

  it('correctly flattens translation keys, detects missing keys, and renders I18nAudit', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readdirSync).mockReturnValue(['en.json', 'cs.json'] as any)
    
    // en.json has Common.cancel, Common.save, and Navigation.dashboard
    const enContent = JSON.stringify({
      Common: { cancel: 'Cancel', save: 'Save' },
      Navigation: { dashboard: 'Dashboard' }
    })
    
    // cs.json is missing Common.save and Navigation.dashboard
    const csContent = JSON.stringify({
      Common: { cancel: 'Zrušit' }
    })

    vi.mocked(fs.readFileSync).mockImplementation((path: any) => {
      if (path.includes('en.json')) return enContent
      if (path.includes('cs.json')) return csContent
      return ''
    })

    render(<I18nAuditLoader />)

    expect(screen.getByTestId('mock-i18n-audit')).toBeInTheDocument()
    
    // Check that cs locale shows missing keys
    const csResult = screen.getByTestId('locale-cs')
    expect(csResult).toBeInTheDocument()
    expect(csResult.textContent).toContain('Common.save')
    expect(csResult.textContent).toContain('Navigation.dashboard')
    
    // en locale should not have missing keys since it has all keys
    expect(screen.queryByTestId('locale-en')).not.toBeInTheDocument()
  })
})

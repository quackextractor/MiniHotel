import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PrivacyPolicy } from '@/components/PrivacyPolicy'

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}))

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/privacy',
  Link: ({ children, href, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
  redirect: vi.fn(),
  getPathname: vi.fn(),
}))

vi.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}))

describe('PrivacyPolicy', () => {
  it('renders translations successfully', () => {
    render(<PrivacyPolicy />)
    expect(screen.getByText('Privacy.title')).toBeDefined()
    expect(screen.getByText('Privacy.description')).toBeDefined()
    expect(screen.getByText('Privacy.gdprNotice')).toBeDefined()
    expect(screen.getByText('Privacy.dataDetails')).toBeDefined()
    expect(screen.getByText('Privacy.demoDataControl')).toBeDefined()
    expect(screen.getByText('Privacy.goBack')).toBeDefined()
  })

  it('renders LanguageSwitcher component', () => {
    render(<PrivacyPolicy />)
    expect(screen.getByTestId('language-switcher')).toBeDefined()
  })
})

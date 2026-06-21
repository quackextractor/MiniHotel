import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: vi.fn().mockReturnValue(null) }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useParams: () => ({ locale: 'en' }),
}))

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/login',
  Link: ({ children, href, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
  redirect: vi.fn(),
  getPathname: vi.fn(),
}))

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
}))

vi.mock('@/hooks/use-enter-navigation', () => ({
  useEnterNavigation: () => ({ current: null }),
}))

vi.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}))

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ initialized: true }),
})
vi.stubGlobal('fetch', mockFetch)

import LoginPage from '@/app/[locale]/login/page'

describe('LoginPage', () => {
  it('renders language switcher', async () => {
    render(<LoginPage />)
    await waitFor(() => {
      expect(screen.getByTestId('language-switcher')).toBeDefined()
    })
  })

  it('renders Privacy Policy link pointing to /privacy', async () => {
    render(<LoginPage />)
    await waitFor(() => {
      const link = screen.getByText('Privacy Policy') as HTMLAnchorElement
      expect(link).toBeDefined()
      expect(link.getAttribute('href')).toContain('privacy')
    })
  })

  it('renders Sign in button', async () => {
    render(<LoginPage />)
    await waitFor(() => {
      expect(screen.getByText('Sign in')).toBeDefined()
    })
  })
})

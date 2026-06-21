import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useParams: () => ({ locale: 'en' }),
}))

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/register',
  Link: ({ children, href, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
  redirect: vi.fn(),
  getPathname: vi.fn(),
}))

vi.mock('@/hooks/use-enter-navigation', () => ({
  useEnterNavigation: () => ({ current: null }),
}))

vi.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}))

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ initialized: false }),
})
vi.stubGlobal('fetch', mockFetch)

import RegisterPage from '@/app/[locale]/register/page'

describe('RegisterPage', () => {
  it('renders language switcher', async () => {
    render(<RegisterPage />)
    await waitFor(() => {
      expect(screen.getByTestId('language-switcher')).toBeDefined()
    })
  })

  it('renders Privacy Policy link pointing to /privacy', async () => {
    render(<RegisterPage />)
    await waitFor(() => {
      const link = screen.getByText('Privacy Policy') as HTMLAnchorElement
      expect(link).toBeDefined()
      expect(link.getAttribute('href')).toContain('privacy')
    })
  })

  it('renders Register Admin button', async () => {
    render(<RegisterPage />)
    await waitFor(() => {
      expect(screen.getByText('Register Admin')).toBeDefined()
    })
  })
})

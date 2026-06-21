import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}))

const mockReplace = vi.fn()

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ replace: mockReplace, push: vi.fn() }),
  usePathname: () => '/dashboard',
  Link: ({ children }: any) => children,
  redirect: vi.fn(),
  getPathname: vi.fn(),
}))

describe('LanguageSwitcher', () => {
  it('renders language select dropdown', () => {
    render(<LanguageSwitcher />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDefined()
  })

  it('shows all three locale options', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByText('EN')).toBeDefined()
    expect(screen.getByText('CS')).toBeDefined()
    expect(screen.getByText('DE')).toBeDefined()
  })

  it('defaults to current locale from params', () => {
    render(<LanguageSwitcher />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('en')
  })

  it('calls router.replace with new locale on change', () => {
    render(<LanguageSwitcher />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'de' } })
    expect(mockReplace).toHaveBeenCalledWith('/dashboard', { locale: 'de' })
  })
})

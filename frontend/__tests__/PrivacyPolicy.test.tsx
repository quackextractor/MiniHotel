import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PrivacyPolicy } from '../components/PrivacyPolicy'
import { vi, describe, it, expect, afterEach } from 'vitest'

const mockBack = vi.fn()
vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: mockBack,
  }),
  usePathname: () => '/en/dashboard',
  Link: ({ children }: any) => children,
}))

describe('PrivacyPolicy Component', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEMO_MODE

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = originalEnv
    vi.clearAllMocks()
  })

  it('renders demo notice when in demo mode', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
    render(<PrivacyPolicy />)
    expect(screen.getByText(/System runs in Demo Mode/i)).toBeInTheDocument()
    expect(screen.getByText(/I take user privacy and GDPR compliance seriously/i)).toBeInTheDocument()
    expect(screen.getByText(/Specifically, this MiniHotel application manages guest profiles/i)).toBeInTheDocument()
  })

  it('renders production notice when not in demo mode', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false'
    render(<PrivacyPolicy />)
    expect(screen.getByText(/Standard server processing active/i)).toBeInTheDocument()
    expect(screen.getByText(/I take user privacy and GDPR compliance seriously/i)).toBeInTheDocument()
    expect(screen.getByText(/Specifically, this MiniHotel application manages guest profiles/i)).toBeInTheDocument()
  })

  it('triggers router back when Go Back button is clicked', () => {
    render(<PrivacyPolicy />)
    const backBtn = screen.getByRole('button', { name: /go back/i })
    fireEvent.click(backBtn)
    expect(mockBack).toHaveBeenCalledTimes(1)
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { PrivacyPolicy } from '../components/PrivacyPolicy'
import { describe, it, expect, afterEach } from 'vitest'

describe('PrivacyPolicy Component', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEMO_MODE

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = originalEnv
  })

  it('renders demo notice when in demo mode', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
    render(<PrivacyPolicy />)
    expect(screen.getByText(/System runs in Demo Mode/i)).toBeInTheDocument()
  })

  it('renders production notice when not in demo mode', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false'
    render(<PrivacyPolicy />)
    expect(screen.getByText(/Standard server processing active/i)).toBeInTheDocument()
  })
})

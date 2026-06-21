import React from 'react'
import { render, screen } from '@testing-library/react'
import { DemoBadge } from '../components/DemoBadge'
import { describe, it, expect, afterEach } from 'vitest'

describe('DemoBadge Component', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEMO_MODE

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = originalEnv
  })

  it('renders nothing when NEXT_PUBLIC_DEMO_MODE is not true', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false'
    const { container } = render(<DemoBadge />)
    expect(container.firstChild).toBeNull()
  })

  it('renders DEMO MODE when NEXT_PUBLIC_DEMO_MODE is true', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
    render(<DemoBadge />)
    expect(screen.getByText(/Demo Mode/i)).toBeInTheDocument()
  })
})

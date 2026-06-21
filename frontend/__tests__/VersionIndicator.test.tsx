import React from 'react'
import { render, screen } from '@testing-library/react'
import { VersionIndicator } from '../components/VersionIndicator'
import { describe, it, expect } from 'vitest'

describe('VersionIndicator Component', () => {
  it('renders correct version passed via prop', () => {
    render(<VersionIndicator version="0.9.1" />)
    expect(screen.getByText('v0.9.1')).toBeInTheDocument()
  })
})

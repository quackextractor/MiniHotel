import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChangelogViewer } from '../components/ChangelogViewer'
import { describe, it, expect } from 'vitest'

describe('ChangelogViewer Component', () => {
  const mockContent = `
## [0.9.1] - 2026-06-20
### Added
- Feature one
- Feature two

## [0.9.0] - 2026-06-19
### Changed
- Refactored core logic
  `

  it('renders the first chunk initially', () => {
    render(<ChangelogViewer content={mockContent} />)
    expect(screen.getByText('[0.9.1] - 2026-06-20')).toBeInTheDocument()
    expect(screen.getByText('Feature one')).toBeInTheDocument()
    expect(screen.queryByText('[0.9.0] - 2026-06-19')).not.toBeInTheDocument()
  })

  it('navigates to next page on click', () => {
    render(<ChangelogViewer content={mockContent} />)
    const nextBtn = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextBtn)
    expect(screen.getByText('[0.9.0] - 2026-06-19')).toBeInTheDocument()
    expect(screen.getByText('Refactored core logic')).toBeInTheDocument()
    expect(screen.queryByText('[0.9.1] - 2026-06-20')).not.toBeInTheDocument()
  })

  it('disables previous button on first page and next button on last page', () => {
    render(<ChangelogViewer content={mockContent} />)
    const prevBtn = screen.getByRole('button', { name: /previous/i })
    const nextBtn = screen.getByRole('button', { name: /next/i })

    expect(prevBtn).toBeDisabled()
    expect(nextBtn).not.toBeDisabled()

    fireEvent.click(nextBtn)

    expect(prevBtn).not.toBeDisabled()
    expect(nextBtn).toBeDisabled()
  })
})

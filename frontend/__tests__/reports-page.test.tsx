import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

vi.mock('@/lib/api', () => ({
  api: {
    getOccupancyStats: vi.fn().mockResolvedValue({
      average_occupancy_rate: 65.5,
      total_bookings: 10,
      total_revenue: 1500,
      unique_guests: 5,
      daily_occupancy: [
        { date: '2026-06-01', occupancy_rate: 60.0 },
        { date: '2026-06-02', occupancy_rate: 70.0 }
      ],
      room_type_performance: [
        { room_type: 'Single', booking_count: 6 },
        { room_type: 'Double', booking_count: 4 }
      ]
    })
  }
}))

vi.mock('@/hooks/use-currency', () => ({
  useCurrency: () => ({
    convert: (v: number) => v,
    currency: 'USD'
  })
}))

import ReportsPage from '@/app/[locale]/dashboard/reports/page'

describe('ReportsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders stats successfully after loading', async () => {
    render(<ReportsPage />)

    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    // Assert stats values are rendered
    expect(screen.getByText('10')).toBeInTheDocument() // total bookings
    expect(screen.getByText('5')).toBeInTheDocument() // unique guests
    expect(screen.getByText('65.5%')).toBeInTheDocument() // average occupancy
  })
})

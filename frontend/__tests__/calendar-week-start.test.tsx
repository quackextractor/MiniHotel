import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as settingsContext from '@/lib/settings-context'

vi.mock('@/lib/api', () => ({
  api: {
    getBookings: vi.fn().mockResolvedValue([]),
    getRooms: vi.fn().mockResolvedValue([
      { id: 1, room_number: '101', room_type: 'Single', base_rate: 100, capacity: 2 },
    ]),
    getGuests: vi.fn().mockResolvedValue([]),
    getServices: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@/hooks/use-currency', () => ({
  useCurrency: () => ({ convert: (v: number) => v, currency: 'USD' }),
}))

vi.mock('@/hooks/use-custom-format', () => ({
  useDateFormat: () => ({ formatDate: (d: string) => d }),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import CalendarPage from '@/app/[locale]/dashboard/calendar/page'

describe('CalendarPage - firstDayOfWeek configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders week starting on Monday by default (firstDayOfWeek = 1)', async () => {
    vi.spyOn(settingsContext, 'useSettings').mockReturnValue({
      settings: {
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        hotelName: 'Mock Hotel',
        autoLogoutEnabled: false,
        autoLogoutTimeout: 30,
        firstDayOfWeek: 1, // Monday
      },
      updateSettings: vi.fn(),
    })

    render(<CalendarPage />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    expect(screen.getByText(/Days\.monShort/i)).toBeInTheDocument()
  })

  it('renders week starting on Sunday (firstDayOfWeek = 0)', async () => {
    vi.spyOn(settingsContext, 'useSettings').mockReturnValue({
      settings: {
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        hotelName: 'Mock Hotel',
        autoLogoutEnabled: false,
        autoLogoutTimeout: 30,
        firstDayOfWeek: 0, // Sunday
      },
      updateSettings: vi.fn(),
    })

    render(<CalendarPage />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    expect(screen.getByText(/Days\.sunShort/i)).toBeInTheDocument()
  })
})

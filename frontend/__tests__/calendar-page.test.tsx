import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/lib/api', () => ({
  api: {
    getBookings: vi.fn().mockResolvedValue([]),
    getRooms: vi.fn().mockResolvedValue([
      { id: 1, room_number: '101', room_type: 'Single', base_rate: 100, capacity: 2 },
    ]),
    getGuests: vi.fn().mockResolvedValue([]),
    getServices: vi.fn().mockResolvedValue([]),
    createBooking: vi.fn().mockResolvedValue({ id: 99 }),
    updateBooking: vi.fn().mockResolvedValue({}),
    updateBookingStatus: vi.fn().mockResolvedValue({}),
    deleteBooking: vi.fn().mockResolvedValue({}),
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

vi.mock('@/components/booking-form', () => ({
  BookingForm: ({ onCancel, initialData }: any) => (
    <div data-testid="booking-form">
      <span data-testid="initial-room-id">{initialData?.room_id}</span>
      <span data-testid="initial-check-in">{initialData?.check_in}</span>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}))

import CalendarPage from '@/app/[locale]/dashboard/calendar/page'

describe('CalendarPage - Empty Cell Click', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders calendar grid after loading', async () => {
    render(<CalendarPage />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })
  })

  it('opens add booking dialog when empty cell is clicked', async () => {
    render(<CalendarPage />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    const cells = document.querySelectorAll('.cursor-pointer')
    expect(cells.length).toBeGreaterThan(0)

    fireEvent.click(cells[0])

    await waitFor(() => {
      expect(screen.getByTestId('booking-form')).toBeDefined()
    })
  })

  it('pre-fills room_id from clicked cell room', async () => {
    render(<CalendarPage />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    const cells = document.querySelectorAll('.cursor-pointer')
    fireEvent.click(cells[0])

    await waitFor(() => {
      const roomId = screen.getByTestId('initial-room-id').textContent
      expect(roomId).toBe('1')
    })
  })

  it('pre-fills check_in as YYYY-MM-DD string from clicked cell date', async () => {
    render(<CalendarPage />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    const cells = document.querySelectorAll('.cursor-pointer')
    fireEvent.click(cells[0])

    await waitFor(() => {
      const checkIn = screen.getByTestId('initial-check-in').textContent
      expect(checkIn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  it('closes add dialog on cancel', async () => {
    render(<CalendarPage />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    const cells = document.querySelectorAll('.cursor-pointer')
    fireEvent.click(cells[0])

    await waitFor(() => {
      expect(screen.getByTestId('booking-form')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Cancel'))

    await waitFor(() => {
      expect(screen.queryByTestId('booking-form')).toBeNull()
    })
  })
})

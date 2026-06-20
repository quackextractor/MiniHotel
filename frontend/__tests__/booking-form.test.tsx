import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookingForm } from '../components/booking-form'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockCalculateRate = vi.fn()
vi.mock('@/lib/api', () => ({
  api: {
    calculateRate: (...args: any[]) => mockCalculateRate(...args),
  },
}))

vi.mock('@/hooks/use-currency', () => ({
  useCurrency: () => ({
    convert: (amount: number) => amount,
    convertToBase: (amount: number) => amount,
    currency: 'USD',
    currencyRates: { USD: 1, CZK: 20 },
  }),
}))

vi.mock('@/hooks/use-enter-navigation', () => ({
  useEnterNavigation: () => ({ current: null }),
}))

// Mock Select components without invalid nesting
vi.mock('@/components/ui/select', () => {
  return {
    Select: ({ children, value, onValueChange }: any) => (
      <div data-testid="mock-select-container">
        <select data-testid="mock-select" value={value} onChange={(e) => onValueChange(e.target.value)}>
          {children}
        </select>
      </div>
    ),
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <>{placeholder}</>,
  }
})

// Mock Popover components
vi.mock('@/components/ui/popover', () => {
  return {
    Popover: ({ children }: any) => <div data-testid="mock-popover">{children}</div>,
    PopoverTrigger: ({ children }: any) => <div data-testid="mock-popover-trigger">{children}</div>,
    PopoverContent: ({ children }: any) => <div data-testid="mock-popover-content">{children}</div>,
  }
})

// Mock Command components
vi.mock('@/components/ui/command', () => {
  return {
    Command: ({ children }: any) => <div data-testid="mock-command">{children}</div>,
    CommandInput: ({ placeholder, value, onValueChange }: any) => (
      <input
        data-testid="mock-command-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
      />
    ),
    CommandList: ({ children }: any) => <div>{children}</div>,
    CommandEmpty: ({ children }: any) => <div>{children}</div>,
    CommandGroup: ({ children }: any) => <div>{children}</div>,
    CommandItem: ({ children, onSelect, value }: any) => (
      <div data-testid="mock-command-item" onClick={() => onSelect && onSelect(value)}>
        {children}
      </div>
    ),
  }
})

// Mock Checkbox
vi.mock('@/components/ui/checkbox', () => {
  return {
    Checkbox: ({ id, checked, onCheckedChange }: any) => (
      <input
        type="checkbox"
        data-testid={`mock-checkbox-${id}`}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
    ),
  }
})

// Mock Alert
vi.mock('@/components/ui/alert', () => {
  return {
    Alert: ({ children }: any) => <div data-testid="mock-alert">{children}</div>,
    AlertTitle: ({ children }: any) => <h4>{children}</h4>,
    AlertDescription: ({ children }: any) => <p>{children}</p>,
  }
})

const mockRooms = [
  { id: 1, room_number: '101', room_type: 'Single', base_rate: 100, capacity: 2 },
  { id: 2, room_number: '102', room_type: 'Double', base_rate: 150, capacity: 4 },
]

const mockGuests = [
  { id: 10, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
  { id: 11, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
]

const mockServices = [
  { id: 20, name: 'Breakfast', price: 15 },
]

describe('BookingForm Component', () => {
  const mockSubmit = vi.fn()
  const mockCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCalculateRate.mockResolvedValue({ total_amount: 200, calculated_rate: 200, capacity_exceeded: false })
  })

  it('renders all initial fields and details', () => {
    render(
      <BookingForm
        rooms={mockRooms}
        guests={mockGuests}
        services={mockServices}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    )

    expect(screen.getByLabelText(/checkInDate/)).toBeInTheDocument()
    expect(screen.getByLabelText(/checkOutDate/)).toBeInTheDocument()
    expect(screen.getByLabelText(/numberOfGuests/)).toBeInTheDocument()
    expect(screen.getByText(/Bookings.createBooking/)).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <BookingForm
        rooms={mockRooms}
        guests={mockGuests}
        services={mockServices}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    )

    const cancelBtn = screen.getByText('Common.cancel')
    fireEvent.click(cancelBtn)
    expect(mockCancel).toHaveBeenCalledTimes(1)
  })

  it('calculates rate when dates, guest and room are selected', async () => {
    render(
      <BookingForm
        rooms={mockRooms}
        guests={mockGuests}
        services={mockServices}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    )

    // Select guest via command item click
    const guestItems = screen.getAllByTestId('mock-command-item')
    fireEvent.click(guestItems[0]) // Selects guest 10 (John Doe)

    // Select room
    const selects = screen.getAllByTestId('mock-select')
    fireEvent.change(selects[0], { target: { value: '1' } }) // Select room ID 1

    // Fill dates
    const checkInInput = screen.getByLabelText(/checkInDate/)
    const checkOutInput = screen.getByLabelText(/checkOutDate/)

    fireEvent.change(checkInInput, { target: { value: '2026-07-01' } })
    fireEvent.change(checkOutInput, { target: { value: '2026-07-03' } })

    await waitFor(() => {
      expect(mockCalculateRate).toHaveBeenCalledWith({
        room_id: 1,
        check_in: '2026-07-01',
        check_out: '2026-07-03',
        number_of_guests: 2,
        service_ids: [],
      })
    })
  })

  it('displays capacity warning if calculated response indicates capacity is exceeded', async () => {
    mockCalculateRate.mockResolvedValue({
      total_amount: 300,
      capacity_exceeded: true,
      max_capacity: 2,
    })

    render(
      <BookingForm
        rooms={mockRooms}
        guests={mockGuests}
        services={mockServices}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    )

    const guestItems = screen.getAllByTestId('mock-command-item')
    fireEvent.click(guestItems[0])

    const selects = screen.getAllByTestId('mock-select')
    fireEvent.change(selects[0], { target: { value: '1' } })

    const checkInInput = screen.getByLabelText(/checkInDate/)
    const checkOutInput = screen.getByLabelText(/checkOutDate/)
    fireEvent.change(checkInInput, { target: { value: '2026-07-01' } })
    fireEvent.change(checkOutInput, { target: { value: '2026-07-03' } })

    const guestsInput = screen.getByLabelText(/numberOfGuests/)
    fireEvent.change(guestsInput, { target: { value: '3' } })

    await waitFor(() => {
      expect(screen.getByTestId('mock-alert')).toBeInTheDocument()
      expect(screen.getByText('Bookings.form.capacityWarningTitle')).toBeInTheDocument()
    })
  })

  it('submits form with correct structure when validation passes', async () => {
    render(
      <BookingForm
        rooms={mockRooms}
        guests={mockGuests}
        services={mockServices}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    )

    const guestItems = screen.getAllByTestId('mock-command-item')
    fireEvent.click(guestItems[1]) // selects guest ID 11 (Jane Smith)

    const selects = screen.getAllByTestId('mock-select')
    fireEvent.change(selects[0], { target: { value: '2' } }) // select room 2

    const checkInInput = screen.getByLabelText(/checkInDate/)
    const checkOutInput = screen.getByLabelText(/checkOutDate/)
    fireEvent.change(checkInInput, { target: { value: '2026-07-10' } })
    fireEvent.change(checkOutInput, { target: { value: '2026-07-15' } })

    const submitBtn = screen.getByText('Bookings.createBooking')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        guest_id: 11,
        room_id: 2,
        check_in: '2026-07-10',
        check_out: '2026-07-15',
        number_of_guests: 2,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'cash',
        notes: '',
        services: [],
      })
    })
  })
})

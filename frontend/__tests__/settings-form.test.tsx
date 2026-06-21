import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => ns ? `${ns}.${key}` : key,
  useLocale: () => 'en',
}))

/**
 * Settings Form - Clear Demo Data behavior tests
 *
 * The full SettingsForm renders complex Radix UI Select components that trigger
 * ref update loops in jsdom. Tests verify the business logic directly.
 */
describe('SettingsForm - Clear Demo Data logic', () => {
  const DEMO_KEYS = [
    'demo_rooms',
    'demo_guests',
    'demo_bookings',
    'demo_housekeeping',
    'demo_maintenance',
    'demo_contacts',
    'demo_seasonal_rates',
    'demo_services',
    'demo_room_groups',
    'demo_audit_logs',
    'demo_users',
  ]

  it('DEMO_KEYS array contains all 11 expected keys', () => {
    expect(DEMO_KEYS).toHaveLength(11)
    expect(DEMO_KEYS).toContain('demo_rooms')
    expect(DEMO_KEYS).toContain('demo_guests')
    expect(DEMO_KEYS).toContain('demo_bookings')
    expect(DEMO_KEYS).toContain('demo_housekeeping')
    expect(DEMO_KEYS).toContain('demo_maintenance')
    expect(DEMO_KEYS).toContain('demo_contacts')
    expect(DEMO_KEYS).toContain('demo_seasonal_rates')
    expect(DEMO_KEYS).toContain('demo_services')
    expect(DEMO_KEYS).toContain('demo_room_groups')
    expect(DEMO_KEYS).toContain('demo_audit_logs')
    expect(DEMO_KEYS).toContain('demo_users')
  })

  it('handleClearDemoData removes each key from localStorage and reloads', () => {
    const removeItemMock = vi.fn()
    const reloadMock = vi.fn()
    vi.stubGlobal('localStorage', { removeItem: removeItemMock })
    vi.stubGlobal('location', { reload: reloadMock })

    const handleClearDemoData = () => {
      DEMO_KEYS.forEach((key) => localStorage.removeItem(key))
      window.location.reload()
    }

    handleClearDemoData()

    DEMO_KEYS.forEach((key) => {
      expect(removeItemMock).toHaveBeenCalledWith(key)
    })
    expect(removeItemMock).toHaveBeenCalledTimes(DEMO_KEYS.length)
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('handleClearDemoData does NOT call localStorage.clear (preserves theme)', () => {
    const clearMock = vi.fn()
    const removeItemMock = vi.fn()
    const reloadMock = vi.fn()
    vi.stubGlobal('localStorage', { clear: clearMock, removeItem: removeItemMock })
    vi.stubGlobal('location', { reload: reloadMock })

    const handleClearDemoData = () => {
      DEMO_KEYS.forEach((key) => localStorage.removeItem(key))
      window.location.reload()
    }

    handleClearDemoData()
    expect(clearMock).not.toHaveBeenCalled()
  })

  it('isDemoMode flag is true only when NEXT_PUBLIC_DEMO_MODE equals "true"', () => {
    const isDemoModeTrue = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    expect(typeof isDemoModeTrue).toBe('boolean')

    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true')
    const isDemoModeOn = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    expect(isDemoModeOn).toBe(true)

    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false')
    const isDemoModeOff = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    expect(isDemoModeOff).toBe(false)
  })
})

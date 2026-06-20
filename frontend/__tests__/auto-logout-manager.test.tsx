import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { AutoLogoutManager } from '../components/auto-logout-manager'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

const mockLogout = vi.fn()
let mockIsAuthenticated = true
let mockSettings = {
  autoLogoutEnabled: true,
  autoLogoutTimeout: 2, // 2 minutes
}

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated,
  }),
}))

vi.mock('@/lib/settings-context', () => ({
  useSettings: () => ({
    settings: mockSettings,
  }),
}))

describe('AutoLogoutManager Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockLogout.mockClear()
    mockIsAuthenticated = true
    mockSettings = {
      autoLogoutEnabled: true,
      autoLogoutTimeout: 2,
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('triggers logout after specified inactivity timeout', () => {
    render(<AutoLogoutManager />)
    
    // Fast-forward time (2 minutes = 120000ms)
    vi.advanceTimersByTime(120000)
    
    expect(mockLogout).toHaveBeenCalledWith('Auto-logout due to inactivity')
  })

  it('resets the timer when user activity occurs', () => {
    render(<AutoLogoutManager />)
    
    // Advance halfway
    vi.advanceTimersByTime(60000)
    expect(mockLogout).not.toHaveBeenCalled()
    
    // Trigger activity event
    fireEvent.mouseMove(window)
    
    // Advance another 90000ms (1.5 minutes)
    vi.advanceTimersByTime(90000)
    expect(mockLogout).not.toHaveBeenCalled()
    
    // Advance remaining time for the reset timer (30000ms more makes it 120000ms from activity)
    vi.advanceTimersByTime(30000)
    expect(mockLogout).toHaveBeenCalledWith('Auto-logout due to inactivity')
  })

  it('does not start timer if user is not authenticated', () => {
    mockIsAuthenticated = false
    render(<AutoLogoutManager />)
    
    vi.advanceTimersByTime(120000)
    expect(mockLogout).not.toHaveBeenCalled()
  })

  it('does not start timer if auto-logout is disabled', () => {
    mockSettings.autoLogoutEnabled = false
    render(<AutoLogoutManager />)
    
    vi.advanceTimersByTime(120000)
    expect(mockLogout).not.toHaveBeenCalled()
  })
})

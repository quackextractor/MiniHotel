import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppSidebar } from '../components/app-sidebar'
import { vi, describe, it, expect } from 'vitest'

const mockLogout = vi.fn()
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
    isAuthenticated: true,
  }),
}))

vi.mock('@/lib/settings-context', () => ({
  useSettings: () => ({
    settings: {
      autoLogoutEnabled: false,
      autoLogoutTimeout: 15,
      currency: 'USD',
    },
  }),
}))

vi.mock('@/components/ui/sidebar', () => {
  return {
    Sidebar: ({ children }: any) => <div data-testid="sidebar">{children}</div>,
    SidebarContent: ({ children }: any) => <div data-testid="sidebar-content">{children}</div>,
    SidebarGroup: ({ children }: any) => <div data-testid="sidebar-group">{children}</div>,
    SidebarGroupContent: ({ children }: any) => <div data-testid="sidebar-group-content">{children}</div>,
    SidebarGroupLabel: ({ children }: any) => <div data-testid="sidebar-group-label">{children}</div>,
    SidebarMenu: ({ children }: any) => <ul data-testid="sidebar-menu">{children}</ul>,
    SidebarMenuItem: ({ children }: any) => <li data-testid="sidebar-menu-item">{children}</li>,
    SidebarMenuButton: ({ children, onClick, asChild, ...props }: any) => (
      <button data-testid="sidebar-menu-button" onClick={onClick} {...props}>
        {children}
      </button>
    ),
    SidebarHeader: ({ children }: any) => <div data-testid="sidebar-header">{children}</div>,
    SidebarFooter: ({ children }: any) => <div data-testid="sidebar-footer">{children}</div>,
  }
})

describe('AppSidebar Component', () => {
  it('renders side navigation with translation-based names', () => {
    render(<AppSidebar />)
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByText('Navigation.minihotel')).toBeInTheDocument()
    expect(screen.getByText('Navigation.management')).toBeInTheDocument()
    
    // Check navigation menu items translations are rendered
    expect(screen.getByText('Navigation.dashboard')).toBeInTheDocument()
    expect(screen.getByText('Navigation.rooms')).toBeInTheDocument()
    expect(screen.getByText('Navigation.bookings')).toBeInTheDocument()
    expect(screen.getByText('Navigation.calendar')).toBeInTheDocument()
  })

  it('triggers logout function when logout button is clicked', () => {
    render(<AppSidebar />)
    
    const logoutBtn = screen.getByText('Navigation.logout')
    fireEvent.click(logoutBtn)
    
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})

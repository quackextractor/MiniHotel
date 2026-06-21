import { handleDemoFetch } from '../lib/local-db'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Local DB Auth Flow in handleDemoFetch', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return initialized: false when no users exist', async () => {
    const res = handleDemoFetch('/api/auth/status')
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.initialized).toBe(false)
  })

  it('should register a new user successfully', async () => {
    const res = handleDemoFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' })
    })
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.message).toBe('Registered successfully')

    // Now status should be initialized: true
    const statusRes = handleDemoFetch('/api/auth/status')
    const statusData = await statusRes.json()
    expect(statusData.initialized).toBe(true)
  })

  it('should fail registration if missing username or password', async () => {
    const res = handleDemoFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser' })
    })
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.message).toBe('Username and password required')
  })

  it('should fail registration if user already exists', async () => {
    // Register first user
    handleDemoFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' })
    })

    // Register second user with same username
    const res = handleDemoFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'different' })
    })
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.message).toBe('User already exists')
  })

  it('should fallback to admin login if no users exist', async () => {
    const res = handleDemoFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'any' })
    })
    const data = await res.json()
    expect(res.status).toBe(200)
    const tokenParts = data.token.split('.')
    expect(tokenParts.length).toBe(3)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
    expect(payload.username).toBe('admin')
    expect(payload.user_id).toBe(1)
    expect(data.username).toBe('admin')
  })

  it('should login with registered credentials', async () => {
    // Register first
    handleDemoFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'myuser', password: 'mypassword' })
    })

    // Login with correct credentials
    const res = handleDemoFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'myuser', password: 'mypassword' })
    })
    const data = await res.json()
    expect(res.status).toBe(200)
    const tokenParts = data.token.split('.')
    expect(tokenParts.length).toBe(3)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
    expect(payload.username).toBe('myuser')
    expect(payload.user_id).toBe(1)
    expect(data.username).toBe('myuser')

    // Login with wrong credentials
    const wrongRes = handleDemoFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'myuser', password: 'wrong' })
    })
    expect(wrongRes.status).toBe(401)
  })
})

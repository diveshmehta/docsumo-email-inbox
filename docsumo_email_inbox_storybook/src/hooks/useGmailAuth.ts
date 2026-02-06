/**
 * Gmail Authentication Hook
 * Handles OAuth flow and connection status
 */

import { useState, useEffect, useCallback } from 'react'

const API_BASE = 'http://localhost:3001'

export interface GmailUser {
  email: string
  name: string
  picture?: string
  connectedAt: string
}

export interface UseGmailAuthReturn {
  isConnected: boolean
  isLoading: boolean
  user: GmailUser | null
  error: string | null
  connect: () => void
  disconnect: () => Promise<void>
  checkStatus: () => Promise<void>
}

export function useGmailAuth(): UseGmailAuthReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<GmailUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get stored email from localStorage
  const getStoredEmail = () => localStorage.getItem('gmail_connected_email')
  const setStoredEmail = (email: string) => localStorage.setItem('gmail_connected_email', email)
  const clearStoredEmail = () => localStorage.removeItem('gmail_connected_email')

  // Check connection status
  const checkStatus = useCallback(async () => {
    const email = getStoredEmail()
    if (!email) {
      setIsLoading(false)
      setIsConnected(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/status?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.connected) {
        setIsConnected(true)
        setUser({
          email: data.email,
          name: data.name,
          picture: data.picture,
          connectedAt: data.connectedAt,
        })
      } else {
        setIsConnected(false)
        setUser(null)
        clearStoredEmail()
      }
    } catch (err) {
      console.error('Error checking auth status:', err)
      setError('Failed to check connection status')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle OAuth callback params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const connected = params.get('connected')
    const email = params.get('email')
    const errorParam = params.get('error')

    if (connected === 'true' && email) {
      setStoredEmail(email)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
      checkStatus()
    } else if (errorParam) {
      setError(`Authentication failed: ${errorParam}`)
      window.history.replaceState({}, document.title, window.location.pathname)
      setIsLoading(false)
    } else {
      checkStatus()
    }
  }, [checkStatus])

  // Start OAuth flow
  const connect = async () => {
    console.log('🔗 Starting Gmail OAuth flow...')
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📡 Fetching auth URL from:', `${API_BASE}/api/auth/google`)
      const response = await fetch(`${API_BASE}/api/auth/google`)
      const data = await response.json()
      console.log('📥 Response:', data)

      if (data.authUrl) {
        console.log('🚀 Redirecting to Google OAuth...')
        // Redirect to Google OAuth
        window.location.href = data.authUrl
      } else {
        throw new Error('Failed to get auth URL')
      }
    } catch (err) {
      console.error('❌ Error starting OAuth:', err)
      setError('Failed to start authentication')
      setIsLoading(false)
    }
  }

  // Disconnect account
  const disconnect = async () => {
    const email = getStoredEmail()
    if (!email) return

    try {
      setIsLoading(true)
      await fetch(`${API_BASE}/api/auth/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      clearStoredEmail()
      setIsConnected(false)
      setUser(null)
    } catch (err) {
      console.error('Error disconnecting:', err)
      setError('Failed to disconnect')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isConnected,
    isLoading,
    user,
    error,
    connect,
    disconnect,
    checkStatus,
  }
}

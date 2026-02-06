/**
 * Gmail Emails Hook
 * Fetches and manages emails from Gmail API
 */

import { useState, useCallback } from 'react'
import type { Email, DocumentType } from '@/data/mockEmails'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface UseGmailEmailsReturn {
  emails: Email[]
  isLoading: boolean
  isSyncing: boolean
  error: string | null
  lastSyncedAt: string | null
  syncEmails: (maxResults?: number) => Promise<void>
  getEmailsByClassification: (type: DocumentType | 'All') => Email[]
  getEmailThread: (threadId: string) => Email[]
  getCountByClassification: () => Record<string, number>
}

export function useGmailEmails(userEmail: string | null): UseGmailEmailsReturn {
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)

  // Sync emails from Gmail
  const syncEmails = useCallback(async (maxResults: number = 100) => {
    if (!userEmail) {
      setError('No email account connected')
      return
    }

    try {
      setIsSyncing(true)
      setError(null)

      const response = await fetch(
        `${API_BASE}/api/emails?email=${encodeURIComponent(userEmail)}&maxResults=${maxResults}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch emails: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Transform to our Email format
      const transformedEmails: Email[] = data.emails.map((email: any) => ({
        ...email,
        isThreadStarter: true,
        isAutoReply: false,
      }))

      setEmails(transformedEmails)
      setLastSyncedAt(data.syncedAt)
    } catch (err: any) {
      console.error('Error syncing emails:', err)
      setError(err.message || 'Failed to sync emails')
    } finally {
      setIsSyncing(false)
      setIsLoading(false)
    }
  }, [userEmail])

  // Filter emails by classification
  const getEmailsByClassification = useCallback((type: DocumentType | 'All'): Email[] => {
    if (type === 'All') return emails
    return emails.filter(email => email.classification?.documentType === type)
  }, [emails])

  // Get email thread
  const getEmailThread = useCallback((threadId: string): Email[] => {
    return emails.filter(email => email.threadId === threadId)
  }, [emails])

  // Get counts by classification
  const getCountByClassification = useCallback((): Record<string, number> => {
    const counts: Record<string, number> = {
      All: emails.length,
      BOL: 0,
      Tender: 0,
      LumperReceipt: 0,
      Other: 0,
      Unclassified: 0,
    }

    emails.forEach(email => {
      if (email.classification) {
        counts[email.classification.documentType] = (counts[email.classification.documentType] || 0) + 1
      } else {
        counts.Unclassified++
      }
    })

    return counts
  }, [emails])

  return {
    emails,
    isLoading,
    isSyncing,
    error,
    lastSyncedAt,
    syncEmails,
    getEmailsByClassification,
    getEmailThread,
    getCountByClassification,
  }
}

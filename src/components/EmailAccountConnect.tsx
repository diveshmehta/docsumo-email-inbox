import { useState } from 'react'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface EmailAccount {
  id: string
  email: string
  provider: 'gmail' | 'outlook' | 'imap'
  status: 'connected' | 'connecting' | 'disconnected' | 'error'
  lastSync?: Date
  emailCount?: number
}

interface EmailAccountConnectProps {
  onAccountConnected?: (account: EmailAccount) => void
}

export default function EmailAccountConnect({ onAccountConnected }: EmailAccountConnectProps) {
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [isConnecting, setIsConnecting] = useState(false)

  const handleGmailConnect = async () => {
    setIsConnecting(true)
    
    // Gmail OAuth flow simulation
    // In production, this would:
    // 1. Redirect to: https://accounts.google.com/o/oauth2/v2/auth
    // 2. User grants permissions (gmail.readonly scope)
    // 3. Receive authorization code via callback
    // 4. Exchange code for access_token and refresh_token
    // 5. Store tokens securely
    // 6. Use access_token to call Gmail API
    
    try {
      // Simulate OAuth redirect flow
      console.log('Initiating Gmail OAuth flow...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate getting user email from Gmail API
      // In production: const profile = await gmail.users.getProfile({ userId: 'me' })
      // const mockEmail = profile.data.emailAddress
      const mockEmail = 'user@gmail.com'
      
      const newAccount: EmailAccount = {
        id: `acc-${Date.now()}`,
        email: mockEmail,
        provider: 'gmail',
        status: 'connected',
        lastSync: new Date(),
        emailCount: 0
      }
      
      setAccounts([...accounts, newAccount])
      onAccountConnected?.(newAccount)
      
      // Simulate fetching emails from Gmail API
      // In production:
      // const messages = await gmail.users.messages.list({ 
      //   userId: 'me', 
      //   maxResults: 50,
      //   q: 'is:unread OR newer_than:7d'
      // })
      // Then fetch each message: await gmail.users.messages.get({ userId: 'me', id: message.id })
      setTimeout(() => {
        setAccounts(prev => prev.map(acc => 
          acc.id === newAccount.id 
            ? { ...acc, emailCount: 8, lastSync: new Date() }
            : acc
        ))
      }, 2000)
      
    } catch (error) {
      console.error('Failed to connect Gmail:', error)
      alert('Failed to connect Gmail account. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId))
  }

  return (
    <div className="space-y-4">
      {accounts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Email Account</CardTitle>
            <CardDescription>
              Link your email inbox to automatically process and classify incoming emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={handleGmailConnect}
                disabled={isConnecting}
                className="w-full"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Connect Gmail Account
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                We'll request permission to read your emails. Your credentials are stored securely.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{account.email}</p>
                        {account.status === 'connected' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      {account.emailCount !== undefined && (
                        <p className="text-sm text-gray-500">
                          {account.emailCount} emails synced
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnect(account.id)}
                  >
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

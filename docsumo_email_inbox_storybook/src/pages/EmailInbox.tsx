import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Mail,
  Paperclip,
  RefreshCw,
  Settings,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Bot,
  User,
  Archive,
  Trash2,
  Reply,
  X,
  Maximize2,
  Minimize2,
  Play,
  Columns,
  LogOut,
  Zap,
} from 'lucide-react'
import {
  Button,
  IconButton,
  Badge,
  ClassificationBadge,
  StatusBadge,
  SearchInput,
  Tabs,
  Tooltip,
  Banner,
  Checkbox,
} from '@/components/ui'
import {
  mockEmails,
  getEmailsByClassification as getMockEmailsByClassification,
  getEmailThread as getMockEmailThread,
  getCountByClassification as getMockCountByClassification,
  type Email,
  type DocumentType,
} from '@/data/mockEmails'
import { useGmailAuth } from '@/hooks/useGmailAuth'
import { useGmailEmails } from '@/hooks/useGmailEmails'
import { format, formatDistanceToNow } from 'date-fns'

// Column configuration
interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  width?: string
}

const defaultColumns: ColumnConfig[] = [
  { key: 'sender', label: 'Sender', visible: true, width: '180px' },
  { key: 'subject', label: 'Subject', visible: true },
  { key: 'classification', label: 'Classification', visible: true, width: '140px' },
  { key: 'workflow', label: 'Workflow', visible: true, width: '120px' },
  { key: 'case', label: 'Case', visible: true, width: '100px' },
  { key: 'attachments', label: 'Files', visible: true, width: '70px' },
  { key: 'date', label: 'Date', visible: true, width: '140px' },
]

export const EmailInbox: React.FC = () => {
  // Gmail Integration Hooks
  const gmailAuth = useGmailAuth()
  const gmailEmails = useGmailEmails(gmailAuth.user?.email || null)

  // State
  const [selectedTab, setSelectedTab] = useState<DocumentType | 'All'>('All')
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [panelWidth, setPanelWidth] = useState<'normal' | 'expanded' | 'full'>('expanded')
  const [showConnectBanner, setShowConnectBanner] = useState(true)
  const [checkedRows, setCheckedRows] = useState<string[]>([])
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns)
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [useMockData, setUseMockData] = useState(true) // Toggle for demo mode

  // Sync emails when connected
  // Auto-sync 10 emails when connected
  useEffect(() => {
    if (gmailAuth.isConnected && gmailAuth.user?.email && !gmailEmails.lastSyncedAt) {
      gmailEmails.syncEmails(10)
      setUseMockData(false)
      setShowConnectBanner(false)
    }
  }, [gmailAuth.isConnected, gmailAuth.user?.email])

  // Determine which data source to use
  const emails = useMockData ? mockEmails : gmailEmails.emails
  const getEmailsByClassification = useMockData ? getMockEmailsByClassification : gmailEmails.getEmailsByClassification
  const getEmailThread = useMockData ? getMockEmailThread : gmailEmails.getEmailThread
  const counts = useMockData ? getMockCountByClassification() : gmailEmails.getCountByClassification()

  // Computed
  const filteredEmails = getEmailsByClassification(selectedTab).filter(
    (email) =>
      !email.isAutoReply &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const selectedEmail = selectedEmailId
    ? emails.find((e) => e.id === selectedEmailId)
    : null
  const emailThread = selectedEmail
    ? getEmailThread(selectedEmail.threadId)
    : []

  // Panel width classes
  const panelWidthClasses = {
    normal: 'w-[480px]',
    expanded: 'w-[720px]',
    full: 'w-[900px]',
  }

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      const currentIndex = selectedEmailId
        ? filteredEmails.findIndex((e) => e.id === selectedEmailId)
        : -1

      switch (e.key) {
        case 'j':
          if (currentIndex < filteredEmails.length - 1) {
            setSelectedEmailId(filteredEmails[currentIndex + 1].id)
          }
          break
        case 'k':
          if (currentIndex > 0) {
            setSelectedEmailId(filteredEmails[currentIndex - 1].id)
          }
          break
        case 'Escape':
          setSelectedEmailId(null)
          break
        case '/':
          e.preventDefault()
          document.querySelector<HTMLInputElement>('[data-search-input]')?.focus()
          break
      }
    },
    [selectedEmailId, filteredEmails]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true)
    if (gmailAuth.isConnected && !useMockData) {
      await gmailEmails.syncEmails(10)
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    setIsRefreshing(false)
  }

  const handleConnectGmail = () => {
    console.log('🔘 Connect Gmail button clicked!')
    gmailAuth.connect()
  }

  const handleDisconnect = async () => {
    await gmailAuth.disconnect()
    setUseMockData(true)
    setShowConnectBanner(true)
  }

  const handleSwitchToLiveData = () => {
    if (gmailAuth.isConnected) {
      setUseMockData(false)
      gmailEmails.syncEmails(10)
    }
  }

  const handleSwitchToMockData = () => {
    setUseMockData(true)
  }

  const toggleColumn = (key: string) => {
    setColumns(cols =>
      cols.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    )
  }

  const cyclePanelWidth = () => {
    setPanelWidth(current => {
      if (current === 'normal') return 'expanded'
      if (current === 'expanded') return 'full'
      return 'normal'
    })
  }

  // Tabs configuration
  const tabs = [
    { id: 'All', label: 'All Emails', count: counts.All },
    { id: 'BOL', label: 'Bill of Lading', count: counts.BOL },
    { id: 'Tender', label: 'Tender', count: counts.Tender },
    { id: 'LumperReceipt', label: 'Lumper Receipt', count: counts.LumperReceipt },
    { id: 'Other', label: 'Other', count: counts.Other + counts.Unclassified },
  ]

  const visibleColumns = columns.filter(col => col.visible)

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900">Email Inbox</h1>
            </div>
            <Badge variant="info" size="sm">
              {counts.All} emails
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-search-input
              placeholder="Search emails... (press /)"
            />
            
            {/* Column Picker */}
            <div className="relative">
              <Tooltip content="Choose columns">
                <IconButton
                  icon={<Columns />}
                  onClick={() => setShowColumnPicker(!showColumnPicker)}
                  variant={showColumnPicker ? 'outlined' : 'text'}
                />
              </Tooltip>
              {showColumnPicker && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 py-2">
                  <p className="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase">
                    Visible Columns
                  </p>
                  {columns.map(col => (
                    <button
                      key={col.key}
                      onClick={() => toggleColumn(col.key)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                      <Checkbox checked={col.visible} onChange={() => toggleColumn(col.key)} />
                      <span>{col.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Tooltip content="Refresh inbox">
              <IconButton
                icon={<RefreshCw className={cn(isRefreshing && 'animate-spin')} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
              />
            </Tooltip>
            <Tooltip content="Settings">
              <IconButton icon={<Settings />} />
            </Tooltip>

            {/* Connect Gmail Button - Always visible when not connected */}
            {!gmailAuth.isConnected && (
              <Button
                variant="contained"
                size="sm"
                leftIcon={<Mail className="w-4 h-4" />}
                onClick={handleConnectGmail}
                disabled={gmailAuth.isLoading}
              >
                {gmailAuth.isLoading ? 'Connecting...' : 'Connect Gmail'}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Connect Email Banner */}
      {showConnectBanner && !gmailAuth.isConnected && (
        <div className="flex-shrink-0 px-6 pt-4">
          <Banner
            type="info"
            title="Connect your Gmail"
            message="Link your Gmail account to sync and automatically classify your last 100 emails."
            onClose={() => setShowConnectBanner(false)}
            action={{
              label: 'Connect Gmail',
              onClick: handleConnectGmail,
            }}
          />
        </div>
      )}

      {/* Auth Error Banner */}
      {gmailAuth.error && (
        <div className="flex-shrink-0 px-6 pt-4">
          <Banner
            type="error"
            title="Authentication Error"
            message={gmailAuth.error}
            onClose={() => {}}
          />
        </div>
      )}

      {/* Syncing Banner */}
      {gmailEmails.isSyncing && (
        <div className="flex-shrink-0 px-6 pt-4">
          <Banner
            type="info"
            title="Syncing emails..."
            message="Fetching and classifying your last 100 emails from Gmail. This may take a moment."
          />
        </div>
      )}

      {/* Connected Account Bar */}
      {gmailAuth.isConnected && gmailAuth.user && (
        <div className="flex-shrink-0 px-6 pt-4">
          <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              {gmailAuth.user.picture ? (
                <img
                  src={gmailAuth.user.picture}
                  alt={gmailAuth.user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-neutral-900">{gmailAuth.user.name}</p>
                <p className="text-xs text-neutral-500">{gmailAuth.user.email}</p>
              </div>
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Connected
              </Badge>
              {gmailEmails.lastSyncedAt && (
                <span className="text-xs text-neutral-400">
                  Last synced: {formatDistanceToNow(new Date(gmailEmails.lastSyncedAt), { addSuffix: true })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Data Source Toggle */}
              <div className="flex items-center gap-2 mr-4">
                <button
                  onClick={handleSwitchToMockData}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    useMockData
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-500 hover:bg-neutral-100'
                  )}
                >
                  Demo Data
                </button>
                <button
                  onClick={handleSwitchToLiveData}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    !useMockData
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-500 hover:bg-neutral-100'
                  )}
                >
                  <Zap className="w-3 h-3 inline mr-1" />
                  Live Gmail
                </button>
              </div>
              <Tooltip content="Sync emails">
                <IconButton
                  icon={<RefreshCw className={cn(gmailEmails.isSyncing && 'animate-spin')} />}
                  onClick={() => gmailEmails.syncEmails(10)}
                  disabled={gmailEmails.isSyncing}
                  size="sm"
                />
              </Tooltip>
              <Tooltip content="Disconnect">
                <IconButton
                  icon={<LogOut />}
                  onClick={handleDisconnect}
                  size="sm"
                />
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex-shrink-0 px-6 pt-4 bg-white border-b border-neutral-200">
        <Tabs
          tabs={tabs.map((t) => ({
            id: t.id,
            label: t.label,
            count: t.count,
          }))}
          activeTab={selectedTab}
          onChange={(id) => setSelectedTab(id as DocumentType | 'All')}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email Table */}
        <div className={cn(
          'flex-1 bg-white overflow-hidden flex flex-col transition-all duration-300',
          selectedEmailId && 'border-r border-neutral-200'
        )}>
          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-neutral-50 z-10">
                <tr className="border-b border-neutral-200">
                  <th className="w-12 px-4 py-3 text-left">
                    <Checkbox
                      checked={checkedRows.length === filteredEmails.length && filteredEmails.length > 0}
                      indeterminate={checkedRows.length > 0 && checkedRows.length < filteredEmails.length}
                      onChange={() => {
                        if (checkedRows.length === filteredEmails.length) {
                          setCheckedRows([])
                        } else {
                          setCheckedRows(filteredEmails.map(e => e.id))
                        }
                      }}
                    />
                  </th>
                  {visibleColumns.map(col => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider"
                      style={{ width: col.width }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 1}
                      className="px-4 py-16 text-center"
                    >
                      <div className="flex flex-col items-center text-neutral-500">
                        <Mail className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-sm">No emails found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmails.map((email) => (
                    <EmailTableRow
                      key={email.id}
                      email={email}
                      isSelected={selectedEmailId === email.id}
                      isChecked={checkedRows.includes(email.id)}
                      visibleColumns={visibleColumns}
                      onSelect={() => {
                      setSelectedEmailId(email.id)
                      setPanelWidth('expanded')
                    }}
                      onCheck={() => {
                        setCheckedRows(prev =>
                          prev.includes(email.id)
                            ? prev.filter(id => id !== email.id)
                            : [...prev, email.id]
                        )
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bulk Actions Bar */}
          {checkedRows.length > 0 && (
            <div className="flex-shrink-0 px-4 py-3 bg-primary-50 border-t border-primary-200 flex items-center gap-4">
              <span className="text-sm font-medium text-primary-700">
                {checkedRows.length} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" leftIcon={<Archive className="w-4 h-4" />}>
                  Archive
                </Button>
                <Button variant="ghost" size="sm" color="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </Button>
              </div>
              <button
                onClick={() => setCheckedRows([])}
                className="ml-auto text-sm text-primary-600 hover:underline"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {/* Side Panel - Email Detail */}
        {selectedEmail && (
          <div
            className={cn(
              'flex-shrink-0 bg-white border-l border-neutral-200 flex flex-col transition-all duration-300 animate-slide-in-right',
              panelWidthClasses[panelWidth]
            )}
          >
            <EmailDetailPanel
              email={selectedEmail}
              thread={emailThread}
              panelWidth={panelWidth}
              onClose={() => setSelectedEmailId(null)}
              onToggleWidth={cyclePanelWidth}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Email Table Row Component
interface EmailTableRowProps {
  email: Email
  isSelected: boolean
  isChecked: boolean
  visibleColumns: ColumnConfig[]
  onSelect: () => void
  onCheck: () => void
}

const EmailTableRow: React.FC<EmailTableRowProps> = ({
  email,
  isSelected,
  isChecked,
  visibleColumns,
  onSelect,
  onCheck,
}) => {
  const isUnread = email.status === 'unread'

  const renderCell = (key: string) => {
    switch (key) {
      case 'sender':
        return (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium',
                isUnread ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'
              )}
            >
              {email.from.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className={cn('text-sm truncate', isUnread && 'font-semibold')}>
                {email.from.name}
              </p>
              <p className="text-xs text-neutral-400 truncate">{email.from.email}</p>
            </div>
          </div>
        )
      case 'subject':
        return (
          <div className="min-w-0">
            <p className={cn('text-sm truncate', isUnread && 'font-semibold')}>
              {email.subject}
            </p>
            <p className="text-xs text-neutral-400 truncate">{email.body.text.slice(0, 60)}...</p>
          </div>
        )
      case 'classification':
        return email.classification ? (
          <ClassificationBadge type={email.classification.documentType} size="sm" />
        ) : (
          <Badge variant="default" size="sm">
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
            Pending
          </Badge>
        )
      case 'workflow':
        return email.workflow ? (
          <StatusBadge status={email.workflow.status} size="sm" />
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        )
      case 'case':
        return email.case ? (
          <Badge variant="success" size="sm">
            {email.case.id}
          </Badge>
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        )
      case 'attachments':
        return email.attachments.length > 0 ? (
          <div className="flex items-center gap-1 text-neutral-500">
            <Paperclip className="w-4 h-4" />
            <span className="text-sm">{email.attachments.length}</span>
          </div>
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        )
      case 'date':
        return (
          <div className="text-right">
            <p className="text-sm text-neutral-700">
              {format(new Date(email.receivedAt), 'MMM d')}
            </p>
            <p className="text-xs text-neutral-400">
              {format(new Date(email.receivedAt), 'h:mm a')}
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <tr
      onClick={onSelect}
      className={cn(
        'border-b border-neutral-100 cursor-pointer transition-colors',
        isSelected ? 'bg-primary-50' : 'hover:bg-neutral-50',
        isChecked && !isSelected && 'bg-blue-50/50',
        isUnread && 'bg-blue-50/30'
      )}
    >
      <td className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isChecked} onChange={onCheck} />
      </td>
      {visibleColumns.map(col => (
        <td key={col.key} className="px-4 py-3">
          {renderCell(col.key)}
        </td>
      ))}
    </tr>
  )
}

// Email Detail Panel Component
interface EmailDetailPanelProps {
  email: Email
  thread: Email[]
  panelWidth: 'normal' | 'expanded' | 'full'
  onClose: () => void
  onToggleWidth: () => void
}

const EmailDetailPanel: React.FC<EmailDetailPanelProps> = ({
  email,
  thread,
  panelWidth,
  onClose,
  onToggleWidth,
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'data' | 'workflow'>('email')

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="flex-shrink-0 p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {email.classification && (
              <ClassificationBadge type={email.classification.documentType} />
            )}
            {email.workflow && (
              <StatusBadge status={email.workflow.status} />
            )}
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content={panelWidth === 'full' ? 'Collapse' : 'Expand'}>
              <IconButton
                icon={panelWidth === 'full' ? <Minimize2 /> : <Maximize2 />}
                size="sm"
                onClick={onToggleWidth}
              />
            </Tooltip>
            <IconButton icon={<X />} size="sm" onClick={onClose} />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">{email.subject}</h2>
        <p className="text-sm text-neutral-500">
          From {email.from.name} • {format(new Date(email.receivedAt), 'MMM d, yyyy h:mm a')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-neutral-200 flex items-center gap-2">
        <Button variant="ghost" size="sm" leftIcon={<Reply className="w-4 h-4" />}>
          Reply
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<Archive className="w-4 h-4" />}>
          Archive
        </Button>
        {email.case && (
          <Button
            variant="outlined"
            size="sm"
            leftIcon={<ExternalLink className="w-4 h-4" />}
          >
            View Case
          </Button>
        )}
        <Button variant="ghost" size="sm" color="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
          Delete
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 px-4 border-b border-neutral-200">
        <Tabs
          tabs={[
            { id: 'email', label: 'Email Thread' },
            { id: 'data', label: 'Extracted Data' },
            { id: 'workflow', label: 'Workflow' },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as 'email' | 'data' | 'workflow')}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'email' && (
          <EmailThreadView thread={thread} />
        )}
        {activeTab === 'data' && (
          <ExtractedDataView email={email} />
        )}
        {activeTab === 'workflow' && (
          <WorkflowView email={email} />
        )}
      </div>
    </div>
  )
}

// Email Thread View
const EmailThreadView: React.FC<{ thread: Email[] }> = ({ thread }) => {
  return (
    <div className="p-4 space-y-4">
      {thread.map((email) => (
        <div
          key={email.id}
          className={cn(
            'rounded-lg border p-4',
            email.isAutoReply
              ? 'bg-primary-50/50 border-primary-200'
              : 'bg-white border-neutral-200'
          )}
        >
          {/* Email Header */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                email.isAutoReply ? 'bg-primary-100' : 'bg-neutral-100'
              )}
            >
              {email.isAutoReply ? (
                <Bot className="w-5 h-5 text-primary-600" />
              ) : (
                <User className="w-5 h-5 text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-900">{email.from.name}</span>
                {email.isAutoReply && (
                  <Badge variant="info" size="sm">Auto-Reply</Badge>
                )}
              </div>
              <p className="text-sm text-neutral-500">{email.from.email}</p>
            </div>
            <span className="text-xs text-neutral-400">
              {format(new Date(email.receivedAt), 'h:mm a')}
            </span>
          </div>

          {/* Email Body */}
          <div
            className="prose prose-sm max-w-none text-neutral-700"
            dangerouslySetInnerHTML={{ __html: email.body.html }}
          />

          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-xs font-medium text-neutral-500 mb-2">
                Attachments ({email.attachments.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-md border border-neutral-200 text-sm"
                  >
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">{attachment.filename}</span>
                    <span className="text-neutral-400 text-xs">
                      ({Math.round(attachment.size / 1024)}KB)
                    </span>
                    {attachment.documentType && (
                      <ClassificationBadge type={attachment.documentType} size="sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Extracted Data View
const ExtractedDataView: React.FC<{ email: Email }> = ({ email }) => {
  if (!email.extractedData || email.extractedData.length === 0) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
        <p className="text-neutral-500">No extracted data available</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Classification Info */}
      {email.classification && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">Classification</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-500 mb-1">Document Type</p>
              <ClassificationBadge type={email.classification.documentType} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-500 rounded-full"
                    style={{ width: `${email.classification.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.round(email.classification.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Fields */}
      <h4 className="text-sm font-semibold text-neutral-700 mb-3">Extracted Fields</h4>
      <div className="space-y-2">
        {email.extractedData.map((field) => (
          <div
            key={field.key}
            className="flex items-start justify-between py-3 px-4 bg-white border border-neutral-200 rounded-lg"
          >
            <div>
              <p className="text-xs text-neutral-500 mb-0.5">{field.label}</p>
              <p className="text-sm font-medium text-neutral-900">{field.value}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400">
                {Math.round(field.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Workflow View
const WorkflowView: React.FC<{ email: Email }> = ({ email }) => {
  if (!email.workflow) {
    return (
      <div className="p-8 text-center">
        <Clock className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
        <p className="text-neutral-500">No workflow triggered yet</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Workflow Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-neutral-50 rounded-lg">
        <div>
          <h4 className="font-semibold text-neutral-900">{email.workflow.workflowName}</h4>
          <p className="text-sm text-neutral-500">
            Started {formatDistanceToNow(new Date(email.workflow.startedAt), { addSuffix: true })}
          </p>
        </div>
        <StatusBadge status={email.workflow.status} />
      </div>

      {/* Linked Case */}
      {email.case && (
        <div className="mb-6 p-4 border border-success-200 bg-success-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-success-600 font-medium mb-1">Case Created</p>
              <p className="text-sm font-semibold text-neutral-900">{email.case.title}</p>
              <p className="text-xs text-neutral-500 mt-1">ID: {email.case.id}</p>
            </div>
            <Button variant="outlined" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
              View Case
            </Button>
          </div>
        </div>
      )}

      {/* Actions Timeline */}
      <h4 className="text-sm font-semibold text-neutral-700 mb-4">Execution Steps</h4>
      <div className="relative pl-8 space-y-4">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-neutral-200" />
        {email.workflow.actions.map((action) => (
          <div key={action.id} className="relative">
            <div
              className={cn(
                'absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center',
                action.status === 'completed' && 'bg-success-500',
                action.status === 'in_progress' && 'bg-primary-500',
                action.status === 'pending' && 'bg-neutral-300',
                action.status === 'failed' && 'bg-error-500'
              )}
            >
              {action.status === 'completed' && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
              {action.status === 'in_progress' && (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              )}
              {action.status === 'pending' && (
                <Clock className="w-3 h-3 text-white" />
              )}
              {action.status === 'failed' && (
                <AlertCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-neutral-800">{action.description}</p>
                <StatusBadge status={action.status} size="sm" />
              </div>
              {action.completedAt && (
                <p className="text-xs text-neutral-400">
                  Completed at {format(new Date(action.completedAt), 'h:mm:ss a')}
                </p>
              )}
              {action.error && (
                <p className="text-xs text-error-500 mt-1 p-2 bg-error-50 rounded">
                  {action.error}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Retry Button */}
      {email.workflow.status === 'failed' && (
        <div className="mt-6">
          <Button
            variant="outlined"
            size="sm"
            leftIcon={<Play className="w-4 h-4" />}
            className="w-full"
          >
            Retry Workflow
          </Button>
        </div>
      )}
    </div>
  )
}

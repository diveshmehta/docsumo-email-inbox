import { useState, useEffect } from 'react'
import { 
  Mail, Search, Clock, CheckCircle2, AlertCircle, Loader2, 
  FileText, ExternalLink, Download, X, Settings,
  Paperclip, Reply, Archive, Trash2, Bot, User,
  Columns, Maximize2, Minimize2
} from 'lucide-react'
import { useEmailData, DocumentType, WorkflowStatus, Email, EmailThread } from '@/hooks/useEmailData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDistanceToNow, format } from 'date-fns'
import clsx from 'clsx'
import EmailAccountConnect from '@/components/EmailAccountConnect'

const documentTypeColors: Record<DocumentType, string> = {
  BOL: 'bg-blue-100 text-blue-800 border-blue-200',
  Tender: 'bg-purple-100 text-purple-800 border-purple-200',
  LumperReceipt: 'bg-green-100 text-green-800 border-green-200',
  Other: 'bg-gray-100 text-gray-700 border-gray-200',
}

const workflowStatusConfig: Record<WorkflowStatus, { bg: string; text: string; icon: any; label: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock, label: 'Pending' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Loader2, label: 'Processing' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2, label: 'Completed' },
  failed: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Failed' },
}

// Column definitions for different document types
type ColumnId = 'status' | 'sender' | 'subject' | 'body' | 'cc' | 'classification' | 'extraction' | 'workflow' | 'case' | 'time' |
  // BOL specific columns
  'bol_carrier' | 'bol_origin' | 'bol_destination' | 'bol_weight' | 'bol_number' | 'bol_shipmentDate' |
  // Tender specific columns
  'tender_id' | 'tender_vendor' | 'tender_value' | 'tender_category' | 'tender_validity' |
  // Lumper specific columns
  'lumper_location' | 'lumper_amount' | 'lumper_dock' | 'lumper_services'

interface ColumnDef {
  id: ColumnId
  label: string
  minWidth: string
  category: 'common' | 'BOL' | 'Tender' | 'LumperReceipt'
  defaultVisible: boolean
}

const allColumns: ColumnDef[] = [
  // Common columns
  { id: 'status', label: '', minWidth: '48px', category: 'common', defaultVisible: true },
  { id: 'sender', label: 'Sender', minWidth: '180px', category: 'common', defaultVisible: true },
  { id: 'subject', label: 'Subject', minWidth: '200px', category: 'common', defaultVisible: true },
  { id: 'body', label: 'Body Preview', minWidth: '150px', category: 'common', defaultVisible: false },
  { id: 'cc', label: 'CC', minWidth: '120px', category: 'common', defaultVisible: true },
  { id: 'classification', label: 'Classification', minWidth: '100px', category: 'common', defaultVisible: true },
  { id: 'extraction', label: 'Extraction', minWidth: '100px', category: 'common', defaultVisible: true },
  { id: 'workflow', label: 'Workflow', minWidth: '120px', category: 'common', defaultVisible: true },
  { id: 'case', label: 'Case', minWidth: '100px', category: 'common', defaultVisible: true },
  { id: 'time', label: 'Time', minWidth: '100px', category: 'common', defaultVisible: true },
  // BOL specific columns
  { id: 'bol_carrier', label: 'Carrier', minWidth: '140px', category: 'BOL', defaultVisible: false },
  { id: 'bol_origin', label: 'Origin', minWidth: '140px', category: 'BOL', defaultVisible: false },
  { id: 'bol_destination', label: 'Destination', minWidth: '140px', category: 'BOL', defaultVisible: false },
  { id: 'bol_weight', label: 'Weight', minWidth: '100px', category: 'BOL', defaultVisible: false },
  { id: 'bol_number', label: 'BOL #', minWidth: '120px', category: 'BOL', defaultVisible: false },
  { id: 'bol_shipmentDate', label: 'Ship Date', minWidth: '100px', category: 'BOL', defaultVisible: false },
  // Tender specific columns
  { id: 'tender_id', label: 'Tender ID', minWidth: '120px', category: 'Tender', defaultVisible: false },
  { id: 'tender_vendor', label: 'Vendor', minWidth: '140px', category: 'Tender', defaultVisible: false },
  { id: 'tender_value', label: 'Value', minWidth: '100px', category: 'Tender', defaultVisible: false },
  { id: 'tender_category', label: 'Category', minWidth: '120px', category: 'Tender', defaultVisible: false },
  { id: 'tender_validity', label: 'Validity', minWidth: '100px', category: 'Tender', defaultVisible: false },
  // Lumper specific columns
  { id: 'lumper_location', label: 'Location', minWidth: '140px', category: 'LumperReceipt', defaultVisible: false },
  { id: 'lumper_amount', label: 'Amount', minWidth: '100px', category: 'LumperReceipt', defaultVisible: false },
  { id: 'lumper_dock', label: 'Dock', minWidth: '80px', category: 'LumperReceipt', defaultVisible: false },
  { id: 'lumper_services', label: 'Services', minWidth: '140px', category: 'LumperReceipt', defaultVisible: false },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Get extraction status from email
function getExtractionStatus(email: Email): { status: string; count: number } {
  if (!email.extractedData || Object.keys(email.extractedData).length === 0) {
    return { status: 'none', count: 0 }
  }
  return { status: 'extracted', count: Object.keys(email.extractedData).length }
}

// Get workflow status summary
function getWorkflowSummary(email: Email): { status: WorkflowStatus; name: string } | null {
  if (!email.workflows || email.workflows.length === 0) {
    return null
  }
  const workflow = email.workflows[0]
  return { status: workflow.status, name: workflow.workflowName }
}

// Get extracted field value
function getExtractedField(email: Email, fieldName: string): string | null {
  if (!email.extractedData) return null
  return email.extractedData[fieldName] || null
}

export default function EmailInbox() {
  const { 
    threads, 
    selectedEmail, 
    setSelectedEmail, 
    selectedThread,
    setSelectedThread,
    getThreadEmails,
    filter, 
    setFilter, 
    markAsRead, 
    stats 
  } = useEmailData()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [connectedAccount, setConnectedAccount] = useState<any>(null)
  const [showAccountConnect, setShowAccountConnect] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)
  const [selectedThreadData, setSelectedThreadData] = useState<EmailThread | null>(null)
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnId>>(() => {
    const defaultVisible = allColumns.filter(c => c.defaultVisible).map(c => c.id)
    return new Set(defaultVisible)
  })
  const [showBodyModal, setShowBodyModal] = useState(false)
  const [bodyModalContent, setBodyModalContent] = useState<{ subject: string; body: string } | null>(null)
  const [activeDocType, setActiveDocType] = useState<DocumentType | 'all'>('all')

  // Update visible columns based on document type filter
  useEffect(() => {
    if (activeDocType === 'all') {
      // Show only common columns
      const commonCols = allColumns.filter(c => c.category === 'common' && c.defaultVisible).map(c => c.id)
      setVisibleColumns(new Set(commonCols))
    } else {
      // Show common columns + type-specific columns
      const commonCols = allColumns.filter(c => c.category === 'common' && c.defaultVisible).map(c => c.id)
      const typeCols = allColumns.filter(c => c.category === activeDocType).map(c => c.id)
      setVisibleColumns(new Set([...commonCols, ...typeCols]))
    }
  }, [activeDocType])

  // Open panel when thread is selected
  useEffect(() => {
    if (selectedThread) {
      const thread = threads.find(t => t.threadId === selectedThread)
      if (thread) {
        setSelectedThreadData(thread)
        setIsPanelOpen(true)
        // Mark first unread email as read
        const firstUnread = thread.emails.find(e => e.status === 'unread')
        if (firstUnread) {
          markAsRead(firstUnread.id)
        }
      }
    }
  }, [selectedThread, threads])

  // Close panel
  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setIsPanelExpanded(false)
    setSelectedThread(null)
    setSelectedThreadData(null)
    setSelectedEmail(null)
  }

  // Handle row click
  const handleRowClick = (thread: EmailThread) => {
    setSelectedThread(thread.threadId)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilter({ ...filter, search: query })
  }

  const handleFilterClassification = (type: DocumentType | 'all') => {
    setActiveDocType(type)
    if (type === 'all') {
      setFilter({ ...filter, classification: undefined })
    } else {
      setFilter({ ...filter, classification: type })
    }
  }

  const toggleColumn = (columnId: ColumnId) => {
    const newVisible = new Set(visibleColumns)
    if (newVisible.has(columnId)) {
      newVisible.delete(columnId)
    } else {
      newVisible.add(columnId)
    }
    setVisibleColumns(newVisible)
  }

  const handleBodyClick = (email: Email) => {
    setBodyModalContent({
      subject: email.subject,
      body: email.body.text
    })
    setShowBodyModal(true)
  }

  // Get visible column definitions
  const visibleColumnDefs = allColumns.filter(c => visibleColumns.has(c.id))

  // Get thread emails including workflow replies
  const threadEmails = selectedThreadData ? getThreadEmails(selectedThreadData.threadId) : []

  // Panel width based on expanded state
  const panelWidth = isPanelExpanded ? 'w-[800px]' : 'w-[480px]'

  // Render cell content based on column
  const renderCell = (column: ColumnDef, thread: EmailThread) => {
    const latestEmail = thread.latestEmail
    const extraction = getExtractionStatus(latestEmail)
    const workflow = getWorkflowSummary(latestEmail)
    const hasUnread = thread.unreadCount > 0

    switch (column.id) {
      case 'status':
        return (
          <div className="flex items-center gap-1">
            {hasUnread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
            {latestEmail.attachments.length > 0 && <Paperclip className="h-3.5 w-3.5 text-gray-400" />}
          </div>
        )
      
      case 'sender':
        return (
          <div className="flex items-center gap-2">
            <div className="min-w-0">
              <p className={clsx('text-sm truncate', hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>
                {latestEmail.from.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{latestEmail.from.email}</p>
            </div>
            {thread.totalEmails > 1 && (
              <Badge variant="secondary" className="text-xs shrink-0">{thread.totalEmails}</Badge>
            )}
          </div>
        )
      
      case 'subject':
        return (
          <p className={clsx('text-sm truncate', hasUnread ? 'font-semibold text-gray-900' : 'text-gray-700')}>
            {thread.subject}
          </p>
        )
      
      case 'body':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleBodyClick(latestEmail)
            }}
            className="text-xs text-gray-500 truncate max-w-[150px] hover:text-indigo-600 hover:underline text-left"
          >
            {latestEmail.body.text.substring(0, 50)}...
          </button>
        )
      
      case 'cc':
        return latestEmail.cc.length > 0 ? (
          <p className="text-xs text-gray-500 truncate">{latestEmail.cc.join(', ')}</p>
        ) : <span className="text-xs text-gray-300">—</span>
      
      case 'classification':
        return latestEmail.classification ? (
          <Badge variant="outline" className={clsx('text-xs font-medium', documentTypeColors[latestEmail.classification.documentType])}>
            {latestEmail.classification.documentType}
          </Badge>
        ) : <span className="text-xs text-gray-300">—</span>
      
      case 'extraction':
        return extraction.status === 'extracted' ? (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs text-gray-600">{extraction.count} fields</span>
          </div>
        ) : <span className="text-xs text-gray-300">—</span>
      
      case 'workflow':
        if (!workflow) return <span className="text-xs text-gray-300">—</span>
        const Icon = workflowStatusConfig[workflow.status].icon
        return (
          <div className={clsx(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
            workflowStatusConfig[workflow.status].bg,
            workflowStatusConfig[workflow.status].text
          )}>
            <Icon className={clsx('h-3 w-3', workflow.status === 'in_progress' && 'animate-spin')} />
            <span>{workflowStatusConfig[workflow.status].label}</span>
          </div>
        )
      
      case 'case':
        return latestEmail.caseId ? (
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-indigo-600">
            #{latestEmail.caseId.split('-').pop()}
          </Button>
        ) : <span className="text-xs text-gray-300">—</span>
      
      case 'time':
        return <span className="text-xs text-gray-500">{formatDistanceToNow(latestEmail.receivedAt, { addSuffix: true })}</span>
      
      // BOL specific
      case 'bol_carrier':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'carrier') || '—'}</span>
      case 'bol_origin':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'origin') || '—'}</span>
      case 'bol_destination':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'destination') || '—'}</span>
      case 'bol_weight':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'weight') || '—'}</span>
      case 'bol_number':
        return <span className="text-xs text-gray-700 font-mono">{getExtractedField(latestEmail, 'bolNumber') || '—'}</span>
      case 'bol_shipmentDate':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'shipmentDate') || '—'}</span>
      
      // Tender specific
      case 'tender_id':
        return <span className="text-xs text-gray-700 font-mono">{getExtractedField(latestEmail, 'tenderId') || '—'}</span>
      case 'tender_vendor':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'vendorName') || '—'}</span>
      case 'tender_value':
        return <span className="text-xs text-gray-700 font-medium">{getExtractedField(latestEmail, 'totalValue') || '—'}</span>
      case 'tender_category':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'category') || '—'}</span>
      case 'tender_validity':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'validityPeriod') || '—'}</span>
      
      // Lumper specific
      case 'lumper_location':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'warehouseLocation') || '—'}</span>
      case 'lumper_amount':
        return <span className="text-xs text-gray-700 font-medium">{getExtractedField(latestEmail, 'amount') || '—'}</span>
      case 'lumper_dock':
        return <span className="text-xs text-gray-700">{getExtractedField(latestEmail, 'dockNumber') || '—'}</span>
      case 'lumper_services':
        const services = getExtractedField(latestEmail, 'services')
        return <span className="text-xs text-gray-700">{Array.isArray(services) ? services.join(', ') : (services || '—')}</span>
      
      default:
        return <span className="text-xs text-gray-300">—</span>
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Mail className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Email Inbox</h1>
              <p className="text-sm text-gray-500">{stats.total} threads • {stats.unread} unread</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAccountConnect(!showAccountConnect)}
            className={connectedAccount ? 'border-green-300 text-green-700 bg-green-50' : ''}
          >
            {connectedAccount ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {connectedAccount.email}
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Connect Account
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Account Connect Modal */}
      <Dialog open={showAccountConnect} onOpenChange={setShowAccountConnect}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Email Account</DialogTitle>
          </DialogHeader>
          <EmailAccountConnect 
            onAccountConnected={(account) => {
              setConnectedAccount(account)
              setShowAccountConnect(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Body Preview Modal */}
      <Dialog open={showBodyModal} onOpenChange={setShowBodyModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{bodyModalContent?.subject}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="whitespace-pre-wrap text-sm text-gray-700 p-4 bg-gray-50 rounded-lg">
              {bodyModalContent?.body}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Column Picker */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                className="gap-2"
              >
                <Columns className="h-4 w-4" />
                Columns
              </Button>
              
              {showColumnPicker && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b">
                    <span className="text-sm font-medium text-gray-700">Show/Hide Columns</span>
                    <button 
                      onClick={() => setShowColumnPicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {/* Common Columns */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Common</p>
                      <div className="space-y-1">
                        {allColumns.filter(c => c.category === 'common' && c.id !== 'status').map(col => (
                          <label key={col.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleColumns.has(col.id)}
                              onChange={() => toggleColumn(col.id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* BOL Columns */}
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase mb-2">BOL Fields</p>
                      <div className="space-y-1">
                        {allColumns.filter(c => c.category === 'BOL').map(col => (
                          <label key={col.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleColumns.has(col.id)}
                              onChange={() => toggleColumn(col.id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tender Columns */}
                    <div>
                      <p className="text-xs font-semibold text-purple-600 uppercase mb-2">Tender Fields</p>
                      <div className="space-y-1">
                        {allColumns.filter(c => c.category === 'Tender').map(col => (
                          <label key={col.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleColumns.has(col.id)}
                              onChange={() => toggleColumn(col.id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Lumper Columns */}
                    <div>
                      <p className="text-xs font-semibold text-green-600 uppercase mb-2">Lumper Fields</p>
                      <div className="space-y-1">
                        {allColumns.filter(c => c.category === 'LumperReceipt').map(col => (
                          <label key={col.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={visibleColumns.has(col.id)}
                              onChange={() => toggleColumn(col.id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Document Type Tabs */}
            <Tabs value={activeDocType} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger 
                  value="all" 
                  onClick={() => handleFilterClassification('all')}
                  className="text-sm px-3"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="BOL" 
                  onClick={() => handleFilterClassification('BOL')}
                  className="text-sm px-3"
                >
                  BOL
                </TabsTrigger>
                <TabsTrigger 
                  value="Tender" 
                  onClick={() => handleFilterClassification('Tender')}
                  className="text-sm px-3"
                >
                  Tender
                </TabsTrigger>
                <TabsTrigger 
                  value="LumperReceipt" 
                  onClick={() => handleFilterClassification('LumperReceipt')}
                  className="text-sm px-3"
                >
                  Lumper
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email Table with scroll */}
        <div className={clsx(
          'flex-1 transition-all duration-300 ease-in-out overflow-hidden',
          isPanelOpen && !isPanelExpanded && 'mr-[480px]',
          isPanelOpen && isPanelExpanded && 'mr-[800px]'
        )}>
          <div className="h-full overflow-auto">
            <div className="min-w-max">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    {visibleColumnDefs.map(col => (
                      <th 
                        key={col.id}
                        className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                        style={{ minWidth: col.minWidth }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {threads.map((thread) => {
                    const isSelected = selectedThread === thread.threadId
                    const hasUnread = thread.unreadCount > 0

                    return (
                      <tr
                        key={thread.threadId}
                        onClick={() => handleRowClick(thread)}
                        className={clsx(
                          'cursor-pointer transition-colors',
                          isSelected ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : 'hover:bg-gray-50',
                          hasUnread && !isSelected && 'bg-blue-50/50'
                        )}
                      >
                        {visibleColumnDefs.map(col => (
                          <td key={col.id} className="py-3 px-4">
                            {renderCell(col, thread)}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {threads.length === 0 && (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No emails found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Slide-out Panel */}
        <div className={clsx(
          'fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl transform transition-all duration-300 ease-in-out z-50',
          panelWidth,
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          {selectedThreadData && (
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex-1 min-w-0 mr-4">
                  <h2 className="text-base font-semibold text-gray-900 truncate">
                    {selectedThreadData.subject}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedThreadData.totalEmails} message{selectedThreadData.totalEmails !== 1 ? 's' : ''} in thread
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                    title={isPanelExpanded ? 'Collapse panel' : 'Expand panel'}
                  >
                    {isPanelExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClosePanel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Thread Messages */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {threadEmails.map((email) => {
                    const isWorkflowReply = email.isWorkflowReply
                    const workflowStatus = email.workflows[0]?.status
                    const StatusIcon = workflowStatus ? workflowStatusConfig[workflowStatus].icon : null

                    return (
                      <div
                        key={email.id}
                        className={clsx(
                          'rounded-lg border overflow-hidden',
                          isWorkflowReply 
                            ? 'bg-indigo-50/50 border-indigo-200' 
                            : 'bg-white border-gray-200',
                          selectedEmail?.id === email.id && 'ring-2 ring-indigo-500'
                        )}
                        onClick={() => setSelectedEmail(email)}
                      >
                        {/* Email Header */}
                        <div className={clsx(
                          'px-4 py-3 border-b',
                          isWorkflowReply ? 'bg-indigo-100/50 border-indigo-200' : 'bg-gray-50 border-gray-100'
                        )}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={clsx(
                                'p-2 rounded-full shrink-0',
                                isWorkflowReply ? 'bg-indigo-200' : 'bg-gray-200'
                              )}>
                                {isWorkflowReply ? (
                                  <Bot className="h-4 w-4 text-indigo-700" />
                                ) : (
                                  <User className="h-4 w-4 text-gray-600" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-sm text-gray-900">{email.from.name}</p>
                                  {isWorkflowReply && (
                                    <Badge variant="outline" className="text-xs bg-indigo-100 text-indigo-700 border-indigo-300">
                                      Auto-Reply
                                    </Badge>
                                  )}
                                  {email.status === 'unread' && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{email.from.email}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {format(email.receivedAt, 'MMM d, yyyy • h:mm a')}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="shrink-0">
                              <Reply className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* To/CC */}
                          <div className="mt-2 text-xs text-gray-500">
                            <span>To: {email.to.join(', ')}</span>
                            {email.cc.length > 0 && (
                              <span className="ml-2">• CC: {email.cc.join(', ')}</span>
                            )}
                          </div>
                        </div>

                        {/* Classification & Status Tags */}
                        {(email.classification || email.workflows.length > 0 || email.caseId) && (
                          <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 flex-wrap">
                            {email.classification && (
                              <Badge
                                variant="outline"
                                className={clsx('text-xs', documentTypeColors[email.classification.documentType])}
                              >
                                {email.classification.documentType}
                                <span className="ml-1 opacity-70">
                                  {Math.round(email.classification.confidence * 100)}%
                                </span>
                              </Badge>
                            )}
                            {email.extractedData && Object.keys(email.extractedData).length > 0 && (
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {Object.keys(email.extractedData).length} fields extracted
                              </Badge>
                            )}
                            {email.caseId && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                Case #{email.caseId.split('-').pop()}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Email Body */}
                        <div className="px-4 py-3">
                          <div
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: email.body.html }}
                          />
                        </div>

                        {/* Attachments */}
                        {email.attachments.length > 0 && (
                          <div className="px-4 py-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 mb-2">Attachments</p>
                            <div className="space-y-1">
                              {email.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                                      <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Extracted Data */}
                        {email.extractedData && Object.keys(email.extractedData).length > 0 && (
                          <div className="px-4 py-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 mb-2">Extracted Data</p>
                            <div className={clsx(
                              'grid gap-2',
                              isPanelExpanded ? 'grid-cols-3' : 'grid-cols-2'
                            )}>
                              {Object.entries(email.extractedData).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 rounded p-2">
                                  <p className="text-xs text-gray-500 uppercase">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 truncate">{String(value)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Workflow Actions */}
                        {email.workflows.length > 0 && (
                          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-xs font-medium text-gray-500 mb-2">Workflow Actions</p>
                            {email.workflows.map((workflow) => (
                              <div key={workflow.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-700">{workflow.workflowName}</p>
                                  <div className={clsx(
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                                    workflowStatusConfig[workflow.status].bg,
                                    workflowStatusConfig[workflow.status].text
                                  )}>
                                    {StatusIcon && <StatusIcon className={clsx('h-3 w-3', workflow.status === 'in_progress' && 'animate-spin')} />}
                                    <span>{workflowStatusConfig[workflow.status].label}</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  {workflow.actions.map((action) => (
                                    <div key={action.id} className="flex items-center justify-between py-1 px-2 bg-white rounded border border-gray-100">
                                      <span className="text-xs text-gray-600 capitalize flex items-center gap-2">
                                        {action.type === 'reply' && <Reply className="h-3 w-3" />}
                                        {action.type === 'extract_data' && <FileText className="h-3 w-3" />}
                                        {action.type === 'create_case' && <ExternalLink className="h-3 w-3" />}
                                        {action.type.replace('_', ' ')}
                                      </span>
                                      <Badge
                                        variant={
                                          action.status === 'completed' ? 'default' :
                                          action.status === 'failed' ? 'destructive' :
                                          'secondary'
                                        }
                                        className="text-xs h-5"
                                      >
                                        {action.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                                {workflow.completedAt && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    Completed {formatDistanceToNow(workflow.completedAt, { addSuffix: true })}
                                  </p>
                                )}
                              </div>
                            ))}

                            {/* View Case Button */}
                            {email.caseId && (
                              <Button variant="outline" size="sm" className="w-full mt-3">
                                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                                View Case #{email.caseId.split('-').pop()}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Panel Footer */}
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <Button className="w-full" variant="outline">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply to Thread
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

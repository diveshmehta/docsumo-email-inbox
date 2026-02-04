import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Play,
  Download,
} from 'lucide-react'
import clsx from 'clsx'

interface CaseStatus {
  id: string
  status: 'passed' | 'failed' | 'pending' | 'warning'
  caseType: string
  documents: number
  extractedFields: number
  failedFields: number
  issues: Issue[]
  lastUpdated: string
}

interface Issue {
  type: 'missing-doc' | 'low-confidence' | 'validation-fail' | 'integration-error'
  severity: 'high' | 'medium' | 'low'
  message: string
  field?: string
  action: string
}

const mockCases: CaseStatus[] = [
  {
    id: 'CASE-001',
    status: 'failed',
    caseType: 'Loan Application',
    documents: 5,
    extractedFields: 23,
    failedFields: 3,
    issues: [
      {
        type: 'missing-doc',
        severity: 'high',
        message: 'Bank statement for last 3 months is missing',
        action: 'Contact borrower to provide missing document',
      },
      {
        type: 'low-confidence',
        severity: 'medium',
        message: 'Income field extracted with 65% confidence',
        field: 'monthly_income',
        action: 'Review and correct extraction',
      },
      {
        type: 'validation-fail',
        severity: 'high',
        message: 'Income-to-debt ratio exceeds threshold',
        action: 'Review financial calculations',
      },
    ],
    lastUpdated: '2 hours ago',
  },
  {
    id: 'CASE-002',
    status: 'warning',
    caseType: 'Loan Application',
    documents: 6,
    extractedFields: 25,
    failedFields: 1,
    issues: [
      {
        type: 'low-confidence',
        severity: 'medium',
        message: 'Employment date extracted with 72% confidence',
        field: 'employment_start_date',
        action: 'Verify with source document',
      },
    ],
    lastUpdated: '5 hours ago',
  },
  {
    id: 'CASE-003',
    status: 'passed',
    caseType: 'Loan Application',
    documents: 6,
    extractedFields: 25,
    failedFields: 0,
    issues: [],
    lastUpdated: '1 day ago',
  },
]

const statusConfig = {
  passed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  pending: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
}

export default function CaseEvaluation() {
  const [selectedCase, setSelectedCase] = useState<CaseStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCases = mockCases.filter((c) => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Case Evaluation</h1>
        <p className="mt-2 text-gray-600">
          Diagnose issues in specific cases and understand what's wrong
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cases by ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            {['all', 'passed', 'failed', 'warning', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredCases.map((caseItem) => {
            const config = statusConfig[caseItem.status]
            const StatusIcon = config.icon

            return (
              <div
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem)}
                className={clsx(
                  'bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-md',
                  selectedCase?.id === caseItem.id
                    ? `${config.border} ${config.bg}`
                    : 'border-gray-200'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusIcon className={config.color} size={24} />
                      <h3 className="text-lg font-semibold text-gray-900">{caseItem.id}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {caseItem.caseType}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <div className="text-gray-500">Documents</div>
                        <div className="font-semibold text-gray-900">{caseItem.documents}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Extracted Fields</div>
                        <div className="font-semibold text-gray-900">{caseItem.extractedFields}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Failed Fields</div>
                        <div className="font-semibold text-red-600">{caseItem.failedFields}</div>
                      </div>
                    </div>
                    {caseItem.issues.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          {caseItem.issues.length} issue{caseItem.issues.length > 1 ? 's' : ''}:
                        </div>
                        <div className="space-y-1">
                          {caseItem.issues.slice(0, 2).map((issue, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              • {issue.message}
                            </div>
                          ))}
                          {caseItem.issues.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{caseItem.issues.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">Updated {caseItem.lastUpdated}</div>
              </div>
            )
          })}
        </div>

        {/* Case Details Panel */}
        <div className="lg:col-span-1">
          {selectedCase ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Case Health Summary</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <Download size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const config = statusConfig[selectedCase.status]
                      const StatusIcon = config.icon
                      return <StatusIcon className={config.color} size={20} />
                    })()}
                    <span className="font-medium capitalize">{selectedCase.status}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">What Passed</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600" size={16} />
                      {selectedCase.documents} documents processed
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600" size={16} />
                      {selectedCase.extractedFields - selectedCase.failedFields} fields extracted successfully
                    </div>
                  </div>
                </div>

                {selectedCase.failedFields > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">What Failed</h3>
                    <div className="text-sm text-red-600">
                      {selectedCase.failedFields} field{selectedCase.failedFields > 1 ? 's' : ''} failed extraction or validation
                    </div>
                  </div>
                )}

                {selectedCase.issues.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Issues & Actions</h3>
                    <div className="space-y-3">
                      {selectedCase.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span
                              className={clsx(
                                'text-xs font-medium px-2 py-1 rounded',
                                issue.severity === 'high' && 'bg-red-100 text-red-700',
                                issue.severity === 'medium' && 'bg-yellow-100 text-yellow-700',
                                issue.severity === 'low' && 'bg-blue-100 text-blue-700'
                              )}
                            >
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 mt-2">{issue.message}</p>
                          {issue.field && (
                            <p className="text-xs text-gray-500 mt-1">Field: {issue.field}</p>
                          )}
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700">Action:</p>
                            <p className="text-xs text-gray-600 mt-1">{issue.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Play size={16} />
                  Re-run Evaluation
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500 text-center">Select a case to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



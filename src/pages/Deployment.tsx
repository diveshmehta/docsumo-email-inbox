import { useState } from 'react'
import {
  Rocket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  RotateCcw as Rollback,
} from 'lucide-react'
import clsx from 'clsx'

interface Deployment {
  id: string
  configName: string
  version: string
  status: 'pending' | 'deploying' | 'deployed' | 'failed' | 'rolled-back'
  deployedAt?: string
  deployedBy?: string
  testResults?: {
    stpRate: number
    exceptionRate: number
    passed: boolean
  }
  rollbackAvailable: boolean
}

const mockDeployments: Deployment[] = [
  {
    id: 'deploy-001',
    configName: 'Validation Rules v2.1',
    version: 'v2.1',
    status: 'deployed',
    deployedAt: '2 hours ago',
    deployedBy: 'John Doe',
    testResults: {
      stpRate: 82.3,
      exceptionRate: 9.2,
      passed: true,
    },
    rollbackAvailable: true,
  },
  {
    id: 'deploy-002',
    configName: 'Extraction Model Update',
    version: 'v1.9',
    status: 'deploying',
    deployedAt: '5 minutes ago',
    deployedBy: 'Jane Smith',
    testResults: {
      stpRate: 85.1,
      exceptionRate: 8.5,
      passed: true,
    },
    rollbackAvailable: false,
  },
  {
    id: 'deploy-003',
    configName: 'Confidence Thresholds',
    version: 'v2.0',
    status: 'deployed',
    deployedAt: '1 week ago',
    deployedBy: 'John Doe',
    testResults: {
      stpRate: 78.5,
      exceptionRate: 12.3,
      passed: true,
    },
    rollbackAvailable: true,
  },
]

const pendingDeployments = [
  {
    id: 'pending-001',
    configName: 'Document Classification Update',
    version: 'v2.2',
    testResults: {
      stpRate: 83.5,
      exceptionRate: 8.9,
      passed: true,
    },
    approvedBy: 'Sarah Johnson',
    approvedAt: '1 hour ago',
  },
]

export default function Deployment() {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(
    mockDeployments[0]
  )

  const handleDeploy = (deploymentId: string) => {
    console.log('Deploying:', deploymentId)
    // Implementation would trigger deployment
  }

  const handleRollback = (deploymentId: string) => {
    console.log('Rolling back:', deploymentId)
    // Implementation would trigger rollback
  }

  const getStatusConfig = (status: Deployment['status']) => {
    switch (status) {
      case 'deployed':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
        }
      case 'deploying':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        }
      case 'failed':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        }
      case 'rolled-back':
        return {
          icon: Rollback,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
        }
      default:
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
        }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deployment Management</h1>
        <p className="mt-2 text-gray-600">
          Deploy tested configurations and manage production changes
        </p>
      </div>

      {/* Pending Deployments */}
      {pendingDeployments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border-2 border-yellow-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Deployments
              </h2>
            </div>
          </div>
          <div className="space-y-4">
            {pendingDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{deployment.configName}</h3>
                      <span className="px-2 py-1 bg-white text-gray-700 rounded text-xs font-medium">
                        {deployment.version}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <div className="text-gray-600">STP Rate</div>
                        <div className="font-semibold text-gray-900">
                          {deployment.testResults.stpRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Exception Rate</div>
                        <div className="font-semibold text-gray-900">
                          {deployment.testResults.exceptionRate}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      Approved by {deployment.approvedBy} • {deployment.approvedAt}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeploy(deployment.id)}
                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Rocket size={16} />
                    Deploy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Deployment History</h2>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <History size={16} />
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockDeployments.map((deployment) => {
                const statusConfig = getStatusConfig(deployment.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={deployment.id}
                    onClick={() => setSelectedDeployment(deployment)}
                    className={clsx(
                      'p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
                      selectedDeployment?.id === deployment.id
                        ? `${statusConfig.border} ${statusConfig.bg}`
                        : 'border-gray-200'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusIcon className={statusConfig.color} size={20} />
                          <h3 className="font-semibold text-gray-900">
                            {deployment.configName}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {deployment.version}
                          </span>
                          <span
                            className={clsx(
                              'px-2 py-1 rounded text-xs font-medium capitalize',
                              statusConfig.bg,
                              statusConfig.color
                            )}
                          >
                            {deployment.status.replace('-', ' ')}
                          </span>
                        </div>
                        {deployment.testResults && (
                          <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                            <div>
                              <div className="text-gray-600">STP Rate</div>
                              <div className="font-semibold text-gray-900">
                                {deployment.testResults.stpRate}%
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Exception Rate</div>
                              <div className="font-semibold text-gray-900">
                                {deployment.testResults.exceptionRate}%
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Status</div>
                              <div
                                className={clsx(
                                  'font-semibold',
                                  deployment.testResults.passed
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                )}
                              >
                                {deployment.testResults.passed ? 'Passed' : 'Failed'}
                              </div>
                            </div>
                          </div>
                        )}
                        {deployment.deployedAt && (
                          <div className="mt-3 text-xs text-gray-500">
                            Deployed {deployment.deployedAt} by {deployment.deployedBy}
                          </div>
                        )}
                      </div>
                      {deployment.rollbackAvailable && deployment.status === 'deployed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRollback(deployment.id)
                          }}
                          className="ml-4 flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          <Rollback size={16} />
                          Rollback
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Deployment Details */}
        <div className="lg:col-span-1">
          {selectedDeployment ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deployment Details</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Configuration</div>
                  <div className="font-semibold text-gray-900">{selectedDeployment.configName}</div>
                  <div className="text-sm text-gray-500 mt-1">Version {selectedDeployment.version}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const statusConfig = getStatusConfig(selectedDeployment.status)
                      const StatusIcon = statusConfig.icon
                      return <StatusIcon className={statusConfig.color} size={20} />
                    })()}
                    <span className="font-medium capitalize">
                      {selectedDeployment.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {selectedDeployment.deployedAt && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Deployed</div>
                    <div className="text-gray-900">{selectedDeployment.deployedAt}</div>
                    {selectedDeployment.deployedBy && (
                      <div className="text-sm text-gray-500 mt-1">
                        by {selectedDeployment.deployedBy}
                      </div>
                    )}
                  </div>
                )}

                {selectedDeployment.testResults && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-900 mb-3">
                      Pre-deployment Test Results
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">STP Rate</span>
                        <span className="font-semibold text-gray-900">
                          {selectedDeployment.testResults.stpRate}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Exception Rate</span>
                        <span className="font-semibold text-gray-900">
                          {selectedDeployment.testResults.exceptionRate}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Test Status</span>
                        <span
                          className={clsx(
                            'font-semibold',
                            selectedDeployment.testResults.passed
                              ? 'text-green-600'
                              : 'text-red-600'
                          )}
                        >
                          {selectedDeployment.testResults.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDeployment.rollbackAvailable &&
                  selectedDeployment.status === 'deployed' && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleRollback(selectedDeployment.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Rollback size={16} />
                        Rollback to Previous Version
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500 text-center">Select a deployment to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



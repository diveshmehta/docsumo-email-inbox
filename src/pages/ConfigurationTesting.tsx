import { useState } from 'react'
import {
  Play,
  GitBranch,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react'
import clsx from 'clsx'

interface ConfigVersion {
  id: string
  name: string
  description: string
  changes: string[]
  createdAt: string
  status: 'draft' | 'testing' | 'approved' | 'deployed'
}

interface TestResult {
  configId: string
  stpRate: number
  exceptionRate: number
  avgTimeToDecision: number
  fieldAccuracy: number
  passed: boolean
  testCases: number
  passedCases: number
}

const mockConfigs: ConfigVersion[] = [
  {
    id: 'config-v2.1',
    name: 'Validation Rules v2.1',
    description: 'Updated income-to-debt ratio threshold and added new document validation',
    changes: [
      'Income-to-debt ratio threshold: 0.45 → 0.50',
      'Added bank statement date validation',
      'Updated confidence threshold for employment fields: 0.70 → 0.75',
    ],
    createdAt: '2 days ago',
    status: 'testing',
  },
  {
    id: 'config-v2.0',
    name: 'Current Production',
    description: 'Current production configuration',
    changes: [],
    createdAt: '1 month ago',
    status: 'deployed',
  },
  {
    id: 'config-v1.9',
    name: 'Extraction Model Update',
    description: 'New extraction model with improved accuracy',
    changes: [
      'Updated extraction model: v1.2 → v1.3',
      'Improved table extraction accuracy',
    ],
    createdAt: '3 days ago',
    status: 'draft',
  },
]

const mockTestResults: Record<string, TestResult> = {
  'config-v2.1': {
    configId: 'config-v2.1',
    stpRate: 82.3,
    exceptionRate: 9.2,
    avgTimeToDecision: 3.8,
    fieldAccuracy: 94.5,
    passed: true,
    testCases: 150,
    passedCases: 123,
  },
  'config-v2.0': {
    configId: 'config-v2.0',
    stpRate: 78.5,
    exceptionRate: 12.3,
    avgTimeToDecision: 4.2,
    fieldAccuracy: 91.2,
    passed: true,
    testCases: 150,
    passedCases: 118,
  },
}

export default function ConfigurationTesting() {
  const [selectedConfig, setSelectedConfig] = useState<ConfigVersion | null>(mockConfigs[0])
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [baselineConfig, setBaselineConfig] = useState<string>('config-v2.0')

  const handleRunTest = async () => {
    if (!selectedConfig) return
    setIsRunningTest(true)
    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRunningTest(false)
  }

  const selectedResult = selectedConfig ? mockTestResults[selectedConfig.id] : null
  const baselineResult = mockTestResults[baselineConfig]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuration Testing</h1>
        <p className="mt-2 text-gray-600">
          Test configuration changes on evaluation sets before deploying
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurations</h2>
            <div className="space-y-3">
              {mockConfigs.map((config) => (
                <div
                  key={config.id}
                  onClick={() => setSelectedConfig(config)}
                  className={clsx(
                    'p-4 rounded-lg border-2 cursor-pointer transition-all',
                    selectedConfig?.id === config.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{config.name}</h3>
                      <span
                        className={clsx(
                          'text-xs px-2 py-1 rounded mt-1 inline-block',
                          config.status === 'deployed' && 'bg-green-100 text-green-700',
                          config.status === 'testing' && 'bg-yellow-100 text-yellow-700',
                          config.status === 'draft' && 'bg-gray-100 text-gray-700',
                          config.status === 'approved' && 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {config.status}
                      </span>
                    </div>
                    {config.status === 'deployed' && (
                      <CheckCircle2 className="text-green-600" size={20} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{config.description}</p>
                  <div className="text-xs text-gray-500 mt-2">{config.createdAt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Set Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Evaluation Set</h3>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Loan Applications - Q4 2024 (150 cases)</option>
              <option>Loan Applications - Q3 2024 (142 cases)</option>
              <option>Mortgage Applications - 2024 (89 cases)</option>
            </select>
          </div>
        </div>

        {/* Configuration Details & Testing */}
        <div className="lg:col-span-2 space-y-6">
          {selectedConfig && (
            <>
              {/* Configuration Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedConfig.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedConfig.description}</p>
                  </div>
                  <button
                    onClick={handleRunTest}
                    disabled={isRunningTest}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Play size={16} />
                    {isRunningTest ? 'Running...' : 'Run Test'}
                  </button>
                </div>

                {selectedConfig.changes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Changes</h3>
                    <ul className="space-y-2">
                      {selectedConfig.changes.map((change, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <GitBranch className="text-blue-600 mt-0.5" size={16} />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Test Results */}
              {selectedResult && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Test Results</h2>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={comparisonMode}
                        onChange={(e) => setComparisonMode(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Compare with baseline</span>
                    </label>
                  </div>

                  {comparisonMode && (
                    <div className="mb-4">
                      <label className="text-sm text-gray-700 mb-2 block">Baseline:</label>
                      <select
                        value={baselineConfig}
                        onChange={(e) => setBaselineConfig(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {mockConfigs
                          .filter((c) => c.status === 'deployed')
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <MetricComparison
                      label="STP Rate"
                      current={selectedResult.stpRate}
                      baseline={comparisonMode ? baselineResult.stpRate : undefined}
                      unit="%"
                      higherIsBetter
                    />
                    <MetricComparison
                      label="Exception Rate"
                      current={selectedResult.exceptionRate}
                      baseline={comparisonMode ? baselineResult.exceptionRate : undefined}
                      unit="%"
                      higherIsBetter={false}
                    />
                    <MetricComparison
                      label="Time to Decision"
                      current={selectedResult.avgTimeToDecision}
                      baseline={comparisonMode ? baselineResult.avgTimeToDecision : undefined}
                      unit="h"
                      higherIsBetter={false}
                    />
                    <MetricComparison
                      label="Field Accuracy"
                      current={selectedResult.fieldAccuracy}
                      baseline={comparisonMode ? baselineResult.fieldAccuracy : undefined}
                      unit="%"
                      higherIsBetter
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Test Cases</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {selectedResult.passedCases} / {selectedResult.testCases} passed
                        </div>
                      </div>
                      <div
                        className={clsx(
                          'flex items-center gap-2 px-4 py-2 rounded-lg',
                          selectedResult.passed
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        )}
                      >
                        {selectedResult.passed ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <XCircle size={20} />
                        )}
                        <span className="font-medium">
                          {selectedResult.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedResult.passed && selectedConfig.status === 'draft' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Approve for Deployment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface MetricComparisonProps {
  label: string
  current: number
  baseline?: number
  unit: string
  higherIsBetter: boolean
}

function MetricComparison({
  label,
  current,
  baseline,
  unit,
  higherIsBetter,
}: MetricComparisonProps) {
  const diff = baseline !== undefined ? current - baseline : undefined
  const isImprovement =
    diff !== undefined
      ? higherIsBetter
        ? diff > 0
        : diff < 0
      : undefined

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {current.toFixed(1)}
          {unit}
        </span>
        {diff !== undefined && (
          <span
            className={clsx(
              'text-sm font-medium flex items-center gap-1',
              isImprovement ? 'text-green-600' : diff === 0 ? 'text-gray-600' : 'text-red-600'
            )}
          >
            <TrendingUp
              size={14}
              className={isImprovement ? '' : 'rotate-180'}
            />
            {diff > 0 ? '+' : ''}
            {diff.toFixed(1)}
            {unit}
          </span>
        )}
      </div>
      {baseline !== undefined && (
        <div className="text-xs text-gray-500 mt-1">Baseline: {baseline.toFixed(1)}{unit}</div>
      )}
    </div>
  )
}



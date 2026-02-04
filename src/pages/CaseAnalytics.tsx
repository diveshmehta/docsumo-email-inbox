import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Filter, Download } from 'lucide-react'
import clsx from 'clsx'

const failureReasonsData = [
  { name: 'Missing Docs', value: 145, color: '#ef4444' },
  { name: 'Low Confidence', value: 89, color: '#f59e0b' },
  { name: 'Validation Fail', value: 67, color: '#3b82f6' },
  { name: 'Integration Error', value: 23, color: '#8b5cf6' },
]

const stpTrendData = [
  { month: 'Jan', stp: 72, exceptions: 28 },
  { month: 'Feb', stp: 74, exceptions: 26 },
  { month: 'Mar', stp: 75, exceptions: 25 },
  { month: 'Apr', stp: 76, exceptions: 24 },
  { month: 'May', stp: 77, exceptions: 23 },
  { month: 'Jun', stp: 78.5, exceptions: 21.5 },
]

const issueBreakdownData = [
  { category: 'Case Type A', missingDocs: 45, lowConfidence: 23, validation: 12 },
  { category: 'Case Type B', missingDocs: 67, lowConfidence: 34, validation: 28 },
  { category: 'Case Type C', missingDocs: 33, lowConfidence: 32, validation: 27 },
]

const timeToDecisionData = [
  { week: 'Week 1', avg: 5.2 },
  { week: 'Week 2', avg: 4.8 },
  { week: 'Week 3', avg: 4.5 },
  { week: 'Week 4', avg: 4.2 },
]

export default function CaseAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedFilter, setSelectedFilter] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Analytics</h1>
          <p className="mt-2 text-gray-600">
            Understand what's going wrong across cases and identify improvement opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-500" />
          <div className="flex gap-2">
            {['all', 'case-type', 'document-type', 'source-channel', 'assignee'].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {filter.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Top Recurring Failure Reasons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Recurring Failure Reasons
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={failureReasonsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {failureReasonsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-4">
            {failureReasonsData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{item.value}</div>
                  <div className="text-sm text-gray-500">occurrences</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STP Rate Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Straight-Through Processing Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stpTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="stp"
              stroke="#10b981"
              strokeWidth={2}
              name="STP Rate (%)"
            />
            <Line
              type="monotone"
              dataKey="exceptions"
              stroke="#ef4444"
              strokeWidth={2}
              name="Exception Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Issue Breakdown by Category */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Issue Breakdown by Case Type
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={issueBreakdownData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="missingDocs" stackId="a" fill="#ef4444" name="Missing Docs" />
            <Bar dataKey="lowConfidence" stackId="a" fill="#f59e0b" name="Low Confidence" />
            <Bar dataKey="validation" stackId="a" fill="#3b82f6" name="Validation Fail" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Time to Decision Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Average Time to Decision Trend
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeToDecisionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Hours"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}



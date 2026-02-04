import { Link } from 'react-router-dom'
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  FileText,
  Settings,
  BarChart3
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import IssueCard from '../components/IssueCard'
import { useCaseData } from '../hooks/useCaseData'

export default function Dashboard() {
  const { metrics, topIssues, recentActivity } = useCaseData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Case Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Monitor case health, identify issues, and improve configurations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Straight-Through Processing"
          value={`${metrics.stpRate}%`}
          change={+2.3}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Average Time to Decision"
          value={`${metrics.avgTimeToDecision}h`}
          change={-1.2}
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Exception Rate"
          value={`${metrics.exceptionRate}%`}
          change={-0.8}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Manual Touches"
          value={metrics.manualTouches}
          change={-12}
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Top Issues & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Recurring Issues */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Recurring Issues
            </h2>
            <Link
              to="/analytics"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {topIssues.map((issue, idx) => (
              <IssueCard key={idx} issue={issue} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/evaluation"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Evaluate Case</div>
                <div className="text-sm text-gray-500">
                  Run diagnostics on a specific case
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600" size={20} />
            </Link>
            <Link
              to="/testing"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <Settings className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Test Configuration</div>
                <div className="text-sm text-gray-500">
                  Test changes before deploying
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600" size={20} />
            </Link>
            <Link
              to="/analytics"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200">
                <BarChart3 className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">View Analytics</div>
                <div className="text-sm text-gray-500">
                  Deep dive into case metrics
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div className="flex-1 text-sm">
                <span className="text-gray-900">{activity.description}</span>
                <span className="text-gray-500 ml-2">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



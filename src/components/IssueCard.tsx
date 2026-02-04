import { AlertTriangle } from 'lucide-react'

interface Issue {
  type: string
  frequency: number
  impact: 'high' | 'medium' | 'low'
  description: string
}

interface IssueCardProps {
  issue: Issue
}

const impactColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle
          className={issue.impact === 'high' ? 'text-red-600' : 'text-yellow-600'}
          size={20}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-gray-900">{issue.type}</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium border ${impactColors[issue.impact]}`}
          >
            {issue.impact}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{issue.description}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span>{issue.frequency} occurrences</span>
        </div>
      </div>
    </div>
  )
}



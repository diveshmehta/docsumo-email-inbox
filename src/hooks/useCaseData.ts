import { useState } from 'react'

interface Metrics {
  stpRate: number
  avgTimeToDecision: number
  exceptionRate: number
  manualTouches: number
}

interface Issue {
  type: string
  frequency: number
  impact: 'high' | 'medium' | 'low'
  description: string
}

interface Activity {
  description: string
  time: string
}

export function useCaseData() {
  const [metrics] = useState<Metrics>({
    stpRate: 78.5,
    avgTimeToDecision: 4.2,
    exceptionRate: 12.3,
    manualTouches: 342,
  })

  const [topIssues] = useState<Issue[]>([
    {
      type: 'Missing Required Documents',
      frequency: 145,
      impact: 'high',
      description: 'Loan applications missing bank statements or pay stubs',
    },
    {
      type: 'Low Confidence Extraction',
      frequency: 89,
      impact: 'medium',
      description: 'Fields extracted with confidence below threshold',
    },
    {
      type: 'Validation Rule Failures',
      frequency: 67,
      impact: 'medium',
      description: 'Cross-document validation checks failing',
    },
    {
      type: 'Integration Errors',
      frequency: 23,
      impact: 'low',
      description: 'API timeouts and connection issues',
    },
  ])

  const [recentActivity] = useState<Activity[]>([
    { description: 'Configuration change deployed: Validation rules v2.1', time: '2 hours ago' },
    { description: 'Case evaluation completed: 15 cases tested', time: '5 hours ago' },
    { description: 'New issue detected: Missing documents increased by 12%', time: '1 day ago' },
    { description: 'STP rate improved to 78.5% (+2.3%)', time: '2 days ago' },
  ])

  return { metrics, topIssues, recentActivity }
}



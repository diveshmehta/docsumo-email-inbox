# Case Analytics & Evaluation UI

A comprehensive case analytics and evaluation system for DocSumo that helps users understand problems with case setup, improve configurations, test changes, and deploy updates.

## Features

### 1. Dashboard
- Key metrics overview (STP rate, time to decision, exception rate, manual touches)
- Top recurring issues with frequency and impact
- Quick actions for common tasks
- Recent activity feed

### 2. Case Analytics
- Top recurring failure reasons with visual breakdowns
- STP rate trends over time
- Issue breakdown by case type, document type, source channel
- Time to decision trends
- Filterable and exportable analytics

### 3. Case Evaluation
- Case-level diagnostics showing what passed, what failed, and what's missing
- Actionable issue explanations with recommended actions
- Field-level confidence scores and evidence
- Distinction between data problems vs document problems
- Case health summary view

### 4. Configuration Testing
- Test configuration changes on evaluation sets before deploying
- Compare before vs after metrics (STP rate, exception rate, accuracy)
- Version management for configurations
- Approval workflow for safe deployments

### 5. Deployment Management
- Deploy tested configurations to production
- Deployment history with rollback capability
- Pre-deployment test results tracking
- Status monitoring (pending, deploying, deployed, failed, rolled-back)

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vite** for build tooling
- **Tailwind CSS** (via inline styles) for styling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx       # Main layout with sidebar navigation
│   ├── MetricCard.tsx   # Metric display card
│   └── IssueCard.tsx    # Issue display card
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── CaseAnalytics.tsx # Analytics and insights
│   ├── CaseEvaluation.tsx # Case-level diagnostics
│   ├── ConfigurationTesting.tsx # Test configurations
│   └── Deployment.tsx   # Deployment management
├── hooks/               # Custom React hooks
│   └── useCaseData.ts   # Mock data hook
├── App.tsx              # Main app component with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Key Personas Supported

1. **Case Managers**: Overview dashboard, top issues, quick actions
2. **Analysts**: Deep analytics, case evaluation, detailed diagnostics
3. **Administrators**: Configuration testing, deployment management, version control

## Design Principles

- **User-Centered**: Aligned with JTBD requirements from case evaluation and model evaluation documents
- **Actionable**: Every insight includes recommended actions
- **Transparent**: Clear explanations of what's wrong and why
- **Safe**: Testing and approval workflows before deployment
- **Auditable**: Full history and traceability of changes

## Future Enhancements

- Integration with actual backend APIs
- Real-time data updates
- Advanced filtering and slicing capabilities
- Export to PDF/CSV
- Role-based permissions
- Evaluation set management UI
- Ground truth labeling interface



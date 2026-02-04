# Email Inbox Feature for Docsumo - Product Requirements Document

## Executive Summary

This PRD outlines the requirements for building an intelligent email inbox feature within Docsumo that enables customers to link their email accounts, automatically classify and extract data from emails and attachments, trigger workflows based on document classification, and create cases. The feature takes inspiration from Superhuman's inbox UX and incorporates best practices from workflow automation platforms like Zapier, Make.com, and Rossum.

## 1. Competitive Analysis

### 1.1 Key Competitors Analyzed

**Rossum Email Inbox:**
- Queue-specific email addresses with custom prefixes
- Sender allowlist/denylist with wildcard patterns
- Smart attachment filtering (resolution, size, file type)
- Auto-rejection notifications to senders
- Email forwarding and personalized responses
- Document classification and extraction

**Zapier Email Automation:**
- Email capture and classification
- Data extraction into structured formats
- Task/workflow triggering from emails
- Integration with CRMs and databases
- Email sorting and labeling
- Multi-step automation workflows

**Make.com (Integromat):**
- Email trigger scenarios
- Conditional workflow logic
- Data transformation between steps
- Multi-app integrations
- Error handling and retry mechanisms

**Superhuman Email Inbox:**
- Keyboard-first navigation
- Split inbox view (Important/Other)
- AI-powered email insights
- Undo send functionality
- Snippets and templates
- Speed-focused UI patterns

**n8n Workflow Automation:**
- Self-hosted workflow automation
- Email triggers and actions
- Node-based workflow builder
- Custom code execution
- Webhook support

### 1.2 Common Features Across Competitors

**Must-Have Features (Present in 80%+ of solutions):**
1. Email account linking (OAuth/IMAP)
2. Email inbox view with list/detail views
3. Automatic email classification/tagging
4. Attachment processing
5. Workflow triggering from email events
6. Data extraction from emails/attachments
7. Status tracking and audit logs
8. Filtering and search capabilities

**Good-to-Have Features (Present in 50-80% of solutions):**
1. Auto-reply functionality
2. Email threading/conversation view
3. Bulk operations
4. Custom classification rules
5. Sender allowlist/denylist
6. Email forwarding rules
7. Template-based responses
8. Multi-account support

**Nice-to-Have Features (Present in <50% of solutions):**
1. AI-powered email summarization
2. Predictive classification
3. Email scheduling
4. Advanced analytics dashboard
5. Collaborative inbox features

## 2. MVP Feature Prioritization

### 2.1 Phase 1: Core Email Integration (P0 - Critical)

**2.1.1 Email Account Linking**
- Support for generic IMAP (Gmail, Outlook, Exchange, custom servers)
- OAuth 2.0 authentication for Gmail and Outlook
- IMAP credentials for other providers
- Account status indicator (connected/disconnected/syncing)
- Ability to link multiple email accounts
- Secure credential storage

**2.1.2 Email Inbox View**
- Email list view with columns:
  - Sender name/email
  - Subject line
  - Date/time received
  - Classification status badge
  - Workflow status indicator
  - Attachment indicator
  - Unread/read status
- Email detail view showing:
  - Full email body (HTML/text)
  - Attachments list with preview/download
  - Classification results
  - Extracted data fields
  - Triggered workflow actions
  - Case link (if created)
- Superhuman-inspired features:
  - Keyboard shortcuts for navigation
  - Split view (list + detail)
  - Quick actions toolbar
  - Search functionality

**2.1.3 Email Synchronization**
- Real-time email polling (configurable interval: 1min, 5min, 15min)
- Initial sync of recent emails (last 30 days)
- Incremental sync for new emails
- Sync status indicator
- Error handling and retry logic

### 2.2 Phase 2: Classification & Extraction (P0 - Critical)

**2.2.1 Document Classification**
- Automatic classification of email attachments:
  - Bill of Lading (BOL)
  - Tender documents
  - Lumper receipts
  - Other miscellaneous paperwork
- Classification confidence score display
- Multi-document handling:
  - Process each attachment separately
  - Classify documents within same email thread
  - Handle mixed document types in single email
- Manual classification override option

**2.2.2 Data Extraction**
- Leverage existing Docsumo IDP models (100+ pre-trained)
- Extract structured data based on document type:
  - BOL: Carrier, shipper, consignee, dates, reference numbers
  - Tender: Tender ID, submission date, vendor details
  - Lumper receipts: Receipt number, amount, date, location
- Display extracted fields in email detail view
- Confidence scores for each extracted field
- Manual field correction interface

**2.2.3 Classification Display**
- Visual classification badges:
  - Color-coded by document type
  - Confidence indicator
  - Processing status (pending/processing/complete/error)
- Classification history log
- Ability to re-classify documents

### 2.3 Phase 3: Workflow Triggering (P0 - Critical)

**2.3.1 Workflow Configuration**
- Pre-defined workflows for each document type:
  - BOL workflow: Extract data → Create case → Notify operations team
  - Tender workflow: Extract data → Create case → Route to procurement
  - Lumper receipt workflow: Extract data → Create case → Route to accounting
- Workflow builder UI (drag-and-drop or rule-based)
- Conditional logic support:
  - If classification = BOL, then trigger BOL workflow
  - If sender domain = @vendor.com, then route to vendor queue
- Workflow templates library

**2.3.2 Workflow Execution**
- Automatic workflow triggering based on:
  - Document classification
  - Email sender/domain
  - Subject line patterns
  - Attachment presence
- Workflow action types:
  - Create case in Docsumo
  - Extract data from attachments
  - Send notifications to users/teams
  - Update external systems via API
  - Auto-reply to sender
- Workflow execution status tracking:
  - Pending
  - In progress
  - Completed
  - Failed (with error details)
- Retry mechanism for failed workflows

**2.3.3 Workflow Action Display**
- Workflow panel in email detail view showing:
  - Triggered workflow name
  - Execution status
  - Actions performed
  - Created case link
  - Execution timestamp
  - Error messages (if any)
- Workflow execution history
- Ability to manually trigger/re-trigger workflows

### 2.4 Phase 4: Case Creation (P0 - Critical)

**2.4.1 Case Building**
- Automatic case creation from email:
  - Case ID generation
  - Case title from email subject
  - Case description from email body
  - Attachments linked to case
  - Extracted data fields populated
  - Classification metadata stored
  - Email thread linked to case
- Case structure:
  - Case ID (unique identifier)
  - Title
  - Description
  - Status (Open/In Progress/Resolved/Closed)
  - Classification type
  - Extracted data fields
  - Attachments
  - Email thread reference
  - Workflow execution log
  - Created/updated timestamps

**2.4.2 Case Management Integration**
- Link from email to created case
- View case details from email view
- Update case status from email view
- Add notes/comments to case
- Case list view filtered by email source

### 2.5 Phase 5: User Interface (P1 - High Priority)

**2.5.1 Inbox Layout**
- Three-panel layout:
  - Left: Email list (scrollable)
  - Center: Email detail view
  - Right: Classification & workflow panel (collapsible)
- Responsive design for mobile/tablet
- Dark mode support (if in design system)

**2.5.2 Navigation & Actions**
- Keyboard shortcuts:
  - `j/k`: Navigate up/down email list
  - `Enter`: Open email detail
  - `r`: Reply
  - `a`: Archive
  - `/`: Focus search
- Bulk actions:
  - Select multiple emails
  - Bulk classify
  - Bulk archive/delete
  - Bulk workflow trigger

**2.5.3 Filtering & Search**
- Filter by:
  - Classification type
  - Workflow status
  - Sender
  - Date range
  - Has attachments
  - Unread/read
- Full-text search across:
  - Subject
  - Email body
  - Sender
  - Extracted data

### 2.6 Good-to-Have Features (P2 - Medium Priority)

1. **Auto-Reply Functionality**
   - Template-based auto-replies
   - Conditional auto-replies based on classification
   - Customizable reply templates

2. **Email Threading**
   - Group related emails into threads
   - Show conversation history
   - Link all emails in thread to same case

3. **Advanced Classification**
   - Custom document type definitions
   - User-defined classification rules
   - Machine learning model training interface

4. **Sender Management**
   - Sender allowlist/denylist
   - Auto-classification based on sender
   - Sender reputation scoring

5. **Analytics Dashboard**
   - Email processing volume
   - Classification accuracy metrics
   - Workflow execution statistics
   - Case creation trends

6. **Notifications**
   - Email notifications for workflow completion
   - In-app notifications
   - Slack/Teams integration

## 3. Technical Architecture

### 3.1 Email Integration Layer

**IMAP Connection:**
- Support IMAP4 protocol
- SSL/TLS encryption
- Connection pooling
- Automatic reconnection on failure

**OAuth Integration:**
- Gmail API (OAuth 2.0)
- Microsoft Graph API (OAuth 2.0)
- Token refresh mechanism
- Scope: Read emails, read attachments

**Email Processing:**
- Email parsing (MIME format)
- Attachment extraction
- HTML to text conversion
- Email metadata extraction

### 3.2 Classification & Extraction Layer

**Document Classification:**
- Integration with existing Docsumo classification models
- Multi-document support
- Confidence scoring
- Fallback to manual classification

**Data Extraction:**
- Leverage existing Docsumo IDP models
- Field-level extraction
- Confidence scores per field
- Validation rules

### 3.3 Workflow Engine

**Workflow Definition:**
- JSON/YAML workflow configuration
- Rule-based triggers
- Action definitions
- Error handling rules

**Workflow Execution:**
- Async workflow processing
- Queue-based execution
- Retry logic
- Status tracking

### 3.4 Case Management

**Case Creation:**
- Case API integration
- Data mapping from extracted fields
- Attachment linking
- Email thread association

**Case Updates:**
- Status updates
- Field updates
- Comment/note addition

### 3.5 Data Storage

**Email Storage:**
- Email metadata (sender, subject, date, etc.)
- Email body (text/HTML)
- Attachment references
- Classification results
- Extracted data

**Workflow Storage:**
- Workflow definitions
- Execution logs
- Status history

**Case Storage:**
- Case records
- Email-case associations
- Field mappings

## 4. User Experience Flow

### 4.1 Email Account Setup Flow

1. User navigates to Email Inbox settings
2. Clicks "Connect Email Account"
3. Selects email provider (Gmail/Outlook/Other)
4. For OAuth providers: Redirects to OAuth consent screen
5. For IMAP: Prompts for credentials (server, port, username, password)
6. Tests connection
7. Saves account configuration
8. Initiates initial email sync
9. Displays sync progress
10. Shows inbox once sync completes

### 4.2 Email Processing Flow

1. New email arrives in linked inbox
2. System polls for new emails (configurable interval)
3. Email appears in inbox list (unread status)
4. System automatically:
   - Extracts attachments
   - Classifies documents
   - Extracts data from documents
   - Triggers appropriate workflow
   - Creates case (if workflow includes case creation)
5. User sees email with:
   - Classification badge
   - Workflow status indicator
   - Extracted data preview
   - Case link (if created)
6. User can:
   - View full email details
   - Review classification results
   - View extracted data
   - Check workflow execution status
   - Open linked case
   - Manually trigger/re-trigger workflow
   - Override classification

### 4.3 Workflow Execution Flow

1. Email classified (e.g., BOL)
2. System matches classification to workflow rules
3. Workflow triggered automatically
4. Workflow executes actions in sequence:
   - Extract data from attachments
   - Create case with extracted data
   - Send notification to operations team
   - Update external system (if configured)
5. Each action status tracked
6. Workflow completion status displayed
7. User notified of completion (if configured)
8. Case link available in email view

## 5. Design System Integration

### 5.1 Figma Design System

**Note:** Figma API access required to extract design tokens. The following should be extracted from the last 10 updated Figma files:

**Design Tokens to Extract:**
- Color palette (primary, secondary, accent, neutral)
- Typography (font families, sizes, weights, line heights)
- Spacing scale (margins, padding)
- Border radius values
- Shadow/elevation styles
- Icon library
- Component library:
  - Buttons
  - Input fields
  - Cards
  - Badges
  - Tables/lists
  - Modals/dialogs
  - Navigation components

**Component Adaptations:**
- Email list item component
- Email detail view component
- Classification badge component
- Workflow status indicator
- Case link component
- Attachment preview component

### 5.2 Superhuman-Inspired Patterns

**Inbox Layout:**
- Clean, minimal design
- High information density
- Keyboard-first interaction
- Split view for efficiency

**Visual Hierarchy:**
- Clear typography hierarchy
- Color-coded classification badges
- Status indicators with icons
- Subtle hover states

**Performance:**
- Lazy loading for email list
- Virtual scrolling for large lists
- Optimistic UI updates
- Skeleton loaders

## 6. API Specifications

### 6.1 Email Account Management

```
POST /api/email-accounts
- Create email account connection
- Body: { provider, credentials, syncSettings }

GET /api/email-accounts
- List connected email accounts

GET /api/email-accounts/:id
- Get email account details

DELETE /api/email-accounts/:id
- Disconnect email account

POST /api/email-accounts/:id/sync
- Trigger manual sync
```

### 6.2 Email Operations

```
GET /api/emails
- List emails with filters
- Query params: page, limit, filters, search

GET /api/emails/:id
- Get email details

POST /api/emails/:id/classify
- Manually trigger classification

POST /api/emails/:id/workflows/trigger
- Manually trigger workflow
```

### 6.3 Classification & Extraction

```
POST /api/emails/:id/classify
- Classify email attachments
- Returns: { classification, confidence, documentType }

GET /api/emails/:id/extraction
- Get extracted data
- Returns: { fields, confidenceScores }
```

### 6.4 Workflow Management

```
GET /api/workflows
- List available workflows

GET /api/workflows/:id
- Get workflow details

POST /api/workflows
- Create new workflow

PUT /api/workflows/:id
- Update workflow

GET /api/emails/:id/workflows
- Get workflow execution history for email
```

### 6.5 Case Management

```
GET /api/emails/:id/case
- Get case linked to email

POST /api/emails/:id/case
- Create case from email
```

## 7. Data Models

### 7.1 Email Model

```typescript
interface Email {
  id: string
  accountId: string
  messageId: string
  threadId: string
  from: {
    name: string
    email: string
  }
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  body: {
    text: string
    html: string
  }
  receivedAt: Date
  attachments: Attachment[]
  classification?: Classification
  extractedData?: ExtractedData
  workflows: WorkflowExecution[]
  caseId?: string
  status: 'unread' | 'read' | 'archived'
  createdAt: Date
  updatedAt: Date
}
```

### 7.2 Classification Model

```typescript
interface Classification {
  emailId: string
  documentType: 'BOL' | 'Tender' | 'LumperReceipt' | 'Other'
  confidence: number
  attachments: {
    attachmentId: string
    documentType: string
    confidence: number
  }[]
  classifiedAt: Date
  classifiedBy: 'system' | 'user'
}
```

### 7.3 Workflow Execution Model

```typescript
interface WorkflowExecution {
  id: string
  emailId: string
  workflowId: string
  workflowName: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  actions: WorkflowAction[]
  startedAt: Date
  completedAt?: Date
  error?: string
}

interface WorkflowAction {
  id: string
  type: 'extract_data' | 'create_case' | 'notify' | 'api_call' | 'reply'
  status: 'pending' | 'completed' | 'failed'
  result?: any
  error?: string
}
```

### 7.4 Case Model

```typescript
interface Case {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  classificationType: string
  extractedData: Record<string, any>
  emailIds: string[]
  attachments: Attachment[]
  workflowExecutions: string[]
  createdAt: Date
  updatedAt: Date
}
```

## 8. Error Handling & Edge Cases

### 8.1 Email Connection Errors

- Connection timeout: Retry with exponential backoff
- Authentication failure: Prompt user to re-authenticate
- Rate limiting: Implement queue with delays
- Network errors: Show user-friendly error message

### 8.2 Classification Errors

- Low confidence classification: Flag for manual review
- Unsupported document type: Classify as "Other"
- Corrupted attachments: Skip and notify user
- Large attachments: Process asynchronously

### 8.3 Workflow Execution Errors

- Workflow failure: Log error, notify user, allow retry
- Partial workflow completion: Show which actions succeeded/failed
- Timeout: Mark as failed, allow retry
- External API failures: Retry with exponential backoff

### 8.4 Case Creation Errors

- Missing required fields: Flag for manual completion
- Duplicate case detection: Link to existing case or merge
- Data validation errors: Show specific field errors

## 9. Security & Privacy

### 9.1 Data Security

- Encrypt email credentials at rest
- Use OAuth 2.0 for authentication (no password storage)
- Secure API endpoints with authentication
- Encrypt email content in database
- Implement access controls (users can only see their emails)

### 9.2 Privacy

- Comply with GDPR/CCPA
- User data retention policies
- Email content encryption
- Audit logs for data access
- User consent for email processing

## 10. Performance Requirements

### 10.1 Response Times

- Email list load: < 2 seconds
- Email detail view: < 1 second
- Classification: < 5 seconds per document
- Workflow execution: < 30 seconds (async)
- Search results: < 1 second

### 10.2 Scalability

- Support 1000+ emails per account
- Handle 100+ concurrent users
- Process 1000+ emails per hour
- Support 10+ linked email accounts per user

## 11. Testing Requirements

### 11.1 Unit Tests

- Email parsing logic
- Classification logic
- Workflow execution logic
- Data extraction logic

### 11.2 Integration Tests

- Email account connection
- Email synchronization
- Classification API integration
- Workflow execution
- Case creation

### 11.3 E2E Tests

- Complete email processing flow
- Workflow triggering
- Case creation
- User interactions (view, filter, search)

## 12. Success Metrics

### 12.1 Adoption Metrics

- Number of email accounts connected
- Number of emails processed per day
- Active users per week/month

### 12.2 Performance Metrics

- Classification accuracy rate
- Average processing time per email
- Workflow success rate
- Case creation success rate

### 12.3 User Satisfaction Metrics

- User feedback scores
- Support ticket volume
- Feature usage analytics

## 13. Implementation Phases

### Phase 1: MVP (Weeks 1-4)
- Email account linking (IMAP + OAuth)
- Basic inbox view
- Email synchronization
- Document classification (BOL, Tender, Lumper Receipt)
- Basic workflow triggering
- Case creation

### Phase 2: Enhanced Features (Weeks 5-8)
- Advanced inbox features (filtering, search)
- Workflow builder UI
- Enhanced classification display
- Workflow execution tracking
- Error handling improvements

### Phase 3: Polish & Optimization (Weeks 9-12)
- Performance optimization
- UI/UX refinements
- Advanced features (auto-reply, threading)
- Analytics dashboard
- Documentation

## 14. Prototype Development Guide

This PRD is designed to be given to another LLM or development team to create a functional prototype. The prototype should:

1. **Use Existing Codebase Structure**
   - Follow patterns from `src/components/` (MetricCard, IssueCard, Layout)
   - Use Tailwind CSS for styling (matching existing `tailwind.config.js`)
   - Follow React + TypeScript patterns from existing pages

2. **Implement Core MVP Features**
   - Email inbox list view
   - Email detail view
   - Classification display
   - Workflow status panel
   - Mock data for demonstration

3. **Design System Integration**
   - Extract design tokens from Figma (if accessible)
   - Match existing component styles
   - Use Superhuman-inspired layout patterns

4. **Interactive Prototype**
   - Clickable email list items
   - Expandable email detail view
   - Classification badges with colors
   - Workflow status indicators
   - Case link navigation

5. **Mock Data Structure**
   - Sample emails with various classifications
   - Mock workflow executions
   - Sample extracted data
   - Case references

## 15. Open Questions & Assumptions

### Assumptions Made:
1. Docsumo has existing APIs for case creation and data extraction
2. Classification models can be extended for new document types
3. Workflow engine exists or can be built
4. Figma design system is accessible via API

### Questions to Resolve:
1. What is the exact case data structure in Docsumo?
2. Are there existing workflow APIs or do we need to build the workflow engine?
3. What are the rate limits for email API calls?
4. Should email content be stored in Docsumo or just metadata?
5. What is the expected email volume per customer?
6. Do we need real-time email sync or is polling sufficient?

## 16. Appendix

### A. Competitor Feature Matrix

| Feature | Rossum | Zapier | Make.com | Superhuman | Docsumo MVP |
|---------|--------|--------|----------|------------|-------------|
| Email Linking | ✅ | ✅ | ✅ | ✅ | ✅ |
| Classification | ✅ | ⚠️ | ⚠️ | ❌ | ✅ |
| Workflow Triggers | ✅ | ✅ | ✅ | ❌ | ✅ |
| Case Creation | ✅ | ⚠️ | ⚠️ | ❌ | ✅ |
| Auto-Reply | ✅ | ✅ | ✅ | ✅ | ⚠️ (P2) |
| Multi-Doc Support | ✅ | ⚠️ | ⚠️ | ❌ | ✅ |

### B. Document Type Definitions

**Bill of Lading (BOL):**
- Standard shipping document
- Contains: Carrier, shipper, consignee, dates, reference numbers
- Typical workflow: Extract → Create case → Notify operations

**Tender:**
- Procurement/bidding document
- Contains: Tender ID, submission date, vendor details, requirements
- Typical workflow: Extract → Create case → Route to procurement

**Lumper Receipt:**
- Freight handling receipt
- Contains: Receipt number, amount, date, location, handler
- Typical workflow: Extract → Create case → Route to accounting

### C. Keyboard Shortcuts Reference

- `j` / `k`: Navigate email list
- `Enter`: Open email detail
- `Esc`: Close email detail
- `r`: Reply to email
- `a`: Archive email
- `d`: Delete email
- `/`: Focus search
- `?`: Show keyboard shortcuts help

---

**Document Version:** 1.0  
**Last Updated:** December 30, 2024  
**Author:** AI Assistant  
**Status:** Ready for Prototype Development

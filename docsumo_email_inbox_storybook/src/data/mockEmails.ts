/**
 * Mock Email Data for Docsumo Email Inbox Prototype
 * Based on PRD: BOL, Tender, LumperReceipt document types
 */

export type DocumentType = 'BOL' | 'Tender' | 'LumperReceipt' | 'Other'
export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
export type EmailStatus = 'unread' | 'read' | 'archived'

export interface Attachment {
  id: string
  filename: string
  size: number
  mimeType: string
  documentType?: DocumentType
  confidence?: number
}

export interface ExtractedField {
  key: string
  label: string
  value: string
  confidence: number
}

export interface WorkflowAction {
  id: string
  type: 'extract_data' | 'create_case' | 'notify' | 'api_call' | 'reply'
  status: WorkflowStatus
  description: string
  completedAt?: string
  error?: string
}

export interface WorkflowExecution {
  id: string
  workflowName: string
  status: WorkflowStatus
  actions: WorkflowAction[]
  startedAt: string
  completedAt?: string
}

export interface Case {
  id: string
  title: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
}

export interface Email {
  id: string
  threadId: string
  from: {
    name: string
    email: string
  }
  to: string[]
  cc: string[]
  subject: string
  body: {
    text: string
    html: string
  }
  receivedAt: string
  attachments: Attachment[]
  classification?: {
    documentType: DocumentType
    confidence: number
    classifiedAt: string
  }
  extractedData?: ExtractedField[]
  workflow?: WorkflowExecution
  case?: Case
  status: EmailStatus
  isThreadStarter?: boolean
  replyToId?: string
  isAutoReply?: boolean
}

// Mock Emails Data
export const mockEmails: Email[] = [
  // BOL Email Thread
  {
    id: 'email-001',
    threadId: 'thread-001',
    from: {
      name: 'John Miller',
      email: 'john.miller@acmelogistics.com',
    },
    to: ['inbox@docsumo.com'],
    cc: ['operations@docsumo.com'],
    subject: 'BOL #12345 - Shipment from Chicago to Dallas',
    body: {
      text: 'Please find attached the Bill of Lading for shipment #12345. This shipment contains 25 pallets of electronic equipment. Estimated delivery: March 15, 2026. Please confirm receipt.',
      html: '<p>Please find attached the <strong>Bill of Lading</strong> for shipment #12345.</p><p>This shipment contains 25 pallets of electronic equipment.</p><p>Estimated delivery: March 15, 2026.</p><p>Please confirm receipt.</p>',
    },
    receivedAt: '2026-02-05T09:30:00Z',
    attachments: [
      {
        id: 'att-001',
        filename: 'BOL_12345.pdf',
        size: 245000,
        mimeType: 'application/pdf',
        documentType: 'BOL',
        confidence: 0.97,
      },
    ],
    classification: {
      documentType: 'BOL',
      confidence: 0.97,
      classifiedAt: '2026-02-05T09:31:00Z',
    },
    extractedData: [
      { key: 'bol_number', label: 'BOL Number', value: '12345', confidence: 0.99 },
      { key: 'carrier', label: 'Carrier', value: 'Acme Logistics Inc.', confidence: 0.95 },
      { key: 'shipper', label: 'Shipper', value: 'Tech Electronics Corp', confidence: 0.94 },
      { key: 'consignee', label: 'Consignee', value: 'Dallas Distribution Center', confidence: 0.96 },
      { key: 'origin', label: 'Origin', value: 'Chicago, IL', confidence: 0.98 },
      { key: 'destination', label: 'Destination', value: 'Dallas, TX', confidence: 0.98 },
      { key: 'ship_date', label: 'Ship Date', value: '2026-02-05', confidence: 0.97 },
      { key: 'delivery_date', label: 'Est. Delivery', value: '2026-02-15', confidence: 0.95 },
      { key: 'weight', label: 'Total Weight', value: '12,500 lbs', confidence: 0.93 },
      { key: 'pieces', label: 'Pieces', value: '25 pallets', confidence: 0.96 },
    ],
    workflow: {
      id: 'wf-001',
      workflowName: 'BOL Processing',
      status: 'completed',
      startedAt: '2026-02-05T09:31:30Z',
      completedAt: '2026-02-05T09:32:45Z',
      actions: [
        { id: 'act-001', type: 'extract_data', status: 'completed', description: 'Extract BOL data', completedAt: '2026-02-05T09:31:45Z' },
        { id: 'act-002', type: 'create_case', status: 'completed', description: 'Create shipment case', completedAt: '2026-02-05T09:32:00Z' },
        { id: 'act-003', type: 'notify', status: 'completed', description: 'Notify operations team', completedAt: '2026-02-05T09:32:30Z' },
        { id: 'act-004', type: 'reply', status: 'completed', description: 'Send confirmation email', completedAt: '2026-02-05T09:32:45Z' },
      ],
    },
    case: {
      id: 'case-001',
      title: 'Shipment #12345 - Chicago to Dallas',
      status: 'in_progress',
      createdAt: '2026-02-05T09:32:00Z',
    },
    status: 'read',
    isThreadStarter: true,
  },
  // Auto-reply for BOL
  {
    id: 'email-001-reply',
    threadId: 'thread-001',
    from: {
      name: 'Docsumo System',
      email: 'inbox@docsumo.com',
    },
    to: ['john.miller@acmelogistics.com'],
    cc: [],
    subject: 'Re: BOL #12345 - Shipment from Chicago to Dallas',
    body: {
      text: 'Thank you for submitting BOL #12345. Your document has been received and processed successfully. Case #case-001 has been created for tracking. The operations team has been notified.',
      html: '<p>Thank you for submitting <strong>BOL #12345</strong>.</p><p>Your document has been received and processed successfully.</p><p>Case #case-001 has been created for tracking.</p><p>The operations team has been notified.</p>',
    },
    receivedAt: '2026-02-05T09:32:45Z',
    attachments: [],
    status: 'read',
    isAutoReply: true,
    replyToId: 'email-001',
  },

  // Tender Email
  {
    id: 'email-002',
    threadId: 'thread-002',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@globalfreight.com',
    },
    to: ['inbox@docsumo.com'],
    cc: ['procurement@docsumo.com', 'finance@docsumo.com'],
    subject: 'Tender Submission - Q1 2026 Freight Services',
    body: {
      text: 'Please find attached our tender submission for Q1 2026 freight services. Our proposal includes competitive rates for LTL and FTL shipments across the Midwest region. Submission deadline: February 10, 2026. We look forward to your response.',
      html: '<p>Please find attached our <strong>tender submission</strong> for Q1 2026 freight services.</p><p>Our proposal includes competitive rates for LTL and FTL shipments across the Midwest region.</p><p><strong>Submission deadline:</strong> February 10, 2026</p><p>We look forward to your response.</p>',
    },
    receivedAt: '2026-02-05T08:15:00Z',
    attachments: [
      {
        id: 'att-002',
        filename: 'GlobalFreight_Tender_Q1_2026.pdf',
        size: 1250000,
        mimeType: 'application/pdf',
        documentType: 'Tender',
        confidence: 0.94,
      },
      {
        id: 'att-003',
        filename: 'Rate_Sheet_2026.xlsx',
        size: 85000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
    classification: {
      documentType: 'Tender',
      confidence: 0.94,
      classifiedAt: '2026-02-05T08:16:00Z',
    },
    extractedData: [
      { key: 'tender_id', label: 'Tender ID', value: 'GF-Q1-2026-001', confidence: 0.96 },
      { key: 'vendor', label: 'Vendor', value: 'Global Freight Inc.', confidence: 0.98 },
      { key: 'submission_date', label: 'Submission Date', value: '2026-02-05', confidence: 0.99 },
      { key: 'deadline', label: 'Deadline', value: '2026-02-10', confidence: 0.97 },
      { key: 'service_type', label: 'Service Type', value: 'LTL & FTL Freight', confidence: 0.92 },
      { key: 'coverage_area', label: 'Coverage Area', value: 'Midwest Region', confidence: 0.91 },
      { key: 'contract_period', label: 'Contract Period', value: 'Q1 2026', confidence: 0.95 },
      { key: 'total_value', label: 'Estimated Value', value: '$450,000', confidence: 0.88 },
    ],
    workflow: {
      id: 'wf-002',
      workflowName: 'Tender Processing',
      status: 'completed',
      startedAt: '2026-02-05T08:16:30Z',
      completedAt: '2026-02-05T08:18:00Z',
      actions: [
        { id: 'act-005', type: 'extract_data', status: 'completed', description: 'Extract tender details', completedAt: '2026-02-05T08:17:00Z' },
        { id: 'act-006', type: 'create_case', status: 'completed', description: 'Create procurement case', completedAt: '2026-02-05T08:17:30Z' },
        { id: 'act-007', type: 'notify', status: 'completed', description: 'Notify procurement team', completedAt: '2026-02-05T08:18:00Z' },
      ],
    },
    case: {
      id: 'case-002',
      title: 'Tender: Global Freight Q1 2026',
      status: 'open',
      createdAt: '2026-02-05T08:17:30Z',
    },
    status: 'unread',
    isThreadStarter: true,
  },

  // Lumper Receipt Email
  {
    id: 'email-003',
    threadId: 'thread-003',
    from: {
      name: 'Mike Thompson',
      email: 'mike.t@quickhaul.com',
    },
    to: ['inbox@docsumo.com'],
    cc: ['accounting@docsumo.com'],
    subject: 'Lumper Receipt - Delivery #DL-8834',
    body: {
      text: 'Attached is the lumper receipt for delivery #DL-8834 at the Walmart DC in Bentonville. Total lumper fee: $285.00. Driver: Mike Thompson. Please process for reimbursement.',
      html: '<p>Attached is the <strong>lumper receipt</strong> for delivery #DL-8834 at the Walmart DC in Bentonville.</p><p><strong>Total lumper fee:</strong> $285.00</p><p><strong>Driver:</strong> Mike Thompson</p><p>Please process for reimbursement.</p>',
    },
    receivedAt: '2026-02-05T07:45:00Z',
    attachments: [
      {
        id: 'att-004',
        filename: 'Lumper_Receipt_DL8834.jpg',
        size: 450000,
        mimeType: 'image/jpeg',
        documentType: 'LumperReceipt',
        confidence: 0.91,
      },
    ],
    classification: {
      documentType: 'LumperReceipt',
      confidence: 0.91,
      classifiedAt: '2026-02-05T07:46:00Z',
    },
    extractedData: [
      { key: 'receipt_number', label: 'Receipt Number', value: 'LR-2026-8834', confidence: 0.94 },
      { key: 'delivery_id', label: 'Delivery ID', value: 'DL-8834', confidence: 0.97 },
      { key: 'amount', label: 'Amount', value: '$285.00', confidence: 0.96 },
      { key: 'location', label: 'Location', value: 'Walmart DC, Bentonville, AR', confidence: 0.93 },
      { key: 'date', label: 'Date', value: '2026-02-05', confidence: 0.98 },
      { key: 'handler', label: 'Handler Company', value: 'QuickLoad Services', confidence: 0.89 },
      { key: 'driver', label: 'Driver', value: 'Mike Thompson', confidence: 0.95 },
    ],
    workflow: {
      id: 'wf-003',
      workflowName: 'Lumper Receipt Processing',
      status: 'completed',
      startedAt: '2026-02-05T07:46:30Z',
      completedAt: '2026-02-05T07:48:00Z',
      actions: [
        { id: 'act-008', type: 'extract_data', status: 'completed', description: 'Extract receipt data', completedAt: '2026-02-05T07:47:00Z' },
        { id: 'act-009', type: 'create_case', status: 'completed', description: 'Create reimbursement case', completedAt: '2026-02-05T07:47:30Z' },
        { id: 'act-010', type: 'notify', status: 'completed', description: 'Notify accounting team', completedAt: '2026-02-05T07:48:00Z' },
      ],
    },
    case: {
      id: 'case-003',
      title: 'Lumper Reimbursement - DL-8834',
      status: 'open',
      createdAt: '2026-02-05T07:47:30Z',
    },
    status: 'read',
    isThreadStarter: true,
  },

  // Another BOL - Processing in progress
  {
    id: 'email-004',
    threadId: 'thread-004',
    from: {
      name: 'Lisa Chen',
      email: 'lisa.chen@swiftcarriers.com',
    },
    to: ['inbox@docsumo.com'],
    cc: [],
    subject: 'Urgent: BOL #67890 - Temperature Controlled Shipment',
    body: {
      text: 'URGENT: Please find the BOL for temperature-controlled shipment #67890. Pharmaceutical products requiring 2-8°C storage. Immediate processing required.',
      html: '<p><strong>URGENT:</strong> Please find the BOL for temperature-controlled shipment #67890.</p><p>Pharmaceutical products requiring 2-8°C storage.</p><p><em>Immediate processing required.</em></p>',
    },
    receivedAt: '2026-02-05T10:00:00Z',
    attachments: [
      {
        id: 'att-005',
        filename: 'BOL_67890_TempControlled.pdf',
        size: 320000,
        mimeType: 'application/pdf',
        documentType: 'BOL',
        confidence: 0.96,
      },
    ],
    classification: {
      documentType: 'BOL',
      confidence: 0.96,
      classifiedAt: '2026-02-05T10:01:00Z',
    },
    extractedData: [
      { key: 'bol_number', label: 'BOL Number', value: '67890', confidence: 0.98 },
      { key: 'carrier', label: 'Carrier', value: 'Swift Carriers LLC', confidence: 0.94 },
      { key: 'shipper', label: 'Shipper', value: 'PharmaCorp International', confidence: 0.93 },
      { key: 'consignee', label: 'Consignee', value: 'Regional Medical Center', confidence: 0.95 },
      { key: 'temp_requirement', label: 'Temperature', value: '2-8°C', confidence: 0.97 },
      { key: 'product_type', label: 'Product Type', value: 'Pharmaceutical', confidence: 0.92 },
    ],
    workflow: {
      id: 'wf-004',
      workflowName: 'BOL Processing',
      status: 'in_progress',
      startedAt: '2026-02-05T10:01:30Z',
      actions: [
        { id: 'act-011', type: 'extract_data', status: 'completed', description: 'Extract BOL data', completedAt: '2026-02-05T10:02:00Z' },
        { id: 'act-012', type: 'create_case', status: 'in_progress', description: 'Create shipment case' },
        { id: 'act-013', type: 'notify', status: 'pending', description: 'Notify operations team' },
      ],
    },
    status: 'unread',
    isThreadStarter: true,
  },

  // Email with failed workflow
  {
    id: 'email-005',
    threadId: 'thread-005',
    from: {
      name: 'Robert Davis',
      email: 'r.davis@transcoexpress.com',
    },
    to: ['inbox@docsumo.com'],
    cc: [],
    subject: 'Multiple Documents - Shipment #45678',
    body: {
      text: 'Please find attached the BOL and supporting documents for shipment #45678.',
      html: '<p>Please find attached the BOL and supporting documents for shipment #45678.</p>',
    },
    receivedAt: '2026-02-04T16:30:00Z',
    attachments: [
      {
        id: 'att-006',
        filename: 'BOL_45678.pdf',
        size: 280000,
        mimeType: 'application/pdf',
        documentType: 'BOL',
        confidence: 0.89,
      },
      {
        id: 'att-007',
        filename: 'Delivery_Note.pdf',
        size: 150000,
        mimeType: 'application/pdf',
        documentType: 'Other',
        confidence: 0.72,
      },
    ],
    classification: {
      documentType: 'BOL',
      confidence: 0.89,
      classifiedAt: '2026-02-04T16:31:00Z',
    },
    workflow: {
      id: 'wf-005',
      workflowName: 'BOL Processing',
      status: 'failed',
      startedAt: '2026-02-04T16:31:30Z',
      actions: [
        { id: 'act-014', type: 'extract_data', status: 'completed', description: 'Extract BOL data', completedAt: '2026-02-04T16:32:00Z' },
        { id: 'act-015', type: 'create_case', status: 'failed', description: 'Create shipment case', error: 'Duplicate case detected for shipment #45678' },
      ],
    },
    status: 'read',
    isThreadStarter: true,
  },

  // Miscellaneous email
  {
    id: 'email-006',
    threadId: 'thread-006',
    from: {
      name: 'Customer Support',
      email: 'support@carrierservices.com',
    },
    to: ['inbox@docsumo.com'],
    cc: [],
    subject: 'Rate Update Notification - Effective March 1, 2026',
    body: {
      text: 'Dear Valued Customer, Please be advised that our freight rates will be updated effective March 1, 2026. See attached for the new rate schedule.',
      html: '<p>Dear Valued Customer,</p><p>Please be advised that our freight rates will be updated effective March 1, 2026.</p><p>See attached for the new rate schedule.</p>',
    },
    receivedAt: '2026-02-04T14:00:00Z',
    attachments: [
      {
        id: 'att-008',
        filename: 'Rate_Update_March2026.pdf',
        size: 95000,
        mimeType: 'application/pdf',
        documentType: 'Other',
        confidence: 0.85,
      },
    ],
    classification: {
      documentType: 'Other',
      confidence: 0.85,
      classifiedAt: '2026-02-04T14:01:00Z',
    },
    status: 'read',
    isThreadStarter: true,
  },

  // Pending classification email
  {
    id: 'email-007',
    threadId: 'thread-007',
    from: {
      name: 'Operations Team',
      email: 'ops@newvendor.com',
    },
    to: ['inbox@docsumo.com'],
    cc: [],
    subject: 'Shipping Documents - Order #ORD-2026-001',
    body: {
      text: 'Attached are the shipping documents for order #ORD-2026-001. Please process accordingly.',
      html: '<p>Attached are the shipping documents for order #ORD-2026-001. Please process accordingly.</p>',
    },
    receivedAt: '2026-02-05T10:30:00Z',
    attachments: [
      {
        id: 'att-009',
        filename: 'ShippingDocs_ORD2026001.pdf',
        size: 520000,
        mimeType: 'application/pdf',
      },
    ],
    status: 'unread',
    isThreadStarter: true,
  },
]

// Helper functions
export const getEmailsByClassification = (type: DocumentType | 'All'): Email[] => {
  if (type === 'All') return mockEmails.filter(e => e.isThreadStarter !== false || e.isAutoReply !== true)
  return mockEmails.filter(
    (email) => email.classification?.documentType === type && email.isThreadStarter !== false
  )
}

export const getEmailThread = (threadId: string): Email[] => {
  return mockEmails.filter((email) => email.threadId === threadId)
}

export const getUnreadCount = (): number => {
  return mockEmails.filter((email) => email.status === 'unread').length
}

export const getCountByClassification = (): Record<string, number> => {
  const counts: Record<string, number> = { All: 0, BOL: 0, Tender: 0, LumperReceipt: 0, Other: 0, Unclassified: 0 }
  
  mockEmails.forEach((email) => {
    if (email.isThreadStarter === false && !email.isAutoReply) return
    if (email.isAutoReply) return
    
    counts.All++
    if (email.classification) {
      counts[email.classification.documentType]++
    } else {
      counts.Unclassified++
    }
  })
  
  return counts
}

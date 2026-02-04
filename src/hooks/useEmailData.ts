import { useState } from 'react'

export type DocumentType = 'BOL' | 'Tender' | 'LumperReceipt' | 'Other'
export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
export type WorkflowStatusStrict = 'pending' | 'completed' | 'failed'
export type EmailStatus = 'unread' | 'read' | 'archived'

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

export interface Classification {
  documentType: DocumentType
  confidence: number
  attachments: {
    attachmentId: string
    documentType: DocumentType
    confidence: number
  }[]
  classifiedAt: Date
  classifiedBy: 'system' | 'user'
}

export interface ExtractedData {
  [key: string]: any
}

export interface WorkflowAction {
  id: string
  type: 'extract_data' | 'create_case' | 'notify' | 'api_call' | 'reply'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  result?: any
  error?: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: WorkflowStatus
  actions: WorkflowAction[]
  startedAt: Date
  completedAt?: Date
  error?: string
}

export interface Email {
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
  status: EmailStatus
  createdAt: Date
  updatedAt: Date
  isThreadStarter?: boolean
  replyToId?: string
  threadEmails?: Email[]
  // For workflow-generated replies
  isWorkflowReply?: boolean
  workflowReplyType?: 'acknowledgment' | 'request_info' | 'confirmation' | 'notification'
}

export interface EmailThread {
  threadId: string
  subject: string
  emails: Email[]
  latestEmail: Email
  unreadCount: number
  totalEmails: number
}

// Realistic mock data
const mockEmails: Email[] = [
  {
    id: '1',
    accountId: 'acc-1',
    messageId: 'msg-1',
    threadId: 'thread-1',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@freightlogistics.com'
    },
    to: ['operations@docsumo.com'],
    cc: [],
    bcc: [],
    subject: 'Bill of Lading - Shipment #BL-2024-1247',
    body: {
      text: 'Please find attached the Bill of Lading for shipment BL-2024-1247.\n\nShipment Details:\n- Carrier: FastTrack Logistics\n- Origin: Los Angeles, CA\n- Destination: Chicago, IL\n- Estimated Delivery: December 15, 2024\n\nPlease process and confirm receipt.\n\nBest regards,\nSarah Johnson\nFreight Logistics Inc.',
      html: '<p>Please find attached the Bill of Lading for shipment BL-2024-1247.</p><p><strong>Shipment Details:</strong><br>- Carrier: FastTrack Logistics<br>- Origin: Los Angeles, CA<br>- Destination: Chicago, IL<br>- Estimated Delivery: December 15, 2024</p><p>Please process and confirm receipt.</p><p>Best regards,<br>Sarah Johnson<br>Freight Logistics Inc.</p>'
    },
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    attachments: [
      {
        id: 'att-1',
        name: 'BOL_BL-2024-1247.pdf',
        size: 245760,
        type: 'application/pdf'
      }
    ],
    classification: {
      documentType: 'BOL',
      confidence: 0.96,
      attachments: [
        {
          attachmentId: 'att-1',
          documentType: 'BOL',
          confidence: 0.96
        }
      ],
      classifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000),
      classifiedBy: 'system'
    },
    extractedData: {
      carrier: 'FastTrack Logistics',
      shipper: 'ABC Manufacturing Co.',
      consignee: 'XYZ Distribution Center',
      origin: 'Los Angeles, CA',
      destination: 'Chicago, IL',
      bolNumber: 'BL-2024-1247',
      shipmentDate: '2024-12-10',
      estimatedDelivery: '2024-12-15',
      weight: '15,000 lbs',
      pallets: 24
    },
    workflows: [
      {
        id: 'wf-1',
        workflowId: 'workflow-bol',
        workflowName: 'BOL Processing Workflow',
        status: 'completed',
        actions: [
          {
            id: 'act-1',
            type: 'extract_data',
            status: 'completed',
            result: { extractedFields: 8 }
          },
          {
            id: 'act-2',
            type: 'create_case',
            status: 'completed',
            result: { caseId: 'case-2024-001' }
          },
          {
            id: 'act-3',
            type: 'notify',
            status: 'completed',
            result: { notified: ['ops-team@docsumo.com'] }
          }
        ],
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10000),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 35000)
      }
    ],
    caseId: 'case-2024-001',
    status: 'unread',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    accountId: 'acc-1',
    messageId: 'msg-2',
    threadId: 'thread-2',
    from: {
      name: 'Michael Chen',
      email: 'mchen@procurement.gov'
    },
    to: ['tenders@docsumo.com'],
    cc: ['procurement@docsumo.com'],
    bcc: [],
    subject: 'Tender Submission - IT Services RFP-2024-089',
    body: {
      text: 'Dear Procurement Team,\n\nWe are submitting our tender response for RFP-2024-089 regarding IT Services.\n\nOur proposal includes:\n- Cloud infrastructure setup\n- Security compliance\n- 24/7 support\n\nPlease find the detailed tender document attached.\n\nRegards,\nMichael Chen\nProcurement Department',
      html: '<p>Dear Procurement Team,</p><p>We are submitting our tender response for <strong>RFP-2024-089</strong> regarding IT Services.</p><p>Our proposal includes:<br>- Cloud infrastructure setup<br>- Security compliance<br>- 24/7 support</p><p>Please find the detailed tender document attached.</p><p>Regards,<br>Michael Chen<br>Procurement Department</p>'
    },
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    attachments: [
      {
        id: 'att-2',
        name: 'Tender_RFP-2024-089.pdf',
        size: 1024000,
        type: 'application/pdf'
      },
      {
        id: 'att-3',
        name: 'Pricing_Sheet_RFP-2024-089.xlsx',
        size: 512000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    ],
    classification: {
      documentType: 'Tender',
      confidence: 0.94,
      attachments: [
        {
          attachmentId: 'att-2',
          documentType: 'Tender',
          confidence: 0.94
        },
        {
          attachmentId: 'att-3',
          documentType: 'Other',
          confidence: 0.72
        }
      ],
      classifiedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 8000),
      classifiedBy: 'system'
    },
    extractedData: {
      tenderId: 'RFP-2024-089',
      submissionDate: '2024-12-10',
      vendorName: 'Tech Solutions Inc.',
      vendorEmail: 'mchen@procurement.gov',
      category: 'IT Services',
      totalValue: '$450,000',
      validityPeriod: '90 days',
      contactPerson: 'Michael Chen'
    },
    workflows: [
      {
        id: 'wf-2',
        workflowId: 'workflow-tender',
        workflowName: 'Tender Processing Workflow',
        status: 'completed',
        actions: [
          {
            id: 'act-4',
            type: 'extract_data',
            status: 'completed',
            result: { extractedFields: 7 }
          },
          {
            id: 'act-5',
            type: 'create_case',
            status: 'completed',
            result: { caseId: 'case-2024-002' }
          },
          {
            id: 'act-6',
            type: 'notify',
            status: 'completed',
            result: { notified: ['procurement@docsumo.com'] }
          }
        ],
        startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 12000),
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 45000)
      }
    ],
    caseId: 'case-2024-002',
    status: 'read',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: '3',
    accountId: 'acc-1',
    messageId: 'msg-3',
    threadId: 'thread-3',
    from: {
      name: 'James Rodriguez',
      email: 'j.rodriguez@warehouseops.com'
    },
    to: ['accounting@docsumo.com'],
    cc: [],
    bcc: [],
    subject: 'Lumper Receipt - Dock 7 - Dec 10, 2024',
    body: {
      text: 'Attached is the lumper receipt for services rendered at Dock 7 on December 10, 2024.\n\nReceipt #: LR-2024-7842\nAmount: $1,250.00\nHandler: Dock Services LLC\n\nPlease process for payment.\n\nThank you,\nJames Rodriguez\nWarehouse Operations',
      html: '<p>Attached is the lumper receipt for services rendered at <strong>Dock 7</strong> on December 10, 2024.</p><p><strong>Receipt #:</strong> LR-2024-7842<br><strong>Amount:</strong> $1,250.00<br><strong>Handler:</strong> Dock Services LLC</p><p>Please process for payment.</p><p>Thank you,<br>James Rodriguez<br>Warehouse Operations</p>'
    },
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    attachments: [
      {
        id: 'att-4',
        name: 'Lumper_Receipt_LR-2024-7842.pdf',
        size: 128000,
        type: 'application/pdf'
      }
    ],
    classification: {
      documentType: 'LumperReceipt',
      confidence: 0.98,
      attachments: [
        {
          attachmentId: 'att-4',
          documentType: 'LumperReceipt',
          confidence: 0.98
        }
      ],
      classifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6000),
      classifiedBy: 'system'
    },
    extractedData: {
      receiptNumber: 'LR-2024-7842',
      amount: '$1,250.00',
      date: '2024-12-10',
      location: 'Dock 7',
      handler: 'Dock Services LLC',
      handlerContact: 'contact@dockservices.com',
      serviceType: 'Freight Handling',
      hours: 8
    },
    workflows: [
      {
        id: 'wf-3',
        workflowId: 'workflow-lumper',
        workflowName: 'Lumper Receipt Processing',
        status: 'completed',
        actions: [
          {
            id: 'act-7',
            type: 'extract_data',
            status: 'completed',
            result: { extractedFields: 8 }
          },
          {
            id: 'act-8',
            type: 'create_case',
            status: 'completed',
            result: { caseId: 'case-2024-003' }
          },
          {
            id: 'act-9',
            type: 'notify',
            status: 'completed',
            result: { notified: ['accounting@docsumo.com'] }
          }
        ],
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30000)
      }
    ],
    caseId: 'case-2024-003',
    status: 'read',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30000)
  },
  {
    id: '4',
    accountId: 'acc-1',
    messageId: 'msg-4',
    threadId: 'thread-4',
    from: {
      name: 'David Thompson',
      email: 'dthompson@shippingco.com'
    },
    to: ['operations@docsumo.com'],
    cc: [],
    bcc: [],
    subject: 'BOL - Shipment #BL-2024-1289 - URGENT',
    body: {
      text: 'URGENT: Please process this BOL immediately.\n\nShipment #BL-2024-1289\nCarrier: Express Logistics\nOrigin: New York, NY\nDestination: Miami, FL\n\nDelivery is scheduled for tomorrow. Please confirm receipt.\n\nDavid Thompson\nShipping Co.',
      html: '<p><strong>URGENT:</strong> Please process this BOL immediately.</p><p><strong>Shipment #BL-2024-1289</strong><br>Carrier: Express Logistics<br>Origin: New York, NY<br>Destination: Miami, FL</p><p>Delivery is scheduled for tomorrow. Please confirm receipt.</p><p>David Thompson<br>Shipping Co.</p>'
    },
    receivedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    attachments: [
      {
        id: 'att-5',
        name: 'BOL_BL-2024-1289.pdf',
        size: 198000,
        type: 'application/pdf'
      }
    ],
    classification: {
      documentType: 'BOL',
      confidence: 0.92,
      attachments: [
        {
          attachmentId: 'att-5',
          documentType: 'BOL',
          confidence: 0.92
        }
      ],
      classifiedAt: new Date(Date.now() - 30 * 60 * 1000 + 4000),
      classifiedBy: 'system'
    },
    extractedData: {
      carrier: 'Express Logistics',
      shipper: 'Metro Distribution',
      consignee: 'South Florida Warehouse',
      origin: 'New York, NY',
      destination: 'Miami, FL',
      bolNumber: 'BL-2024-1289',
      shipmentDate: '2024-12-11',
      estimatedDelivery: '2024-12-12',
      weight: '8,500 lbs',
      pallets: 12
    },
    workflows: [
      {
        id: 'wf-4',
        workflowId: 'workflow-bol',
        workflowName: 'BOL Processing Workflow',
        status: 'in_progress',
        actions: [
          {
            id: 'act-10',
            type: 'extract_data',
            status: 'completed',
            result: { extractedFields: 8 }
          },
          {
            id: 'act-11',
            type: 'create_case',
            status: 'in_progress'
          },
          {
            id: 'act-12',
            type: 'notify',
            status: 'pending'
          }
        ],
        startedAt: new Date(Date.now() - 30 * 60 * 1000 + 5000)
      }
    ],
    status: 'unread',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '5',
    accountId: 'acc-1',
    messageId: 'msg-5',
    threadId: 'thread-5',
    from: {
      name: 'Lisa Park',
      email: 'lpark@vendorportal.com'
    },
    to: ['tenders@docsumo.com'],
    cc: [],
    bcc: [],
    subject: 'Tender Response - Facilities Management RFP-2024-112',
    body: {
      text: 'Hello,\n\nWe are pleased to submit our tender for Facilities Management Services (RFP-2024-112).\n\nOur proposal covers:\n- Building maintenance\n- Cleaning services\n- Security services\n- Landscaping\n\nPlease review the attached documents.\n\nBest regards,\nLisa Park\nVendor Portal Services',
      html: '<p>Hello,</p><p>We are pleased to submit our tender for <strong>Facilities Management Services (RFP-2024-112)</strong>.</p><p>Our proposal covers:<br>- Building maintenance<br>- Cleaning services<br>- Security services<br>- Landscaping</p><p>Please review the attached documents.</p><p>Best regards,<br>Lisa Park<br>Vendor Portal Services</p>'
    },
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    attachments: [
      {
        id: 'att-6',
        name: 'Tender_RFP-2024-112.pdf',
        size: 768000,
        type: 'application/pdf'
      }
    ],
    classification: {
      documentType: 'Tender',
      confidence: 0.89,
      attachments: [
        {
          attachmentId: 'att-6',
          documentType: 'Tender',
          confidence: 0.89
        }
      ],
      classifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 7000),
      classifiedBy: 'system'
    },
    extractedData: {
      tenderId: 'RFP-2024-112',
      submissionDate: '2024-12-08',
      vendorName: 'Vendor Portal Services',
      vendorEmail: 'lpark@vendorportal.com',
      category: 'Facilities Management',
      totalValue: '$125,000',
      validityPeriod: '120 days',
      contactPerson: 'Lisa Park'
    },
    workflows: [
      {
        id: 'wf-5',
        workflowId: 'workflow-tender',
        workflowName: 'Tender Processing Workflow',
        status: 'completed',
        actions: [
          {
            id: 'act-13',
            type: 'extract_data',
            status: 'completed',
            result: { extractedFields: 7 }
          },
          {
            id: 'act-14',
            type: 'create_case',
            status: 'completed',
            result: { caseId: 'case-2024-004' }
          },
          {
            id: 'act-15',
            type: 'notify',
            status: 'completed',
            result: { notified: ['procurement@docsumo.com'] }
          }
        ],
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10000),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 40000)
      }
    ],
    caseId: 'case-2024-004',
    status: 'read',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 40000),
    isThreadStarter: true
  },
  // Threaded conversation example - Multiple replies with different workflows
  {
    id: '6',
    accountId: 'acc-1',
    messageId: 'msg-6',
    threadId: 'thread-shipment-789',
    from: {
      name: 'Robert Martinez',
      email: 'r.martinez@globalfreight.com'
    },
    to: ['operations@docsumo.com'],
    cc: [],
    bcc: [],
    subject: 'Shipment Update - BOL #BL-2024-789',
    body: {
      text: 'Hello,\n\nPlease find attached the Bill of Lading for shipment BL-2024-789.\n\nShipment Details:\n- Carrier: Global Freight Solutions\n- Origin: Houston, TX\n- Destination: Atlanta, GA\n- Estimated Delivery: December 18, 2024\n\nPlease confirm receipt.\n\nBest regards,\nRobert Martinez',
      html: '<p>Hello,</p><p>Please find attached the Bill of Lading for shipment <strong>BL-2024-789</strong>.</p><p><strong>Shipment Details:</strong><br>- Carrier: Global Freight Solutions<br>- Origin: Houston, TX<br>- Destination: Atlanta, GA<br>- Estimated Delivery: December 18, 2024</p><p>Please confirm receipt.</p><p>Best regards,<br>Robert Martinez</p>'
    },
    receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    attachments: [
      {
        id: 'att-7',
        name: 'BOL_BL-2024-789.pdf',
        size: 312000,
        type: 'application/pdf'
      }
    ],
    classification: {
      documentType: 'BOL',
      confidence: 0.95,
      attachments: [
        {
          attachmentId: 'att-7',
          documentType: 'BOL',
          confidence: 0.95
        }
      ],
      classifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5000),
      classifiedBy: 'system'
    },
    extractedData: {
      carrier: 'Global Freight Solutions',
      shipper: 'Texas Manufacturing Inc.',
      consignee: 'Georgia Distribution Center',
      origin: 'Houston, TX',
      destination: 'Atlanta, GA',
      bolNumber: 'BL-2024-789',
      shipmentDate: '2024-12-11',
      estimatedDelivery: '2024-12-18',
      weight: '22,000 lbs',
      pallets: 35
    },
    workflows: [
      {
        id: 'wf-6',
        workflowId: 'workflow-bol',
        workflowName: 'BOL Processing Workflow',
        status: 'completed',
        actions: [
          {
            id: 'act-16',
            type: 'extract_data',
            status: 'completed',
            result: { extractedFields: 8 }
          },
          {
            id: 'act-17',
            type: 'create_case',
            status: 'completed',
            result: { caseId: 'case-2024-005' }
          },
          {
            id: 'act-18',
            type: 'notify',
            status: 'completed',
            result: { notified: ['ops-team@docsumo.com'] }
          }
        ],
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10000),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35000)
      }
    ],
    caseId: 'case-2024-005',
    status: 'read',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35000),
    isThreadStarter: true
  },
  {
    id: '7',
    accountId: 'acc-1',
    messageId: 'msg-7',
    threadId: 'thread-shipment-789',
    from: {
      name: 'Robert Martinez',
      email: 'r.martinez@globalfreight.com'
    },
    to: ['operations@docsumo.com'],
    cc: ['billing@docsumo.com'],
    bcc: [],
    subject: 'Re: Shipment Update - BOL #BL-2024-789',
    body: {
      text: 'Hi,\n\nFollowing up on the previous email. I also need to submit the lumper receipt for this shipment.\n\nPlease find attached the receipt from the warehouse.\n\nReceipt #: LR-2024-9123\nAmount: $850.00\nLocation: Atlanta Warehouse Dock 3\n\nThanks,\nRobert',
      html: '<p>Hi,</p><p>Following up on the previous email. I also need to submit the <strong>lumper receipt</strong> for this shipment.</p><p>Please find attached the receipt from the warehouse.</p><p><strong>Receipt #:</strong> LR-2024-9123<br><strong>Amount:</strong> $850.00<br><strong>Location:</strong> Atlanta Warehouse Dock 3</p><p>Thanks,<br>Robert</p>'
    },
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    attachments: [
      {
        id: 'att-8',
        name: 'Lumper_Receipt_LR-2024-9123.pdf',
        size: 145000,
        type: 'application/pdf'
      }
    ],
    classification: {
      documentType: 'LumperReceipt',
      confidence: 0.97,
      attachments: [
        {
          attachmentId: 'att-8',
          documentType: 'LumperReceipt',
          confidence: 0.97
        }
      ],
      classifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 6000),
      classifiedBy: 'system'
    },
    extractedData: {
      receiptNumber: 'LR-2024-9123',
      amount: '$850.00',
      date: '2024-12-12',
      location: 'Atlanta Warehouse Dock 3',
      handler: 'Atlanta Logistics Services',
      handlerContact: 'contact@atlantalogistics.com',
      serviceType: 'Freight Handling',
      hours: 6,
      relatedBOL: 'BL-2024-789'
    },
    workflows: [
      {
        id: 'wf-7',
        workflowId: 'workflow-lumper',
        workflowName: 'Lumper Receipt Processing',
        status: 'completed',
        actions: [
          {
            id: 'act-19',
            type: 'extract_data',
            status: 'completed',
            result: { extractedFields: 8 }
          },
          {
            id: 'act-20',
            type: 'create_case',
            status: 'completed',
            result: { caseId: 'case-2024-006' }
          },
          {
            id: 'act-21',
            type: 'notify',
            status: 'completed',
            result: { notified: ['accounting@docsumo.com', 'billing@docsumo.com'] }
          },
          {
            id: 'act-22',
            type: 'api_call',
            status: 'completed',
            result: { linkedToBOL: 'BL-2024-789', caseId: 'case-2024-005' }
          }
        ],
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 10000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 32000)
      }
    ],
    caseId: 'case-2024-006',
    status: 'read',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 32000),
    replyToId: '6'
  },
  {
    id: '8',
    accountId: 'acc-1',
    messageId: 'msg-8',
    threadId: 'thread-shipment-789',
    from: {
      name: 'Operations Team',
      email: 'operations@docsumo.com'
    },
    to: ['r.martinez@globalfreight.com'],
    cc: [],
    bcc: [],
    subject: 'Re: Shipment Update - BOL #BL-2024-789',
    body: {
      text: 'Hi Robert,\n\nThank you for the updates. Both documents have been processed successfully.\n\nBOL BL-2024-789: Case #case-2024-005 - Status: In Transit\nLumper Receipt LR-2024-9123: Case #case-2024-006 - Status: Payment Pending\n\nThe lumper receipt has been linked to the BOL case for tracking.\n\nBest regards,\nOperations Team',
      html: '<p>Hi Robert,</p><p>Thank you for the updates. Both documents have been processed successfully.</p><p><strong>BOL BL-2024-789:</strong> Case #case-2024-005 - Status: In Transit<br><strong>Lumper Receipt LR-2024-9123:</strong> Case #case-2024-006 - Status: Payment Pending</p><p>The lumper receipt has been linked to the BOL case for tracking.</p><p>Best regards,<br>Operations Team</p>'
    },
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    attachments: [],
    classification: {
      documentType: 'Other',
      confidence: 0.65,
      attachments: [],
      classifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 2000),
      classifiedBy: 'system'
    },
    workflows: [
      {
        id: 'wf-8',
        workflowId: 'workflow-reply',
        workflowName: 'Auto-Reply Workflow',
        status: 'completed',
        actions: [
          {
            id: 'act-23',
            type: 'reply',
            status: 'completed',
            result: { sent: true, messageId: 'reply-msg-8' }
          },
          {
            id: 'act-24',
            type: 'notify',
            status: 'completed',
            result: { notified: ['ops-team@docsumo.com'] }
          }
        ],
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 3000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 8000)
      }
    ],
    status: 'read',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 8000),
    replyToId: '7',
    isWorkflowReply: true,
    workflowReplyType: 'confirmation'
  },
  // Workflow auto-reply for BOL thread-1
  {
    id: '9',
    accountId: 'acc-1',
    messageId: 'msg-9',
    threadId: 'thread-1',
    from: {
      name: 'Docsumo Operations',
      email: 'operations@docsumo.com'
    },
    to: ['sarah.johnson@freightlogistics.com'],
    cc: [],
    bcc: [],
    subject: 'Re: Bill of Lading - Shipment #BL-2024-1247',
    body: {
      text: 'Hi Sarah,\n\nThank you for submitting the Bill of Lading for shipment BL-2024-1247.\n\nWe have successfully processed your document:\n✓ Document classified as BOL (96% confidence)\n✓ Data extracted: 8 fields\n✓ Case created: case-2024-001\n✓ Team notified\n\nYou can track the shipment status in your dashboard.\n\nBest regards,\nDocsumo Operations',
      html: '<p>Hi Sarah,</p><p>Thank you for submitting the Bill of Lading for shipment BL-2024-1247.</p><p>We have successfully processed your document:</p><ul><li>✓ Document classified as BOL (96% confidence)</li><li>✓ Data extracted: 8 fields</li><li>✓ Case created: case-2024-001</li><li>✓ Team notified</li></ul><p>You can track the shipment status in your dashboard.</p><p>Best regards,<br>Docsumo Operations</p>'
    },
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
    attachments: [],
    classification: {
      documentType: 'Other',
      confidence: 0.55,
      attachments: [],
      classifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 1000),
      classifiedBy: 'system'
    },
    workflows: [],
    status: 'read',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
    replyToId: '1',
    isWorkflowReply: true,
    workflowReplyType: 'acknowledgment'
  },
  // Workflow auto-reply for Tender thread-2
  {
    id: '10',
    accountId: 'acc-1',
    messageId: 'msg-10',
    threadId: 'thread-2',
    from: {
      name: 'Docsumo Procurement',
      email: 'procurement-bot@docsumo.com'
    },
    to: ['mchen@procurement.gov'],
    cc: ['procurement@docsumo.com'],
    bcc: [],
    subject: 'Re: Tender Submission - IT Services RFP-2024-089',
    body: {
      text: 'Dear Michael,\n\nThank you for your tender submission for RFP-2024-089.\n\nSubmission Status: RECEIVED\n- Tender ID: RFP-2024-089\n- Vendor: Tech Solutions Inc.\n- Total Value: $450,000\n- Case Reference: case-2024-002\n\nOur procurement team will review your submission and contact you within 5 business days.\n\nBest regards,\nDocsumo Procurement System',
      html: '<p>Dear Michael,</p><p>Thank you for your tender submission for RFP-2024-089.</p><p><strong>Submission Status: RECEIVED</strong></p><ul><li>Tender ID: RFP-2024-089</li><li>Vendor: Tech Solutions Inc.</li><li>Total Value: $450,000</li><li>Case Reference: case-2024-002</li></ul><p>Our procurement team will review your submission and contact you within 5 business days.</p><p>Best regards,<br>Docsumo Procurement System</p>'
    },
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 45 * 60 * 1000),
    attachments: [],
    classification: {
      documentType: 'Other',
      confidence: 0.50,
      attachments: [],
      classifiedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 45 * 60 * 1000 + 1000),
      classifiedBy: 'system'
    },
    workflows: [],
    status: 'read',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 45 * 60 * 1000),
    replyToId: '2',
    isWorkflowReply: true,
    workflowReplyType: 'confirmation'
  },
  // Request for more info - workflow reply for thread-4
  {
    id: '11',
    accountId: 'acc-1',
    messageId: 'msg-11',
    threadId: 'thread-4',
    from: {
      name: 'Docsumo Verification',
      email: 'verify@docsumo.com'
    },
    to: ['finance@transportsolutions.net'],
    cc: [],
    bcc: [],
    subject: 'Re: Invoice & BOL - Combined Shipment Package',
    body: {
      text: 'Hello,\n\nWe have received your combined shipment package. However, we noticed some discrepancies:\n\n⚠️ Action Required:\n- The BOL weight (8,500 lbs) does not match the invoice weight (8,750 lbs)\n- Please provide a corrected document or clarification\n\nCase Reference: case-2024-004\nDocument ID: INV-2024-5678\n\nPlease reply to this email with the corrected information.\n\nThank you,\nDocsumo Verification Team',
      html: '<p>Hello,</p><p>We have received your combined shipment package. However, we noticed some discrepancies:</p><p><strong>⚠️ Action Required:</strong></p><ul><li>The BOL weight (8,500 lbs) does not match the invoice weight (8,750 lbs)</li><li>Please provide a corrected document or clarification</li></ul><p>Case Reference: case-2024-004<br>Document ID: INV-2024-5678</p><p>Please reply to this email with the corrected information.</p><p>Thank you,<br>Docsumo Verification Team</p>'
    },
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    attachments: [],
    classification: {
      documentType: 'Other',
      confidence: 0.45,
      attachments: [],
      classifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 1000),
      classifiedBy: 'system'
    },
    workflows: [
      {
        id: 'wf-11',
        workflowId: 'workflow-request-info',
        workflowName: 'Request Information Workflow',
        status: 'completed',
        actions: [
          {
            id: 'act-30',
            type: 'reply',
            status: 'completed',
            result: { sent: true, templateUsed: 'discrepancy_notice' }
          }
        ],
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 5000)
      }
    ],
    status: 'read',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 5000),
    replyToId: '4',
    isWorkflowReply: true,
    workflowReplyType: 'request_info'
  }
]

export function useEmailData() {
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [filter, setFilter] = useState<{
    classification?: DocumentType
    status?: EmailStatus
    search?: string
  }>({})

  const filteredEmails = emails.filter((email) => {
    if (filter.classification && email.classification?.documentType !== filter.classification) {
      return false
    }
    if (filter.status && email.status !== filter.status) {
      return false
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      return (
        email.subject.toLowerCase().includes(searchLower) ||
        email.from.name.toLowerCase().includes(searchLower) ||
        email.from.email.toLowerCase().includes(searchLower) ||
        email.body.text.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const markAsRead = (emailId: string) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === emailId ? { ...email, status: 'read' as EmailStatus } : email
      )
    )
  }

  const getEmailStats = () => {
    const total = emails.length
    const unread = emails.filter((e) => e.status === 'unread').length
    const byClassification = {
      BOL: emails.filter((e) => e.classification?.documentType === 'BOL').length,
      Tender: emails.filter((e) => e.classification?.documentType === 'Tender').length,
      LumperReceipt: emails.filter((e) => e.classification?.documentType === 'LumperReceipt').length,
      Other: emails.filter((e) => e.classification?.documentType === 'Other' || !e.classification).length,
    }
    return { total, unread, byClassification }
  }

  // Group emails by thread
  const getThreads = (): EmailThread[] => {
    const threadMap = new Map<string, Email[]>()
    
    // Use all emails for threading, but filter display
    filteredEmails.forEach(email => {
      if (!threadMap.has(email.threadId)) {
        threadMap.set(email.threadId, [])
      }
      threadMap.get(email.threadId)!.push(email)
    })
    
    return Array.from(threadMap.entries()).map(([threadId, threadEmails]) => {
      const sorted = threadEmails.sort((a, b) => 
        a.receivedAt.getTime() - b.receivedAt.getTime()
      )
      const latestEmail = sorted[sorted.length - 1]
      const unreadCount = sorted.filter(e => e.status === 'unread').length
      
      return {
        threadId,
        subject: latestEmail.subject,
        emails: sorted,
        latestEmail,
        unreadCount,
        totalEmails: sorted.length
      }
    }).sort((a, b) => 
      b.latestEmail.receivedAt.getTime() - a.latestEmail.receivedAt.getTime()
    )
  }

  const getThreadEmails = (threadId: string): Email[] => {
    // Return all emails in thread, not just filtered ones
    return emails.filter(e => e.threadId === threadId)
      .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime())
  }

  return {
    emails: filteredEmails,
    threads: getThreads(),
    selectedEmail,
    setSelectedEmail,
    selectedThread: selectedThreadId,
    setSelectedThread: setSelectedThreadId,
    getThreadEmails,
    filter,
    setFilter,
    markAsRead,
    stats: getEmailStats(),
  }
}

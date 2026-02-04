# **Complete Brevet Capital \- Docsumo Document Processing Workflow**

## **Business Context**

Brevet Capital is a direct lending platform that processes loan applications through a multi-stage approval process. They are implementing Docsumo to automate their quality control document validation process, which is currently handled manually by a third party.

## **Overall Process Flow**

### **Current State**

1. **Document Receipt**: Underwriters organize documents by number and name in Box  
2. **Document Storage**: Documents are shared via Salesforce through Box integration  
3. **Manual QC**: Third-party vendor manually validates documents according to credit policies  
4. **Approval Chain**: Documents go through quality control → approval → underwriter → closing

### **Target State with Docsumo**

Replace manual QC process with automated document extraction and validation using Docsumo platform.

## **Implementation Phases**

### **Phase 1: Pre-Approval Documents (13 documents)**

**Timeline**: 2-4 weeks **Documents to Process**:

1. Radium Application  
2. R\&D Comfort Letter  
3. Tax Agent Comfort Letter  
4. Bank Statement/Account Verification  
5. Advanced Finding Certificate (uncommon, may skip initially)  
6. Equifax Report  
7. Green ID Report  
8. Beneficial Ownership Report  
9. Business Activity Statement  
10. Integrated Client Account  
11. Prior Tax Return  
12. PPSR Report  
13. Office Industry Report

### **Phase 2: Closing Documents (17 additional documents)**

**Timeline**: Overlapping with Phase 1 UAT testing **Purpose**: Proof of existence validation for tokens, receipts, and supporting documents **Focus**: Verify documents exist and numbers align across documents

## **Technical Workflow**

### **Document Ingestion**

**Current POC Approach**:

* Manual upload of document batches (12-13 documents per case)  
* Documents organized in folders within Docsumo platform  
* Auto-classification enabled to categorize document types

**Future State**:

* Direct integration from Box to Docsumo  
* Potential Salesforce integration  
* Automated document ingestion

### **Processing Steps**

1. **Upload**: Documents uploaded to Docsumo (manually during POC)  
2. **Auto-Classification**: System automatically identifies document types  
3. **Data Extraction**: Extract specified fields from each document type  
4. **Validation Engine**: Run cross-document validation checks  
5. **Results Review**: Present validation results in unified dashboard  
6. **Output Generation**: Provide summarized validation report

## **Key Validation Requirements**

### **Cross-Document Validations**

* **Entity Name Consistency**: Verify company name matches across all documents (e.g., "Australian Bay Lobsters Limited")  
* **Australian Business Number (ABN)**: Recurring number validation across multiple documents  
* **Director Information**: Verify director names and roles consistency  
* **Financial Figures**: Cross-reference amounts between documents (e.g., R\&D expenditure, tax refunds)  
* **Date Validations**: Ensure documents are within acceptable timeframes (30-60 days)

### **Document-Specific Checks**

#### **Radium Application**

* Extract company details, directors, business address  
* Capture ABN, industry classification

#### **R\&D Comfort Letter**

* Verify financial advisor (e.g., Deloitte, EY)  
* Cross-check R\&D expenditure amounts  
* Validate document freshness (\<60 days)

#### **Tax Agent Comfort Letter**

* Confirm good standing with Australian Tax Office  
* Verify no outstanding liabilities or audits  
* Check tax return compliance status

#### **Equifax Report**

* Company credit score \>510  
* Director credit scores \>510 for all directors  
* Industry sector risk assessment  
* No adverse information for directors

#### **Financial Documents**

* No overdue payments  
* No outstanding balances  
* Income verification across tax documents

## **Output Requirements**

### **Validation Dashboard**

* Unified view showing all validation results  
* Pass/fail indicators for each check  
* Flagged items requiring attention  
* Ability to drill down into specific validation failures

### **Reporting Options**

1. **Summarized Report**: Concise validation results with pass/fail indicators  
2. **Individual Document Outputs**: Detailed extraction results per document  
3. **Exception Reports**: Items requiring manual review

### **Distribution**

* Email notifications for completed validations  
* Integration with existing workflows  
* Export capabilities for audit trails

## **Communication & Project Management**

### **Team Structure**

**Docsumo Team**:

* Abhishek: Business lead and primary contact  
* Vishal: Solution engineering and implementation lead  
* Manan: Solution engineer supporting implementation  
* Aniket: Engineering lead for technical questions

**Brevet Team**:

* Aaron: Primary point of contact  
* Alexander: Secondary contact (CC on all communications)  
* Michael: Include on demos and walkthroughs  
* David: Business lead (approval authority)

### **Communication Channels**

* Weekly/bi-weekly sync meetings  
* Microsoft Teams channel for ongoing communication  
* Email for formal documentation and contracts  
* Dedicated calls for requirements clarification

## **Implementation Timeline**

### **Week 1-2: Setup & Analysis**

* Requirements gathering and validation  
* Document type configuration  
* Field extraction setup  
* Initial validation rule creation

### **Week 2-3: Implementation**

* Complete document type setup for Phase 1  
* Configure all validation rules  
* Integration testing  
* System configuration

### **Week 3-4: User Acceptance Testing (UAT)**

* Client testing with real documents  
* Feedback collection and issue resolution  
* Refinement of validation rules  
* Performance optimization

### **Week 4+: Production Readiness**

* Final validation and sign-off  
* Production deployment  
* Phase 2 planning and overlap

## **Success Criteria**

### **Functional Requirements**

* Accurate extraction of all specified fields  
* Reliable cross-document validation  
* Intuitive validation results presentation  
* Minimal false positives/negatives

### **Performance Requirements**

* Processing time suitable for business needs  
* High accuracy rates (\>95% for critical fields)  
* Scalable to handle expected document volumes  
* Reliable auto-classification

### **Business Value**

* Reduced manual processing time  
* Improved validation consistency  
* Enhanced audit trail and compliance  
* Scalable quality control process  
* Cost reduction vs. third-party manual processing

## **Risk Considerations**

### **Technical Risks**

* Complex document variations across clients  
* Field extraction accuracy challenges  
* Integration complexity with existing systems

### **Business Risks**

* Change management for new process  
* Dependency on Docsumo platform reliability  
* Training requirements for end users

### **Mitigation Strategies**

* Phased implementation approach  
* Extensive testing with real documents  
* Regular communication and feedback loops  
* Fallback to manual processes if needed  
* Clear documentation and training materials


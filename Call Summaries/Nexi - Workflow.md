## **Current Process (Before Docsumo)**

The client receives loan applications via a specific email address (submissions@\[company\].com) from brokers. These emails contain:

* Loan application forms  
* Bank statements (minimum 3 months required)  
* Other supporting documents

They forward these to Salesforce and another processing system (currently using a vendor called "Coin"). The system processes files and sends webhooks with unique IDs back to them.

## **New Workflow with Docsumo**

**1\. Email Intake**

* Brokers send submissions to a designated group email  
* Emails are forwarded simultaneously to both Salesforce and Docsumo  
* Subject line and sender email identify the deal (not just sender, as one broker can have multiple deals)

**2\. Case/Folder Creation**

* Docsumo receives the email and creates a folder/case  
* Folder name uses the complete email subject line  
* Docsumo assigns a unique case ID  
* All files from that email are placed in this folder

**3\. Document Classification & Processing**

* Auto-classification identifies document types (loan application, bank statements, etc.)  
* **Loan applications** are processed immediately  
* **Bank statements** are stored but NOT processed initially (to avoid duplicate processing costs)

**4\. Initial Webhook \- Loan Application**

* Once the loan application is processed, Docsumo sends a webhook  
* Webhook contains:  
  * Case ID  
  * Document type  
  * Extracted data from loan application  
  * Subject line and sender information  
  * Link to review/edit interface (iframe capability)

**5\. Client Review & Decision**

* Client receives webhook and stores case information in their system  
* They review if they have sufficient bank statements (at least 3 months)  
* Check for duplicates (same merchant from different brokers)

**6\. Bank Statement Processing Request**

* When ready, client sends API request to Docsumo with the case ID  
* This triggers processing of all bank statements in that folder together

**7\. Bank Analytics Webhook**

* Docsumo processes all 3+ bank statements collectively  
* Generates analytics including:  
  * Summary data (NSF, ODR, deposits, debits, balances)  
  * MCA transactions (specific merchant cash advances from their list)  
  * Recurring payment transactions  
  * Frequency analysis  
  * Non-revenue amount categorization  
* Sends comprehensive webhook with all analytics in single JSON

**8\. Follow-up/Additional Documents**

* If additional bank statements needed, broker replies to original email  
* If subject line stays the same, files added to existing case/folder  
* If subject changes (due to FW: RE: prefixes), may create new case (edge case to monitor)

**9\. Quality Checks**

* System performs validation (opening/closing balance matching, transaction reconciliation)  
* If extraction issues occur, webhook includes error status  
* Client can access iframe link to manually review/fix problematic documents

**10\. Data Integration**

* Client receives structured JSON matching their format requirements  
* Data flows into Salesforce and their processing systems  
* Unique case ID maintains link between all documents and analytics

## 

## 

## 

## **Key Features**

* **Duplicate Prevention**: Bank statements only processed once per merchant, even if submitted by multiple brokers  
* **Flexible Webhooks**: Client can configure when to receive webhooks (on review, approval, case creation)  
* **Retry Logic**: Failed webhooks retry 3 times before marking as failed  
* **API Fallback**: Client can pull case data anytime using case ID if webhooks fail  
* **MCA Tracking**: Client provides list of MCA vendors (updateable via API or CSV)  
* **Review Interface**: Embedded iframe option for manual document review when needed


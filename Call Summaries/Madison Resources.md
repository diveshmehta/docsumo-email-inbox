# Customer Context (Consolidated Summary)

## **Customer Context (Consolidated Summary)**

PDF Presentation with use case \- [https://drive.google.com/file/d/1u\_xLPe6kcYhVH8bMIjZjX35N24msBtl3/view?usp=drive\_link](https://drive.google.com/file/d/1u_xLPe6kcYhVH8bMIjZjX35N24msBtl3/view?usp=drive_link)

* **Who they are**  
   Madison Resources is a US-based funding and back-office provider for staffing agencies. They run payroll and invoicing for their staffing clients and advance cash by purchasing invoices (i.e., they take on AR risk).  
   *(22 October Madison Resources \+ Docsumo \_ Sync (1).txt – 11:14–12:14)*

* **Core workflow & risk**  
   Their back-office team validates each invoice against supporting timecards before sending it out, because Madison has already funded the invoice and must be sure hours and approvals are correct to avoid chargebacks and bad debt.  
   *(22 October – 27:29–30:43)*

* **Volumes & scale (approx.)**

  * Around 3,000–3,600 invoices per week, depending on how they define the count in different conversations.  
     *(22 October – 04:24 & 22:28–22:29)*

  * About 150,000+ invoice validations (“cases”) per year; 150k is described as a light estimate.  
     *(22 October – 06:31–06:47)*

  * Earlier estimate of 1,500+ invoices per week and 20k–100k pages per week including invoices and timecards, highlighting big variability.  
     *(16 September – 50:29–51:42)*

* **Teams & clients**

  * Roughly 140 client staffing agencies.  
     *(15 October – 08:38–08:43)*

  * Around 10–12 payroll specialists and 10–12 billing specialists, each working a subset of clients.  
     *(15 October – 08:38–08:48)*

* **What they want from Docsumo**

  * Automate invoice–timecard matching/validation at scale so billers don’t manually match every invoice and timecard.  
     *(22 October – 29:31–29:53; 15 October – 01:52–02:10)*

  * Support custom business rules (e.g., customer name present, approver signature present, weekend rules) on top of basic hours/rates checks.  
     *(15 October – 24:26–25:48)*

  * Scale without adding headcount, and ideally be able to grow without hiring more billing staff.  
     *(22 October – 32:10–32:24)*

  * Get invoices out faster and more accurately, especially as they move to 30-day pricing where clients expect quick billing.  
     *(22 October – 32:24–32:28)*

* **Key constraints**

  * Huge variation in document formats and page counts (timecards can be 1 person per page or 20–40 people per page; cases can range from 3 to 100 pages).  
     *(22 October – 07:27–08:23; 21:37–22:00)*

  * No centralised timecard repository today – timecards are emailed directly to payroll/billing staff or pulled from multiple VMS portals.  
     *(15 October – 40:52–41:34)*

  * Legacy/proprietary internal systems for payroll and invoicing; validation happens mostly outside those systems on local machines.  
     *(22 October – 27:29–27:35; 15 October – 42:40–43:15)*

  * They are price-sensitive and need predictable pricing (case vs page pricing discussion is a big thread).  
     *(22 October – 09:59–13:54; 20 November – 02:52–03:52)*

---

# Current Process (AS-IS) – Step-by-Step

## **Current Process (AS-IS) – Step-by-Step**

### **1\. Upstream data & invoice generation**

**Persona:** Payroll specialists and internal systems

* **What happens**

  * Staffing clients send employee and customer master data plus hours worked to Madison via:

    * Uploaders

    * Madison’s online payroll processing system

    * Madison’s own online timesheets

  * Madison’s systems use this data to process paychecks.

  * After payroll, Madison generates invoices to bill end-customers for hours worked.

* **Inputs**

  * Hours/time data from clients (via uploaders, online timesheets, other input channels).

  * Employee and customer master data.  
     *(15 October – 40:52–41:19)*

* **Outputs**

  * Paychecks.

  * Invoices stored in Madison’s internal billing systems.  
     *(15 October – 40:52–41:34)*

### **2\. Timecard / backup collection (Variant A: Email)**

**Persona:** Payroll specialists / Billing specialists

* **What happens**

  * Clients email timecard backups (PDFs, images, Excel, etc.) directly to their Madison payroll or billing contact. There is no central mailbox for timecards today.  
     *(15 October – 08:38–08:39; 40:52–41:34)*

* **Inputs**

  * Timecards as email attachments from staffing clients.

* **Outputs**

  * Timecards stored in individual email inboxes and then locally saved by each specialist (e.g., on desktops/network drives).  
     *(22 October – 27:29–29:05)*

### **3\. Timecard / backup collection (Variant B: Portals / VMS)**

**Persona:** Billing specialists

* **What happens**

  * For some customers, instead of email, timecard data lives in VMS/portals (e.g., Beeline, Fieldglass).

  * Madison billing staff log into those portals, run reports or exports, and download timecard data or timesheet exports.  
     *(15 October – 40:52–41:19)*

* **Inputs**

  * Access to client VMS/portals (Beeline, Fieldglass, etc.).

* **Outputs**

  * Downloaded timecard reports/files on local machines or shared drives.

### **4\. Manual invoice–timecard matching & validation**

**Persona:** Billing specialists

* **What happens**

  * Billing team takes invoices generated by the payroll system and gathers the backup timecards from email or portals.  
     *(22 October – 27:29–28:06)*

  * They manually match each invoice to its corresponding timecards, checking:

    * Hours on invoice vs hours on timecards

    * Week ending dates

    * Employee names

    * Customer information

    * Sometimes approvals/signatures (via visual check)  
       *(15 October – 24:26–25:48)*

  * This is done on local machines using tools like Adobe and sometimes printing and checking off on paper – described explicitly as “manual old school.”  
     *(15 October – 42:40–43:15)*

  * For some large customers, per-customer validation time can be around 12 hours, while smaller customers can be 2–3 hours.  
     *(14 October – 03:30–04:16)*

* **Inputs**

  * Invoices (PDF/print from internal system).

  * Timecards and timesheet exports (email attachments, VMS reports).

* **Outputs**

  * Manually validated “invoice \+ timecard” packages.

  * Informal notes/checklists in each specialist’s workflow (not centralised).

### **5\. Handling validation errors (billing issues)**

**Persona:** Billing specialists

* **What happens**

  * When they find issues (for example, hours don’t match; timecards missing), billers:

    * Log issues in an internal system.

    * That system generates “billing issues reports” sent back to the client, asking for corrections.

    * Affected invoices are held and not sent out until the client fixes the issue.  
       *(22 October – 29:31–29:53)*

* **Inputs**

  * Detected mismatches or missing backup during manual review.

* **Outputs**

  * Billing issues records in internal system.

  * Billing issue reports emailed to clients.

  * Delayed invoices waiting on client corrections.

### **6\. Final invoice packaging, sending & archiving**

**Persona:** Billing specialists

* **What happens when validation passes**

  * Billers attach the appropriate timecard backup to each invoice (when customers require it).

  * Invoices (now with backup) are emailed out to end-customers or placed into customer-requested channels.  
     *(15 October – 40:52–42:08)*

  * They save the invoice \+ timecard PDF packages on network drives and also save email correspondence with customers for their records.  
     *(22 October – 27:29–29:05)*

* **Inputs**

  * Validated invoice \+ timecards bundle.

* **Outputs**

  * Final invoice packages delivered to customers.

  * Archived copies on network drives plus email archives.

### **7\. Cash application & downstream impact**

**Persona:** AR / cash application team (implied)

* **What happens**

  * When payments come back:

    * If payment exactly matches the invoice, it can auto-post in their systems.

    * If not, staff spend time investigating, and issues often trace back to inaccurate invoices or unclear backup.  
       *(22 October – 30:43–31:36)*

* **Inputs**

  * Customer payments.

  * Invoice \+ timecard backup.

* **Outputs**

  * Posted payments or exception cases for manual investigation

# ools, Manual Steps, and Pain Points

## **ools, Manual Steps, and Pain Points**

### **Tools & Systems in Use (Today)**

* **Madison’s legacy/proprietary systems** for:

  * Payroll processing

  * Invoice generation  
     *(22 October – 27:29–27:35; 15 October – 40:52–41:19)*

* **Staffing client systems**

  * ATS/CRMs feeding hours and employee data into Madison  
     *(22 October – 27:29–27:35)*

  * VMS/timecard portals such as Beeline and Fieldglass  
     *(15 October – 40:52–41:19)*

* **Communication & storage**

  * Email (for timecards and billing issues)  
     *(15 October – 40:52–41:34)*

  * Local machines and network drives for storing invoice \+ timecard packages  
     *(22 October – 27:29–29:05)*

  * Internal “billing issues” system for logging errors and generating billing issue reports  
     *(22 October – 29:31–29:53)*

* **Desktop tools**

  * PDF viewer/editor (e.g., Adobe) and physical printouts used in manual checking  
     *(15 October – 42:40–43:15)*

### **Manual Steps (Key Examples)**

* Collecting timecards individually via email and portals for each client; no centralised capture  
   *(15 October – 40:52–41:34)*

* Visually matching invoices to timecards (hours, dates, employees) one by one  
   *(15 October – 24:26–25:48; 42:40–43:15)*

* Manually logging discrepancies into an internal issues system and writing billing issue reports  
   *(22 October – 29:31–29:53)*

* Manually assembling invoice \+ backup PDFs, emailing them out, and storing them in network folders  
   *(22 October – 27:29–29:05; 15 October – 40:52–42:08)*

* Manual cash-application exception handling when payments don’t match invoices, often due to underlying validation issues  
   *(22 October – 30:43–31:36)*

### **Pain Points, Bottlenecks, Risks**

1. **High manual workload per client**

   * Some key customers require around 12 hours of manual validation per cycle; others 2–3 hours.  
      *(14 October – 03:30–04:16)*

   * This scales linearly with volume and client growth.

2. **Volume and variability**

   * 150k+ invoice validations per year with highly variable timecard formats and page counts (cases of 3–100 pages).  
      *(22 October – 06:31–06:47; 21:37–22:00)*

   * Earlier page estimates of 20k–100k pages per week underline the uncertainty and difficulty in planning.  
      *(16 September – 50:29–51:42)*

3. **Fragmented inputs and no central repository**

   * Timecards go to different payroll/billing specialists or are pulled from portals; no single system holds all raw documents.  
      *(15 October – 08:38–08:43; 40:52–41:34)*

   * This makes automation and monitoring difficult.

4. **Validation is judgment-based and hard to audit**

   * Rushabh calls out a broader pattern: when checks aren’t codified into a system/checklist, customers often think checks are happening but can’t prove it, and missed signatures/conditions slip through.  
      *(22 October – 32:59–35:03)*

   * Assumption: Madison’s current validation is similarly reliant on each biller’s judgment rather than a standardised, trackable checklist.

5. **Cashflow and risk exposure**

   * If validation finds issues, invoices sit in limbo until corrected, delaying when they send them and when they get paid.  
      *(22 October – 29:31–29:53)*

   * Because Madison funds invoices upfront, incorrect or unsupported invoices increase risk, and chargebacks are difficult if clients can’t pay.  
      *(22 October – 30:43–31:57)*

6. **Scaling vs headcount**

   * Alden explicitly says they want to scale without hiring more staff, and that not scaling could lead to head cuts instead.  
      *(22 October – 32:10–32:24)*

   * Automation is seen as necessary to avoid both uncontrolled hiring and layoffs.

7. **Complex business rules**

   * They need to check things like:

     * Customer name present on timecard

     * Some form of client approval (signature or email)

   * These rules are harder to enforce consistently with purely manual, unstructured review.  
      *(15 October – 24:26–25:48)*

# Desired Future Process with Docsumo (TO-BE)

## **![][image1]**

Flow \- [https://drive.google.com/file/d/1QdfMC\_fZWCCbOrTc0wOn1HEJ2RGGtDU6/view?usp=drive\_link](https://drive.google.com/file/d/1QdfMC_fZWCCbOrTc0wOn1HEJ2RGGtDU6/view?usp=drive_link)  
USe Case \- [https://drive.google.com/file/d/1u\_xLPe6kcYhVH8bMIjZjX35N24msBtl3/view?usp=drive\_link](https://drive.google.com/file/d/1u_xLPe6kcYhVH8bMIjZjX35N24msBtl3/view?usp=drive_link)

## **Desired Future Process with Docsumo (TO-BE)**

*(Anything labelled “assumption” is inferred from context and platform capabilities rather than explicitly requested.)*

### **1\. Centralised document ingestion**

**Automated/assisted by Docsumo**

* **Docsumo ingestion options shown**

  * Auto-import via API from Madison’s front-end systems

  * Email ingestion: attachments to a specific email address flow directly into Docsumo

  * Integrations with SharePoint, Google Drive, S3 as watched folders  
     *(15 October – 06:51–07:24)*

* **Madison-specific expectations**

  * Alden notes they currently have 140 clients and no centralised timecard mailbox; timecards go directly to payroll/billing.  
     *(15 October – 08:38–08:43)*

  * They’d likely either:

    * Ask clients to CC/forward timecards to a Docsumo address, or

    * Set up internal forwarding rules so inbound timecard emails reach Docsumo automatically

    * Mike notes this could be tedious but doable.  
       *(15 October – 08:38–08:57)*

### **2\. Auto-split and classify invoices and timecards**

**Automated by Docsumo**

* Mixed PDFs (invoice \+ timecard) are auto-split and classified using AI:

  * Prompt like “document contains invoices and timecard reports; split when document type changes” is used today.  
     *(16 September – 19:13–19:55)*

  * System separates into “Invoice” bucket vs “Timecard” bucket per case.  
     *(22 September – 02:22–03:27)*

* Result: Each incoming document ends up tagged as an invoice or timecard and grouped per case automatically, instead of manual page splitting and sorting.

### **3\. Data extraction from invoices and timecards**

**Automated by Docsumo; humans handle low-confidence cases**

* For invoices and timecards, Docsumo:

  * Extracts line-item fields: employee name, week ending, hours, rate, invoice total, etc.  
     *(16 September – 21:36–22:37)*

  * Handles non-perfect tables and many handwritten cases (with caveats).  
     *(16 September – 32:53–38:41)*

  * Provides a review screen with 2-way mapping so operators can click a value and see its source in the document.  
     *(16 September – 19:55–21:36)*

* Confidence handling:

  * If extraction confidence is at or above roughly 80%, document can bypass human review.

  * If it’s lower, document is flagged and queued for human review, who can correct and teach the system.  
     *(16 September – 22:37–31:21)*

### **4\. Case-based validation engine**

**Core automation by Docsumo plus human review**

* Each case equals one invoice plus its associated timecards.  
   *(22 September – 03:27–03:55; 22 October – 05:55–06:47)*

* Validation compares extracted fields from both sides and outputs Pass / Fail / Needs Review for each rule.  
   *(22 September – 04:47–07:32)*

* **Examples of validations**

  * Week ending date on invoice vs timecard

  * Hours on invoice vs hours on timecard

  * Derived calculations (for example, compute hours from in/out times rather than trusting a total field)  
     *(16 September – 34:52–37:32; 22 September – 04:47–07:32)*

* **Custom business rules Madison cares about**

  * Timecard must list customer name

  * Timecard must show customer approval (signature or email)

  * Other client-specific requirements  
     *(15 October – 24:26–25:48)*

  * Docsumo shows these rules can be modelled as extra fields and validations.

* **Human role**

  * Billing staff review only Needs Review / Fail validations, fix data or judgments, and re-run validations within the platform instead of doing everything outside in Adobe and spreadsheets.  
     *(22 September – 04:47–07:32; 15 October – 24:05–24:26)*

### **5\. Case management and work allocation**

**Automated tracking by Docsumo; human review and decisions**

* Each validation becomes a case with status (e.g., Open, Needs Review, Resolved).

* Case list can show only cases that:

  * Failed specific validations (e.g., missing signature)

  * Have low extraction confidence

* Madison wants the workflow to align with how billing specialists own subsets of clients, so they likely need per-user or per-client views.  
   *(15 October – 39:23–40:20)*

Assumption: Per-client scoping and “billers see only their clients” will be implemented even though it’s more implied than explicitly confirmed.

### **6\. Output back to Madison and invoice dispatch**

**Docsumo assists; Madison systems still send invoices**

* Once validations pass:

  * Validated data and pass/fail flags are exported out of Docsumo (CSV/API) to Madison’s internal systems or used to drive next actions.  
     (Export mechanisms implied by platform, not fully detailed in calls – assumption.)

  * Invoices can be released faster because validation is already codified and tracked. Alden explicitly ties faster validation to getting invoices out quickly, especially under 30-day rate pricing.  
     *(22 October – 32:10–32:28)*

  * Madison still attaches appropriate timecard backup and sends invoices out, but the preparation should be substantially auto-assembled.  
     *(15 October – 40:52–42:08; 22 October – 29:31–29:53)*

* Over time, they’d expect:

  * Fewer manual touches per case

  * Clear audit trail of which validations were run and what passed or failed

### **7\. Definition of success (from Madison’s side)**

* **Operational**

  * Significant reduction in manual validation hours per client (e.g., 12-hour clients dropping substantially).  
     *(14 October – 03:30–04:16)*

  * Ability to scale volume without hiring more billing staff, and avoiding layoffs due to inability to scale.  
     *(22 October – 32:10–32:24)*

* **Risk and compliance**

  * Confidence that timecard backup, customer names, and approvals are consistently checked and traceable.  
     *(15 October – 24:26–25:48; 22 October – 32:59–35:03)*

* **Financial**

  * Faster invoice release, leading to better cash cycles and fewer chargebacks.  
     *(22 October – 29:53–30:43; 32:10–32:28)*

  * Pricing model that tracks usage reasonably (cases vs pages) and is forecastable.  
     *(22 October – 09:59–13:54; 20 November – 02:52–03:52)*

---

## **Customer Journey: Before vs After Docsumo (Table)**

*(Plain text table, same content as before)*

**Stage 1 – Hours and master data ingestion**

* Before: Clients send employee and hours data into Madison via uploaders, online timesheets, etc.; Madison systems create paychecks and invoices.  
   *(15 October – 40:52–41:19)*

* After: Same upstream flow; Docsumo plugs in after invoices and timecards exist (assumption).

* Value/Impact: Minimal change; avoids disturbing proven payroll and invoice generation stack.

**Stage 2 – Timecard collection**

* Before: Timecards emailed individually to payroll/billing or pulled manually from VMS portals like Beeline/Fieldglass; no central repository.  
   *(15 October – 40:52–41:34)*

* After: Clients CC/forward timecards to a Docsumo email, or documents flow via integrations (SharePoint/Drive/S3/API) into a central Docsumo inbox.  
   *(15 October – 06:51–08:39)*

* Value/Impact: Reduced hunting across inboxes/portals; easier monitoring of what has and hasn’t arrived.

**Stage 3 – Splitting and sorting documents**

* Before: Billers manually split multi-doc PDFs and decide which pages are invoices vs timecards, heavily reliant on Adobe and local folders.  
   *(15 October – 42:40–43:15)*

* After: Docsumo auto-splits and classifies pages into Invoice and Timecard buckets using AI prompts.  
   *(16 September – 19:13–19:55; 22 September – 02:22–03:27)*

* Value/Impact: Saves time; reduces errors in mis-sorting pages; standardises the first step.

**Stage 4 – Data extraction**

* Before: Billers read values (hours, rates, employees, dates) directly off PDFs or printouts and manually key/reconcile them.  
   *(15 October – 42:40–43:15)*

* After: Docsumo extracts structured fields from invoices and timecards, including line items and many handwritten cases, with a 2-way mapped review screen.  
   *(16 September – 19:55–22:37; 32:53–38:41)*

* Value/Impact: Fewer data entry errors; faster review; easier training for new staff.

**Stage 5 – Validation logic**

* Before: Validation is fully manual and judgment-based; each biller checks what they think is important; hard to prove what was checked or missed.  
   *(22 October – 32:59–35:03)*

* After: Formal validation rules per case (hours match, dates match, business rules like customer name and approval). System outputs Pass/Fail/Needs Review with context.  
   *(22 September – 04:47–07:32; 15 October – 24:26–25:48)*

* Value/Impact: Standardised rules, traceable checks, better auditability and risk control.

**Stage 6 – Work allocation**

* Before: Billers work from personal inboxes and local documents; no centralised case list; management visibility is limited.  
   *(15 October – 40:52–43:15)*

* After: Case management UI shows all cases, their validation status, and which need human review; can align views with each biller’s client set.  
   *(22 September – 03:27–03:55; 15 October – 39:23–40:20)*

* Value/Impact: Clear queues, prioritisation, and reporting; easier to manage SLAs and workloads.

**Stage 7 – Handling exceptions**

* Before: When hours don’t match or timecards are missing, billers log issues in an internal system, generate billing issue reports, and wait for client corrections; invoices sit and age.  
   *(22 October – 29:31–29:53)*

* After: Failures/needs review are flagged within Docsumo; staff see exactly which fields/rules failed and can quickly fix or generate a structured issue back to clients. (Structured issue generation inferred – assumption.)

* Value/Impact: Faster resolution of issues; lower invoice aging; more consistent reason codes.

**Stage 8 – Invoice packaging and sending**

* Before: Once validated manually, invoice \+ timecard are combined, emailed to customers, and stored on network drives; process is slow and people-intensive.  
   *(15 October – 40:52–42:08; 22 October – 27:29–29:05)*

* After: “Pass” cases can be auto-packaged with backup from Docsumo, then pushed into Madison’s sending mechanism; staff focus on edge cases (implementation detail partially assumed).

* Value/Impact: Faster invoice release, especially beneficial for 30-day rate pricing; improved cashflow.  
   *(22 October – 32:10–32:28)*

**Stage 9 – Cash application and disputes**

* Before: Inaccurate invoices cause payment mismatches; staff spend time investigating, and risk of chargebacks increases.  
   *(22 October – 30:43–31:57)*

* After: More accurate, traceable validations reduce invoice errors; easier to defend invoices with stored timecard \+ validation history.

* Value/Impact: Fewer disputes and rework; improved collections reliability.

# Tab 5

[image1]: <data:image/png;base64,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>
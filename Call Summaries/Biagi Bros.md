# Customer Context (Consolidated Summary)

## **Customer Context (Consolidated Summary)**

* **Who they are**

  1. Biagi Bros (BB): US-based third-party logistics provider focused on wine and beverage warehousing and transportation (multiple warehouses / “sites”, \~30 locations/managers). *\[14 October – 26:46–27:34, October 14 BiagiBros Proposal Run through\]*

  2. Core systems:

     * **WMS:** HighJump (internal “Corporate 1” UI). *\[23 September – 05:00–07:00, 23 September BB Email Project\]*

     * **Customer/Carrier portal:** In-house portal backed by SQL \+ Azure data warehouse, with embedded Power BI reports and role-based access. *\[23 September – 05:50–07:50, 23 September BB Email Project\]*

     * **ERP / AP:** Microsoft Dynamics Business Central (Bc). *\[11 September – 00:00–01:30, 11 September Case management Discussion\]*

     * **TMS:** Separate transportation management system that auto-creates certain purchase invoices in Bc. *\[14 October – 21:00–23:40, October 14 BiagiBros Proposal Run through\]*

* **What they use / want from Docsumo**

  1. **AP invoice capture (already live):**  
      Vendors email invoices into Docsumo; managers review/code; existing middleware creates purchase invoices in Bc. *\[11 September – 00:00–01:30, 11 September Case management Discussion\]*

  2. **AP validation & GL automation (with Valtech \+ Docsumo):**  
      Valtech is proposing a middleware (“Invoice Sense”) that sits between Docsumo and Bc to validate totals, suppliers, duplicates and auto-assign GL codes before invoices are posted. Docsumo remains the extraction/UI layer and is updated with validation results. *\[14 October – 00:06–01:40, October 14 BiagiBros Proposal Run through\]*

  3. **Email / case automation with Docsumo Workflow (new project):**  
      Automate high-volume customer and carrier emails (order changes, appointment changes, inventory queries, BOL copies) by having Docsumo:

     * Ingest emails,

     * Detect intent \+ parameters,

     * Call Biagi APIs (order / inventory / appointment / BOL),

     * Draft and sometimes send replies,

     * Manage human review where needed. *\[23 September – 00:00–01:40, 23 September BB Email Project\]* *\[19 November – 00:55–04:10, 19 November Email Automation project\]*

  4. **Optional AP BPO via partner:**  
      Neil is also exploring having an external partner (Balatac, via Docsumo) fully process AP invoices in Bc using Docsumo as the front end. *\[11 September – 00:00–04:16, 11 September Case management Discussion\]*

# Current Process (AS-IS) – Step-by-Step

## **Current Process (AS-IS) – Step-by-Step**

[https://drive.google.com/file/d/1dyycqtc1spcodyzeoUF1gwn-P0\_6MhNf/view?usp=drive\_link](https://drive.google.com/file/d/1dyycqtc1spcodyzeoUF1gwn-P0_6MhNf/view?usp=drive_link)

![][image1]

### **1\. AP Invoices (Warehouse & TMS)**

#### **1.1 Standard warehouse invoices – Variant A**

1. **Vendor sends invoice**

   * **Who:** External vendors.

   * **What:** Email invoices (PDF) into Docsumo addresses; Docsumo auto-classifies into a manager-specific “document type” (one per site/manager, \~30 doc types). *\[14 October – 26:46–27:46, October 14 BiagiBros Proposal Run through\]*

   * **Inputs:** Vendor invoice PDF.

   * **Outputs:** Docsumo document in that manager’s queue, status \= *Review*.

2. **Manager reviews & codes in Docsumo**

   * **Who:** \~30 warehouse managers (one per location).

   * **What:**

     * Review OCR results (supplier, amounts, etc.).

     * Add or adjust coding (GL account, cost center, dimensions).

     * Approve the invoice inside Docsumo. *\[11 September – 00:00–01:30, 11 September Case management Discussion\]* *\[14 October – 26:46–30:25, October 14 BiagiBros Proposal Run through\]*

   * **Inputs:** Docsumo UI, extracted fields, their local knowledge.

   * **Outputs:** Docsumo record with coded lines, status \= *Processed/Ready*.

3. **Existing middleware creates purchase invoice in Bc**

   * **Who:** Internal IT / integration job (no user).

   * **What:**

     * Polls Docsumo for processed docs.

     * Uses extracted fields and a vendor field in Bc called **“Docsumo Xref”** to identify the vendor. *\[14 October – 06:46–10:07, October 14 BiagiBros Proposal Run through\]*

     * Creates a **purchase invoice** record in Bc with header \+ lines; sometimes Bc auto-adds GL codes if vendor historically only hits one ledger account. *\[14 October – 04:58–06:11, October 14 BiagiBros Proposal Run through\]*

   * **Inputs:** Docsumo API data; Bc vendor master (including tax ID, zip, Docsumo Xref); GL master.

   * **Outputs:** Unposted purchase invoice in Bc.

4. **AP team validates & posts**

   * **Who:** AP team in Napa (\~5 FTE). *\[11 September – 00:00–01:30, 11 September Case management Discussion\]*

   * **What:**

     * Double-check that manager coding and amounts are correct.

     * Confirm vendor, invoice number, totals; fix missing/incorrect GL.

     * Approve/post the invoice in Bc.

   * **Inputs:** Purchase invoices in Bc; sometimes Docsumo as reference.

   * **Outputs:** Posted invoices ready for payment.

5. **Exception handling**

   * **Who:** Managers \+ AP team.

   * **What:**

     * If Docsumo extraction picked the wrong supplier identifier or partial name, Docsumo Xref in Bc may not match; those are flagged and require manual fix and re-export. *\[14 October – 09:57–10:50, October 14 BiagiBros Proposal Run through\]*

     * Duplicate invoices are caught via Bc logic (vendor \+ invoice number, etc.), leading to manual investigation.

   * **Outputs:** Corrected vendors or rejection of duplicates.

#### **1.2 TMS brokered load invoices – Variant B**

1. **TMS creates the purchase invoice first**

   * **Who:** TMS integration.

   * **What:** When Biagi brokers a load to an external carrier, the **TMS auto-creates a purchase invoice in Bc** for the carrier charge (status \= *Created*, not posted). *\[14 October – 21:00–23:32, October 14 BiagiBros Proposal Run through\]*

   * **Inputs:** TMS shipment data.

   * **Outputs:** Draft purchase invoice in Bc.

2. **Carrier sends actual invoice; Docsumo processes as normal**

   * Same Docsumo ingestion and manager coding flow as Variant A.

3. **Existing middleware updates (not creates) the invoice in Bc**

   * **Who:** Integration job.

   * **What:**

     * Must **find an existing purchase invoice** for that carrier and load.

     * Update that invoice with the actual amounts & coding, **not create a new one**. *\[14 October – 23:32–25:01, October 14 BiagiBros Proposal Run through\]*

   * **Pain:** If the purchase invoice doesn’t exist yet (TMS timing), or is already posted, the flow breaks; these are handled manually today.

4. **AP team posts**

   * Same as Variant A, but with special attention to TMS invoices.

---

### **2\. Operational Emails: Orders, Inventory, Appointments, BOL**

Today this flow is **manual, outside Docsumo** (Docsumo only sees sample forwarded emails for POC).

#### **2.1 Generic flow for order/appointment/inventory emails**

1. **Customer / carrier sends an email**

   * **Who:** External users:

     * Customers (wineries) or their customers.

     * Carriers/3PLs.

   * **Typical asks:**

     * “Do you see these orders / can you make them visible to carrier X?”

     * “Please change the carrier / ship-to / line items on order 1234.”

     * “Can you reschedule this appointment?”

     * “Please send BOL for PO 11719.”

     * “Can you send inventory report for product X?” *\[09 October – 02:17–03:15 & 14:07–18:10, 09 October BB Email Project\]*

   * **Inputs:** Email including PO numbers, order numbers, customer name, carrier, dates, case quantities, etc.

   * **Outputs:** Email lands in shared inbox for customer service.

2. **CSR triages and interprets**

   * **Who:** \~6 customer service reps. *\[23 September – 37:18–38:18, 23 September BB Email Project\]*

   * **What:**

     * Read the email, identify whether action is needed.

     * Infer what the user is allowed to do based on their known identity (they “just know” which email belongs to which customer/carrier; no system-level check). *\[23 September – 14:20–14:37, 23 September BB Email Project\]*

   * **Inputs:** Outlook \+ team’s institutional knowledge.

   * **Outputs:** Decision on action(s) to be taken.

3. **CSR looks up data in internal systems**

   * **Who:** CSR.

   * **Systems & inputs:**

     * **HighJump WMS (internal):**

       * Search orders by PO/order/reference, view and update carrier, ship-to, lines, etc. *\[23 September – 11:13–13:31, 23 September BB Email Project\]*

     * **Biagi Portal (Power BI \+ SQL):**

       * Customers/carriers can self-serve here, but CSRs also refer to it to see what external users see.

       * User admin page defines each portal user’s roles and what **customer codes / carrier codes** they can see. *\[23 September – 07:44–09:57, 23 September BB Email Project\]*

     * **Azure data warehouse & Power BI:** For inventory and order reports. *\[23 September – 20:31–22:26, 23 September BB Email Project\]*

4. **CSR executes the requested action**

    **a) Check visibility / change carrier on order**

   * Search by PO/order/reference.

   * Validate (from memory) that requester is authorized for that customer/carrier.

   * If allowed, **change the carrier** or update header/lines directly in HighJump; portal picks up changes via SQL host tables. *\[23 September – 11:13–13:31, 23 September BB Email Project\]* *\[09 October – 07:39–09:29, 09 October BB Email Project\]*

5. **b) Appointment scheduling / rescheduling**

   * Look up existing appointment in portal / HighJump.

   * Manually check open time slots for requested date/time.

   * If available, update appointment time; if not, negotiate via email. *\[09 October – 20:41–26:23, 09 October BB Email Project\]*

6. **c) BOL retrieval**

   * Use PO/Order to find the shipment in the WMS.

   * Download BOL PDF.

   * Reply with BOL attached. *\[09 October – 14:07–16:50, 09 October BB Email Project\]*

7. **d) Inventory reports**

   * Run portal/Power BI report for given products/client.

   * Export as CSV and email. *\[09 October – 17:14–18:13, 09 October BB Email Project\]*

8. **CSR replies to email**

   * **Who:** CSR.

   * **What:** Send back:

     * Confirmation of changes (“carrier changed to Fast Break”),

     * BOL/CSV attachments, or

     * Denials / follow-up questions.

   * **Outputs:** Email response; no formal “case” object is tracked.

9. **Edge cases – multi-thread emails**

   * Long threads often contain **multiple different requests about different orders**; CSRs must mentally track which parts are “done” vs new; this is a major source of complexity and potential misses. *\[09 October – 19:55–20:56, 09 October BB Email Project\]* *\[19 November – 19:55–21:20, 19 November Email Automation project\]*

# Tools, Manual Steps, and Pain Points

## **Tools, Manual Steps, and Pain Points**

### **Main tools / systems**

* **Docsumo:** Invoice extraction and manager review UI; already live for AP; also target platform for email workflows & case management.

* **Business Central (Bc):** Source of truth for vendors, invoices, GL accounts, tax IDs, zip codes; receives purchase invoices from existing middleware.

* **HighJump WMS:** Internal operational system for orders, inventory, appointments.

* **Biagi Portal (SQL \+ Azure \+ Power BI):**

  * User authentication & role-based access (customers vs carriers, allowed customer codes/carriers).

  * Self-service UI for orders, appointments, inventory and history.

* **TMS:** For transportation; creates purchase invoices in Bc for brokered loads.

* **Email (Outlook/Exchange):** Primary interface for customer/carrier requests.

* **Planned:** New REST APIs (order, inventory, appointment, user authorization) built by Biagi (Vinisha & team), exposed to Docsumo workflows.

### **Manual steps & pains – AP**

1. **Manager coding overhead**

   * Managers must code every invoice line in Docsumo; GL mapping only partly automated via Bc defaults. *\[14 October – 03:20–06:11, October 14 BiagiBros Proposal Run through\]*

   * **Pain:** Time-consuming; risk of inconsistent GL selection across managers.

2. **AP double-checking**

   * AP team manually re-validates what managers entered and what Docsumo extracted before posting. *\[11 September – 00:00–01:30, 11 September Case management Discussion\]*

   * **Pain:** High FTE cost (goal is to reduce from 5 → 3 FTE). *\[14 October – 35:29–37:52, October 14 BiagiBros Proposal Run through\]*

3. **Vendor recognition & duplicates**

   * Docsumo uses a **Docsumo Xref** field in Bc (often based on invoice logo / remit-to address) to map vendors; mis-extraction leads to no match and manual rework. *\[14 October – 06:46–10:50, October 14 BiagiBros Proposal Run through\]*

   * Duplicate detection rules differ between warehouse and TMS invoices; currently handled in Bc, with manual investigation. *\[14 October – 23:32–25:36, October 14 BiagiBros Proposal Run through\]*

4. **Special TMS logic**

   * Need to ensure Docsumo/middleware **updates**, not creates, TMS-type invoices; this depends on whether purchase invoices already exist and their status (created vs posted). *\[14 October – 21:00–25:36, October 14 BiagiBros Proposal Run through\]*

   * **Risk:** Creating duplicates or updating wrong invoices.

### **Manual steps & pains – Email / operations**

1. **High volume, low structure**

   * \~100–200 actionable emails/day, handled by 6 CSRs who also do other prep work for warehouses. *\[23 September – 37:18–38:18, 23 September BB Email Project\]*

   * **Pain:** High context-switching, hard to scale; repetitive tasks (status checks, simple updates, BOL sends).

2. **Security based on “tribal knowledge”**

   * Portal has robust RBAC, but **email workflows do not**; CSRs update orders based on their own knowledge of who should have access (they know “a couple hundred” contacts), not based on system validation. *\[23 September – 14:20–14:37, 23 September BB Email Project\]* *\[19 November – 04:58–07:12, 19 November Email Automation project\]*

   * **Risk:** Potential for unauthorized changes if staff misidentify or if contact list grows.

3. **Multi-intent threads**

   * Single email threads may cover multiple orders and different requests over time (“talk about one order, finish, then switch to a new one on same thread”). *\[09 October – 19:55–20:56, 09 October BB Email Project\]* *\[19 November – 19:55–21:20, 19 November Email Automation project\]*

   * **Pain:** Easy to miss the second/third request; no “case” view showing all actions done vs pending.

4. **Appointment reschedules**

   * CSRs manually check availability and negotiate times via email; no automated “check slots and propose alternatives” flow. *\[09 October – 20:41–26:23, 09 October BB Email Project\]*

   * **Risk:** Delays; missed appointments; they’ve considered cron-style reminders for no-show appointments but don’t have it in place yet (this is currently just an idea). *\[09 October – 20:41–22:28, 09 October BB Email Project\]*

5. **Reporting / BOL**

   * Manual creation & emailing of inventory reports and BOLs for every request. *\[09 October – 14:07–18:13, 09 October BB Email Project\]*

   * **Pain:** Repetitive; high time cost for CSRs.

6. **Testing complexity for automation**

   * To trust an AI-driven system, Neil wants **1,000–3,000 real emails** run through a test environment with realistic data before going live; replicating production Bc/HighJump/portal data into dev is technically hard and may require manual or periodic refreshes. *\[19 November – 25:05–27:36, 19 November Email Automation project\]*

   * **Pain:** Extra coordination and IT effort to stand up realistic test env.

# Desired Future Process with Docsumo (TO-BE)

## **Desired Future Process with Docsumo (TO-BE)**

### **1\. AP Invoice Flow (Docsumo \+ Valtech Middleware)**

**High-level goal:** Turn Docsumo \+ Valtech into an **auto-validation and coding layer** so AP can mainly do final checks and handle exceptions, targeting \~75% straight-through processing. *\[14 October – 35:29–37:52, October 14 BiagiBros Proposal Run through\]*

#### **1.1 TO-BE steps**

1. **Invoice capture remains in Docsumo**

   * Same as today: vendors email; Docsumo auto-classifies into the right manager doc type; manager does a light review/coding and approves. *\[14 October – 26:46–30:25, October 14 BiagiBros Proposal Run through\]*

2. **Valtech middleware pulls invoices from Docsumo (first middleware)**

   * **Automated by Valtech; Docsumo assists**

   * Extracts data from Docsumo for “processing” invoices instead of letting the old Bc integration act first. *\[14 October – 00:06–01:40, October 14 BiagiBros Proposal Run through\]*

3. **Validation & enrichment in middleware**

   * **Automated (systemic logic, not AI):**

     * **Amount validation:** Compare header total vs sum of coding lines; if mismatch, mark as validation error. *\[14 October – 00:06–03:20, October 14 BiagiBros Proposal Run through\]*

     * **Supplier validation:**

       * Use a combination of *vendor name* (fuzzy) \+ *zip code* and possibly **tax ID** from Bc to reliably match the vendor. *\[14 October – 06:11–13:18, October 14 BiagiBros Proposal Run through\]*

     * **Duplicate checking:**

       * Warehouse: vendor \+ invoice number ± amount, checking posted/paid invoices.

       * TMS: detect duplicates even for **created but unposted** TMS purchase invoices. *\[14 October – 23:32–26:13, October 14 BiagiBros Proposal Run through\]*

     * **GL auto-coding:**

       * Use historical combinations (e.g., vendor \+ purpose \+ cost center \+ line description) plus business rules to auto-populate ledger accounts in Docsumo when possible. *\[14 October – 03:20–06:11 & 10:50–14:03, October 14 BiagiBros Proposal Run through\]*

4. **Push validation results back into Docsumo**

   * **Automated; Docsumo UI used by managers/AP:**

     * Middleware updates the **Docsumo document** with:

       * GL account suggestions,

       * Flags like “Valid supplier”, “Amount mismatch”, “Duplicate suspected”, etc., possibly in header fields / comments. *\[14 October – 13:18–19:53, October 14 BiagiBros Proposal Run through\]*

5. **Routing of Happy Path vs Exceptions**

   * If *all checks pass*:

     * Move the doc into a dedicated **“Validated” folder/status** per manager.

     * Existing middleware (Biagi’s) picks **only documents in the validated queue** and creates/updates purchase invoices in Bc. *\[14 October – 15:31–17:31 & 32:56–33:35, October 14 BiagiBros Proposal Run through\]*

   * If *any check fails*:

     * Keep the doc in the **manager’s main review queue** (status to be reverted from “Processing” back to “Review”).

     * Add a clear **validation error message** (e.g., “Supplier not found”, “Duplicate invoice detected”, “Amount mismatch”).

     * Manager corrects and re-approves; doc re-runs through middleware. *\[14 October – 16:10–19:53, October 14 BiagiBros Proposal Run through\]*

6. **TMS invoices TO-BE**

   * Middleware first checks whether a purchase invoice already exists in Bc for that vendor/shipments:

     * If *yes*: update that invoice instead of creating a new one.

     * If *no*: treat as validation failure (“TMS invoice not yet created”) and route back to review. *\[14 October – 21:00–25:36, October 14 BiagiBros Proposal Run through\]*

7. **AP role in TO-BE**

   * **Human review remains but is narrower:**

     * Focus on **high-level header checks and true exceptions**, not line-by-line coding.

     * Target \~**75% of invoices** requiring little more than a quick glance before mass-posting. *\[14 October – 35:29–37:52, October 14 BiagiBros Proposal Run through\]*

**Definition of success (AP):**

* 75%+ invoices auto-validated with correct supplier & GL.

* Ability to reduce AP staffing from 5 → 3 FTE while preserving control & auditability. *\[14 October – 35:29–37:52, October 14 BiagiBros Proposal Run through\]*

---

### **2\. Email / Case Automation with Docsumo Workflow**

**High-level goal:** Turn email-driven work into **structured cases** where Docsumo acts as an “agentic front-end” to Biagi’s APIs for orders, inventory, appointments and documents.

#### **2.1 TO-BE steps**

1. **Email ingestion into Docsumo**

   * Selected mailboxes or rules **auto-forward emails to Docsumo** (initially a subset; later more addresses). *\[19 November – 21:47–23:34, 19 November Email Automation project\]* *\[09 October – 26:33–27:17, 09 October BB Email Project\]*

   * Each email becomes a **Case** in Docsumo Workflow.

2. **Intent & parameter extraction**

   * **Automated by Docsumo AI \+ rules:**

     * Classify email into intent types such as:

       * “Check if orders exist/make visible to carrier,”

       * “Change carrier on order,”

       * “Reschedule appointment,”

       * “Send BOL for PO X,”

       * “Send inventory report for product X.” *\[09 October – 02:17–03:15, 09 October BB Email Project\]*

     * Extract key parameters (PO/order/reference number, customer code, carrier, case quantities, requested date/time).

   * **Multi-intent threads:** The same case can hold multiple “actions” derived from different parts of the email thread (e.g., first action about order A, later action about order B). *This splitting is a design goal inferred from discussions about handling multiple requests in a thread.* *\[09 October – 19:55–20:56, 09 October BB Email Project\]* *\[19 November – 19:55–21:20, 19 November Email Automation project\]*

3. **User authorization via Biagi API**

   * **Automated; Biagi builds API, Docsumo calls:**

     * Docsumo sends the **sender’s email address** to a new **User Authorization API**. *\[23 September – 07:44–09:57, 23 September BB Email Project\]* *\[19 November – 02:46–04:46, 19 November Email Automation project\]*

     * API returns:

       * Whether the email corresponds to a valid portal user.

       * Their **roles** (customer vs carrier).

       * Their allowed **customer codes, carriers, warehouses**, etc.

   * If not found → **no action is taken automatically**; case is routed to manual handling.

4. **Per-action API calls with re-validation**

    For each action within a case, Docsumo will:

    a) **Order status / visibility checks**

   * Call **Order Status/Search API** with:

     * User identifier (email or user ID from auth API).

     * PO/order/reference, customer code, and possibly quantity or case count to disambiguate. *\[23 September – 33:32–34:52, 23 September BB Email Project\]* *\[09 October – 32:38–35:14, 09 October BB Email Project\]*

   * API confirms:

     * Whether the order exists within the user’s permitted data set.

     * Its status (e.g., open, shipped, staged).

5. b) **Order update (e.g., change carrier)**

   * For authorized **customers:**

     * Call **Order Update API** with user ID, order ID, and allowed changes (carrier, ship-to, etc.).

   * For **carriers:**

     * Only permit carrier changes within their assigned orders; they cannot freely edit orders. *\[23 September – 09:01–10:01, 23 September BB Email Project\]* *\[09 October – 07:39–09:29, 09 October BB Email Project\]*

6. c) **Appointment read/update**

   * Use **Appointment API** to:

     * Get existing appointment details for an order.

     * Check available time slots for requested date (may require calling an endpoint that returns all open slots for that day). *\[19 November – 18:05–19:23, 19 November Email Automation project\]* *\[09 October – 20:41–26:23, 09 October BB Email Project\]*

   * If requested time is unavailable:

     * Propose a nearby open slot (next available), or

     * Route to human review if ambiguous.

7. d) **Inventory queries**

   * Call **Inventory API** with user context and product filters to return on-hand or open-order inventory.

   * Docsumo converts JSON → CSV and attaches it to the reply. *\[09 October – 17:14–18:13, 09 October BB Email Project\]*

8. e) **BOL retrieval**

   * Call BOL endpoint (or order endpoint plus document link) to fetch PDFs.

   * Attach them in the outbound email. *\[09 October – 14:07–16:50, 09 October BB Email Project\]*

9. **Important:** For *every* API call, Biagi wants **per-call authorization** based on user context (token/email \+ customer/carrier) so that even if Docsumo constructs the wrong query, the backend will block access beyond that user’s scope. *\[23 September – 29:53–30:22, 23 September BB Email Project\]* *\[19 November – 09:57–12:42, 19 November Email Automation project\]*

10. **Automatic vs Human-in-the-loop actions**

    * **Auto actions (high confidence):**

      * Straightforward status checks & confirmations.

      * Carrier updates when order, user and carrier all match unambiguously.

      * Appointment changes where requested slot is free.

      * Inventory reports and BOL retrieval with 1:1 mapping.

    * **Human-review actions:**

      * Multiple matches for a given PO/reference.

      * Conflicting information across email and system (e.g., invoice already shipped).

      * Ambiguous intent or unclear user rights.

      * Multi-thread cases where it’s unclear if a later email supersedes earlier ones. *\[19 November – 19:55–21:20, 19 November Email Automation project\]* *\[09 October – 19:55–20:56, 09 October BB Email Project\]*

    * Docsumo will present a **case view** showing:

      * Original email text,

      * Extracted intents/fields,

      * Proposed API calls and **draft email** replies.

      * The CSR approves/edits and executes.

11. **Automated responses**

    * For each case, Docsumo crafts a reply:

      * For an order visibility email like the carrier “Fast Break” example:

        * A table of POs with flags “Exists / Not Found” and “Carrier updated to X / No change.” *\[09 October – 02:17–07:39, 09 October BB Email Project\]*

      * For BOL requests: a short confirmation \+ PDFs.

      * For inventory: CSV attached with clear headings.

      * For appointment reschedules: confirmation or suggested alternative slots.

12. **Learning & expansion**

    * They plan to:

      * Collect at least **1 week of production emails** (1–2k emails) and map them into an Excel describing **intent → API → parameters → validations**; this becomes the rules library. *\[23 September – 32:38–34:52, 23 September BB Email Project\]* *\[19 November – 31:32–34:13, 19 November Email Automation project\]*

      * Iterate first on “easy 10–20%” then on the next “30% tricky cases” to create real wow factor. *\[19 November – 31:32–35:02, 19 November Email Automation project\]*

**Definition of success (Email project):**

* Remove most repetitive status checks, BOL sends, inventory exports and routine appointment changes from the 6 CSRs’ workload.

* Maintain or improve security vs portal (every action double-validated by user authorization API).

* Achieve high enough reliability (after 1,000–3,000 test emails) to turn on auto-actions for well-defined patterns. *\[19 November – 23:34–27:36, 19 November Email Automation project\]*

---

## **Customer Journey: Before vs After Docsumo (Table)**

This table merges **AP** and **email** journeys from all calls (current vs desired future with Docsumo \+ partners).

| Stage / Step | Before Docsumo (or current usage) | After Docsumo (Future) | Value / Impact for Customer |
| ----- | ----- | ----- | ----- |
| 1\. Vendor sends invoice | Vendors email invoices; manual keying before Docsumo (historical) or semi-manual manager coding with Docsumo today. *\[11 September – 00:00–01:30, 11 September Case management Discussion\]* | Same capture flow via Docsumo; templates improved (e.g., zip code fields) and invoice data enriched/validated downstream. *\[14 October – 31:58–32:39, October 14 BiagiBros Proposal Run through\]* | Stable, structured input into the AP pipeline; Docsumo remains single entry point. |
| 2\. AP coding & validation | Managers code GL in Docsumo; AP team re-checks every invoice and resolves vendor/GL/duplicate problems manually in Bc. | Valtech middleware validates amounts, suppliers, duplicates and auto-codes GL using history, updating Docsumo with results; AP focuses on exceptions and final header checks. | Higher straight-through rate (\~75% target), fewer manual corrections, AP headcount can reduce from 5 → 3 FTE while maintaining control. *\[14 October – 35:29–37:52, October 14 BiagiBros Proposal Run through\]* |
| 3\. TMS brokered invoices | TMS auto-creates Bc invoices; Docsumo export may accidentally create duplicates or requires manual checking to ensure the right record is updated. | Middleware explicitly checks for existing TMS invoices and only updates them; lack of an existing invoice is treated as a validation failure. | Reduces duplicate invoices and manual reconciliation for transportation charges. |
| 4\. Supplier recognition | Docsumo Xref (logo/remit-to) sometimes mismatches; AP spends time fixing and retraining. | Supplier match leverages fuzzy name \+ zip \+ tax ID from Bc; Docsumo templates updated to extract zip code separately. | More reliable vendor mapping; fewer failed exports and resubmissions. |
| 5\. Customer/carrier operational requests | 100–200 actionable emails/day, triaged and executed manually by 6 CSRs using HighJump and the portal; security based on personal familiarity with senders. | Emails flow into Docsumo Workflow; intents/parameters extracted; Biagi APIs called with per-call authorization; simple requests auto-handled, complex ones go through case UI for review. | Large chunk of repetitive CSR work automated; improved security (system-level checks); better audit trail per case. |
| 6\. Appointment changes | Carriers email CSRs; CSRs check availability manually and negotiate times; no systematic reminder for missed appointments. | Appointment APIs used to fetch slots and reschedule; Docsumo proposes or auto-applies times; potential to add cron-like reminders as a later workflow. | Faster turnaround; fewer scheduling errors; frees CSR time for exceptions. |
| 7\. BOL & inventory reports | CSRs manually search, export CSVs and attach PDFs/CSVs for every ask. | Docsumo calls APIs, converts JSON → CSV, attaches and sends automatically (subject to user authorization). | Less repetitive work; more consistent report formats; shorter response times. |
| 8\. Exception visibility | AP exceptions live mainly in Bc; email exceptions are buried in long threads; little structured view of why something failed. | Docsumo documents include clear validation reasons; email cases show per-action status and error messages; exceptions are surfaced in Docsumo queues. | Better monitoring and debugging; faster training of both people and models/rules. |

[image1]: <data:image/png;base64,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TzXWXnvtxvvf//7kxFrd/7rXva6x5pprNt73vvc1lixZkky0KmAymbCR///TP/3Txg477NB4wxveMCVfO+63336NDTbYoLH99ttP2ZdJfevSVeLY+6UvfSmVN3fu3Cn74ac//enkYMv/r33ta1Ne6v3hD394St52ZFLPMcccM1Kedtpp/9ej1OCkk06acuwoeOWVV2pVpoDnV48bFQeFM888c0rZo+CFF16oVekZxx9//JTyh03O+dJLL2lVpoDJW3rsKFj3+8oCjt9+9Z0c9YvaT0d5lBooW9PRNg3AG1H7maj/0v71mWeemZKnU/8V9fUl7aDBcjVPVK5et7YL1P5f71tJO2j9obaDlutAvmZH1gm4P/zDP2x87GMfS/+/4x3vCMUXAugHP/hB48QTT0yzgNj2mte8prn/93//9xuLFy9uvPOd72ycffbZacYsx/zlX/5lEi5vfOMbk9jhmN122615HAKO8735zW9uPPTQQ0kcIQARhB/60Ica1157bSr7k5/8ZOOcc85JxyDgKB/RySwrxN+f/MmfpJfIW9/61sbf/d3ftdQNUh4znhGYH//4x9PsobwPAbfLLruk8p5++ulUh7/5m79p/NM//VPjtttuS+f+vd/7vRYBR17qyzXRnlzfm970pjTrm2um42F21Hvf+97mecY1Asd9qwNtOS4wW7wTeF7GhSOPPFI39QRCSowDPJuDwHe/+13dNDIcfvjhumkK9tlnH900MvzoRz/STQkegTNLaQFn1rKdgFtjjTWSQMqCB/HEX0QRYVUuv/zyJEoQY/hwse+yyy5r7L777i0CiTL4+/rXv74p4BCGm2yySRrd2XnnnZviRwUcwuhzn/tcElLrrLNOGuk75ZRTmvkRW+95z3sae+65Z9qGgCO8C/8j4M4///z0Py/SpZdeOv3/lre8JQnHav0Rnp/5zGfS/m984xtpJJD9nHf//fdv1gkRyN93vetdSQzy/9/+7d82BRxiLudFwNFOp59+euOSSy5pzJ8/P21797vf3fjsZz/b+PrXv97MO10FXMko2LBw11136aYpGKd4OOSQQ3RTT/jtb3+rm0YCRicGgXHeg0MPPVQ3TYEFnDnJtIAza9lOwGUxQrydHXfcMY1OIZYwGeY8MAs4RtgQa4xAVUe5EFrsYwQvCziEEKNSCLi3v/3tSVRFAg6xQz0Y0ULA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>
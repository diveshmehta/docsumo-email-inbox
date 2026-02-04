# Summary

Customer Context (Consolidated Summary)

* **Who they are**

  * Auto refinance lender working across multiple US states (e.g., Colorado, Illinois) with an internal program/brand referred to as *Aurapro*. \[24 April, 01:41\]

  * Core teams involved:

    * **Mike McCarthy** – business owner for the automation initiative, focused on fulfillment/contracting and at-bank QA. \[2 April, 10:48\]

    * **Solianis (Sol)** – Senior Program Manager who “deals with the documents and steps”. \[24 April, 01:41\]

    * **Joseph** – technology/engineering leader looking at buy-vs-build and rule-engine architecture. \[24 April, 32:51–33:33\]

    * CTO, COO, CEO/President, and now a **project manager** are stakeholders in a broader automation program. \[1 May, 00:00–01:45; 10 July, 00:17–01:57\]

* **What they want from Docsumo**

  * Use Docsumo as the **document extraction \+ validation layer** for auto-refi “deal packets”: driver’s license, registration, insurance, book-out/NADA, approvals, title docs, rate sheets, and lender/state rule docs. \[2 April, 01:18–03:13; 24 April, 10:34–11:43\]

  * Automate checks that are today done manually, with a goal of **“push-button contracting”** – validating everything and generating contracts while the customer is still on the phone. \[2 April, 10:48–12:29\]

  * Use Docsumo to drive **pass / fail / needs-review** decisions with clear reasons, so staff only look at exceptions instead of every file. \[2 April, 01:18–03:13; 24 April, 25:46–27:06\]

* **Key constraints & parameters**

  * Current **cycle time**: \~27 hours on average from customer saying “yes” to documents going out, mainly because of manual validations and limited staff. \[2 April, 10:48–12:29\]

  * Expected scale: roughly **5 documents per deal** and up to **20,000 documents/month** in a high-level scenario. \[24 April, 49:58–50:38\]

  * Complex multi-dimensional rules: lender and state specific rules (e.g., maximum GAP amount per state, LTV caps, term/rate rules), plus title requirements from a third-party vendor (Location Services). \[2 April, 12:29–15:32; 24 April, 13:34–14:21; 24 April, 27:06–27:47\]

  * They already use **AWS Textract** elsewhere and are comparing Docsumo and other vendors (e.g., Drively) against an internal “buy+build” option. \[12 March, 01:26–02:35; 24 April, 36:43–37:33\]

  * Concerned about **where rules live** (Docsumo vs internal system) and avoiding vendor lock-in, as they expect to build a **“giant checklist”** that is universal, lender-specific, and state-specific. \[1 May, 00:00–01:45; 24 April, 33:31–34:12\]

  * Need strong **uptime & SLA** guarantees and clarity on fallbacks if Docsumo is down. \[1 May, 07:09–08:20\]

---

# Current Process (AS-IS) – Step-by-Step

## **Current Process (AS-IS) – Step-by-Step**

[https://drive.google.com/file/d/1zjgPIn\_ttvJnPSc55bRzdMl2sODEgBkf/view?usp=sharing](https://drive.google.com/file/d/1zjgPIn_ttvJnPSc55bRzdMl2sODEgBkf/view?usp=sharing)

![][image1]

### **Variant A – Stipulations & Contracting (main focus)**

**Step A1 – Deal enters “contracting” status**

* **Persona:** Fulfillment / Contracting processor, driven by business rules set by leadership.

* **What they do:** When a customer accepts an offer, the deal moves into a contracting queue where staff must gather and validate required documents. \[2 April, 10:48–12:29\]

* **Inputs:**

  * Application and approval data in their **homegrown CRM** (term, rate, LTV, products, etc.). \[2 April, 03:35–04:01\]

  * Lender sheets, rate sheets, state sheets, internal “rule book” in Excel. \[2 April, 01:18–03:13\]

* **Outputs:** Deal flagged for contracting; staff must complete all validations before contracts go out.

* **Note:** Use of a contracting “status/queue” in the CRM is implied from the funnel description, not explicitly spelled out. *(Assumption based on 2 April, 10:48–12:29.)*

**Step A2 – Collect stipulation documents from the customer**

* **Persona:** Fulfillment processor or sales rep.

* **What they do:** Ask the customer for required stipulations such as driver’s license, proof of insurance, and registration.

* **Inputs:** Customer sends images/PDFs of driver’s license and other docs via **text or email**. \[18 April, 12:17–12:44\]

* **Outputs:** Raw documents sitting in staff email/SMS or downloads.

**Step A3 – Upload docs into CRM & re-key data**

* **Persona:** Fulfillment processor.

* **What they do:**

  * Open the driver’s license (or other stip) from email/text.

  * Upload it into the **driver’s license slot/field** inside their CRM. \[18 April, 12:17–12:44\]

  * Manually type all fields from the image into CRM fields (name, DOB, address, license number, expiry, etc.). \[18 April, 12:44–13:18\]

* **Inputs:**

  * Stip documents (images/PDFs).

  * CRM UI for the specific document type (driver’s license, etc.).

* **Outputs:**

  * CRM record updated with manually keyed values.

  * Document attached to the CRM.

* **Pain points:** Pure manual data entry, repeated for every stipulation and every deal. \[18 April, 12:17–13:18\]

**Step A4 – Manual checklist validation vs CRM, lender, and state rules**

* **Persona:** Fulfillment team (“fulfillment team put together the rule book”). \[18 April, 04:10–04:41\]

* **What they do today (conceptually):**

  * Compare data on each document to the values in the CRM and to an Excel/Google Sheets **validation rule book** that lists each review point and the pass/fail conditions (e.g., ID matches, number of applicants matches, tier score matches, term and rate match). \[2 April, 01:18–03:13; 18 April, 01:18–04:10\]

  * For complex situations, they look at:

    * **Lender rate cards** – ensuring approval date, term, LTV and rate match the correct version of the rate sheet among “20 last rate cards”. \[2 April, 12:29–13:41\]

    * **Lender rules and state rules** – e.g., maximum GAP insurance allowed in a state (Colorado max $300 example), or LTV caps by lender. \[2 April, 12:29–14:55; 24 April, 13:34–14:21\]

* **Inputs:**

  * CRM approval/application screens (often printed as screenshots for testing). \[18 April, 02:41–03:34\]

  * Stip documents (DL, registration, insurance, approvals).

  * Excel rule book defining pass/fail/needs-review conditions. \[18 April, 01:18–04:10\]

  * Lender/state rule docs and rate cards. \[2 April, 12:29–14:55\]

* **Outputs:**

  * Manual determination of pass/fail for each check.

  * Notes on why something fails (e.g., expired license, name mismatch), currently maintained in the team’s knowledge and/or spreadsheets. *(The explicit documentation of failure reasons is what they want the system to produce; today it’s implied to be manual.)* \[2 April, 05:17–06:36\]

**Step A5 – Prepare and send contract documents**

* **Persona:** Contracting team.

* **What they do:**

  * Use CRM data, lender rules, and state rules to select the right contract templates and additional documents.

  * Manually verify all values are correct (term, rate, LTV, add-on products such as GAP or warranty, etc.).

  * Generate and send contract docs to the customer (typically for e-signature). \[2 April, 10:48–12:29\]

* **Inputs:**

  * Fully validated CRM data.

  * Stip documents and rule book outputs.

* **Outputs:**

  * Contract/document package sent to customer.

* **Key metric:** **\~27 hours** average delay from customer “yes” to docs going out, driven by all the **manual validations** described above. \[2 April, 10:48–12:29\]

**Step A6 – At-bank QA before sending to the lender**

* **Persona:** At-bank QA / Fulfillment.

* **What they do:**

  * Perform final QA on the complete package before sending to the bank (“our at-bank function, which means our final QA before we send it to the bank”). \[2 April, 10:48–11:18\]

  * Re-validate key fields and rules (rates, terms, products) against lender and state expectations.

* **Inputs:** Contract package, rule book, lender/state docs.

* **Outputs:** Final approval to send package to funding bank.

### **Variant B – Titles & Post-contract Documents**

**Step B1 – Receive title documents**

* **Persona:** Titles department.

* **What they do:** Receive title documents (some e-signed, some wet signatures) from customers or third parties. \[24 April, 27:06–27:47\]

* **Inputs:** Multi-page title document packages.

* **Outputs:** Title doc package per deal.

**Step B2 – Manual title QA**

* **Persona:** Titles team.

* **What they do:**

  * Confirm they have **all required title documents** using document numbers and state-specific requirements (often pulled from Location Services). \[24 April, 27:06–27:47; 2 April, 15:32–16:22\]

  * Check for **wrong or missing signatures** on the various title documents. \[24 April, 27:06–27:47\]

  * Ensure **nothing is scratched out** on the title documents (any scratched-out content is unacceptable). \[24 April, 27:47–28:32\]

* **Inputs:**

  * Title docs (20–30 pages in some cases). \[24 April, 48:25–48:25\]

  * Location Services outputs that specify which title docs are required per state. \[2 April, 15:32–16:22\]

* **Outputs:**

  * Decision that title package is acceptable or needs rework.

**Step B3 – Rate and product validation via re-installment contracts**

* **Persona:** Sales/fulfillment teams.

* **What they do (today):**

  * Review **re-installment contracts** from the original vehicle purchase to see if the customer has products like **warranty or GAP**, and what they cost.

  * Read contract language around **refund policies** (e.g., prorated vs non-refundable), and apply rules to estimate refunds when needed. \[18 April, 23:32–26:25\]

* **Inputs:** Re-installment contracts (semi-structured docs).

* **Outputs:** Manually derived estimates and decisions used upstream in the funnel.

* **Note:** They explicitly see this as another area they’d like to automate, but today it is manual. \[18 April, 23:32–26:25\] 

# Extraction and Validation

### **. Document vs CRM / application data (field-level matching)**

They want Docsumo to compare values on the document with the values in their CRM and mark **pass / fail / needs review** per field:

* **Driver’s license checks**

  * Name matches CRM name (with mismatch flag \+ both values).

  * DOB, address, license number, expiry date, and out-of-state indicator vs CRM fields.

  * Example requirement: if license is expired → **fail** and show the expiry date so processor doesn’t have to open the image.

* **Other stips (book-out, registration, etc.)**  
   From the “rule book” spreadsheet they shared:

  * For *book-out / NADA sheet*:

    * Correct book-out type (NADA vs KBB, etc.)

    * Year / make / model / VIN / mileage match CRM.

    * Value on sheet matches what’s in the system.

* **Generic pattern they ask for:**

  * Given a packet, they want:

    * “Pass/fail per rule” plus

    * If **fail**, return *why* (e.g., “name mismatch”) and **both values** (from application & from document).

---

### **2\. Validations against lender & state rules / rate sheets**

They explicitly describe multi-step rule validations that go beyond simple equality:

* **Rate-sheet validations** (per lender):

  * Use the **approval date** to pick the correct rate card within the rate sheet’s date ranges.

  * Verify: term (e.g., 60 months), LTV (e.g., 125%), and rate on approval are consistent with that rate card.

  * Handle extra conditions like **auto-pay discounts** (e.g., 0.25% rate reduction if autopay is selected).

* **State \+ lender rule combo** (GAP, LTV, etc.):

  * Example Mike gives:

    * “This vendor of GAP insurance with this lender has a max amount X, but Colorado state max is 300 → default to the lower (300).”

  * Validation should enforce lender-specific and state-specific caps (LTV, GAP, etc.).

* **State-rule decisioning example:**

  * Bikram paraphrases a rule like: “If doc is from Illinois, and Illinois has a rule like credit must be ≥ 960, then use extracted state \+ credit score to decide if they’re eligible by state rule.”

---

### **3\. Title document validations**

For **titles**, their validations are quite specific:

* Make sure **all required title documents** in the packet are present (using document numbers / Location Services rules).

* Confirm **required signatures** are present – flag wrong or missing signatures.

* Enforce “no scratched-out content” rule (they ask if Docsumo can detect content that has a line through it; this is a desired validation).

* **Page-count check**: example rule “this title packet should be 13 pages; check if pages are missing.”

---

### **4\. Re-installment contracts / warranty & GAP refunds**

On the re-installment contract (original purchase contract), they want to validate & derive:

* Does the contract include **warranty** and/or **GAP**?

* What is the **cost** of each product?

* What is the **purchase date**?

* What do the **refund clauses** say:

  * Is product refundable or non-refundable?

  * If refundable, is it prorated and under what rules?

* They then want to use this structured data to calculate **refund estimates** (whether that calc runs inside Docsumo or their system is still open).

---

### **5\. Mandatory vs optional fields & confidence-based validations**

They talk about validation logic that respects **mandatory fields** and **confidence scores**:

* They’ll define a set of **mandatory fields** (e.g., DL number, name, expiry) that *must* be present & accurate; missing or low-confidence extraction → mark as “needs review” or fail.

* Non-critical fields could be optional or only informational; missing them doesn’t fail the doc.

* Low confidence (e.g., out-of-state flag on DL) should surface as “review needed” rather than silently accepted.

---

### **6\. Straight-through vs exception-based validations**

They’re explicit about using validations to drive **STP vs exception handling**:

* If *all* validations pass for a packet, they want **straight-through processing**: no one reviews the doc; Docsumo just sends a clean JSON and CRM proceeds.

* Only when a validation fails or a mandatory field is missing / low confidence should the user be prompted to review via the embedded Docsumo screen.

---

### **7\. Format/normalization validations**

There are a couple of small but concrete “data hygiene” validations:

* **Date format normalization**: they want dates in MM/DD/YY instead of DD/MM/YY, with Docsumo converting formats consistently.

* State/“out-of-state” logic that may depend on comparing DL state with declared address/state in CRM (e.g., rule: if state on DL ≠ stated state → mark as out-of-state).

# Tools, Manual Steps, and Pain Points

## **Tools, Manual Steps, and Pain Points**

### **Core Tools / Systems**

1. **Homegrown CRM**

   * Source of truth for applications, approvals, deal statuses, and documents; they expect future API integration with Docsumo. \[2 April, 03:35–04:21; 18 April, 04:10–04:41\]

   * Today, staff **upload docs and key data manually** into this CRM. \[18 April, 12:17–13:18\]

2. **Email and SMS**

   * Used to collect stip documents (drivers license, etc.) from customers, which are then manually transferred into the CRM. \[18 April, 12:17–12:44\]

3. **Excel / Google Sheets “rule book”**

   * Fulfillment team maintains a spreadsheet listing **data review points** (e.g., ID match, terms match, rate match) and what constitutes pass/fail/needs-review. \[2 April, 01:18–03:13; 18 April, 01:18–04:10\]

   * Also used as test artifact for both Drively and Docsumo POCs. \[2 April, 07:39–09:26\]

4. **Third-party “Location Services”**

   * Provides state-specific **title requirements** and related data (e.g., which title packet to use). \[2 April, 15:32–16:22\]

5. **AWS Textract**

   * Already used for some document work; Joseph explicitly mentions Textract as a benchmark when comparing Docsumo’s value proposition. \[24 April, 36:43–37:33\]

6. **Drively (competing vendor)**

   * Auto-specific platform being evaluated in parallel; they tested the same records and rule book with Drively and saw decent extraction plus needs-review/fail reasoning. \[12 March, 01:26–02:35; 24 April, 00:00–00:33\]

7. **Docsumo (evaluation stage)**

   * Has shown demos of AI auto-classification, extraction, validation rules, external data tables, embedded review UI, and JSON/Excel outputs. \[18 April, 05:22–10:22; 24 April, 04:31–09:58; 24 April, 16:02–17:20\]

*(They almost certainly use an e-sign provider for contracts, suggested by casual reference to “DocuSign” for the NDA, but contract e-sign tooling in the loan process itself is not explicitly described. \[12 March, 00:00–00:18\] – **Assumption** that e-sign is used for loan docs.)*

### ***Manual Steps, Pain Points, Bottlenecks & Risks***

***1\. Manual document ingestion and data entry***

* *Staff must retrieve docs from email/SMS, upload to the CRM’s specific doc slot, and re-type all fields (e.g., driver’s license details), for every deal. \[18 April, 12:17–13:18\]*

* ***Pain:** Time-consuming and repetitive; error-prone (e.g., B vs 8 confusion in license numbers). \[18 April, 16:44–17:53\]*

* ***Risk:** Typos or missing fields create downstream validation failures or compliance issues.*

***2\. Manual multi-source validation (fulfillment rule book)***

* *Team cross-checks each field across:*

  * *Document vs CRM.*

  * *Document vs lender rate card (right term, right LTV band, right date window). \[2 April, 12:29–13:41\]*

  * *Document vs state and lender rules (e.g., GAP cap per state). \[2 April, 12:29–14:55; 24 April, 13:34–14:21\]*

* ***Pain:** Complex, cognitive heavy work repeated on every deal; needs senior staff; extremely hard to scale.*

* ***Bottleneck:** This is the major contributor to the **27-hour average delay** in sending contracts. \[2 April, 10:48–12:29\]*

* ***Risk:***

  * *Misapplied rules can lead to incorrect pricing or non-compliant contracts.*

  * *Inconsistent application of rules across processors.*

***3\. Title document QA***

* *Titles team must confirm page count, presence of all required documents, signature presence, and absence of scratched-out content. \[24 April, 27:06–28:32\]*

* ***Pain:** Packages can be 20–30 pages, but they may only need a handful of data points and checks. \[24 April, 48:25–49:25\]*

* ***Risk:***

  * *Missing signature or scratched content invalidates title docs.*

  * *Sending incorrect title packet (wrong state or requirements) creates rework and delays.*

***4\. Re-installment contract interpretation (warranty/GAP refunds)***

* *Humans read through verbose contract language to determine whether products are refundable, how, and to estimate refunds. \[18 April, 23:32–26:25\]*

* ***Pain:** Highly manual interpretation of unstructured text.*

* ***Risk:** Inaccurate refund estimates could be a customer experience or compliance problem.*

***5\. Rules engine management & ownership***

* *They know they must build a **“giant checklist”** and rules table (universal, lender-specific, state-specific), regardless of the tool. \[1 May, 00:00–01:45\]*

* *CTO & Joseph worry about:*

  * *Where that rules engine should live (internal vs Docsumo).*

  * *What happens if they leave Docsumo – would they have to re-implement everything? \[1 May, 04:08–07:09; 24 April, 33:31–34:12\]*

* ***Pain:** This is strategic work requiring engineering and PM bandwidth that is already constrained.*

* ***Risk:** Vendor lock-in and duplicated effort if rules are split across multiple systems.*

***6\. Monitoring & re-validation***

* *They worry about how often validations are re-run when CRM data changes (e.g., payoff changes, first payment date changes) and whether this needs manual buttons, status-change triggers, or scheduled jobs. \[1 May, 01:45–02:13\]*

* ***Risk:** Data could drift out of sync between Docsumo and CRM, undermining trust in automated decisions.*

***7\. Scale, cost and uptime constraints***

* *Scale: up to \~20k docs/month and 5 docs per deal as a high-level estimate. \[24 April, 49:58–50:38\]*

* *Cost: they want to understand per-page economics, especially for long title packs where only a few fields are needed; 10–25 cents/page has been discussed, with lower pricing for long docs. \[24 April, 42:36–44:42; 24 April, 48:25–49:37\]*

* *Uptime: they explicitly ask what happens if Docsumo is down and how that impacts operations. \[1 May, 07:09–08:20\]*

* ***Risk:** Operational dependence on an external service; potential need for fallbacks.*

# Desired Future Process with Docsumo (TO-BE)

## **Desired Future Process with Docsumo (TO-BE)**

The future vision is multi-phase: quick POC, then CRM-integrated workflow for stipulations and titles, leading towards “push-button contracting”.

### **Phase 1 – POC / Spreadsheet Output (short term)**

**Step T1 – Provide sample data and rule book**

* They send Docsumo:

  * \~10 example deals, each with applications (CRM screenshots), approvals, and all related stip docs (DL, registration, book-out, etc.). \[2 April, 07:39–09:26; 18 April, 07:39–08:34\]

  * The same **Excel rule book** used for Drively tests. \[2 April, 01:18–03:13; 24 April, 00:00–00:33\]

**Step T2 – AI auto-classification of deal packets**

* **Docsumo automates:**

  * Ingest each **deal packet** and split into document types (DL, book-out, registration, NV/TIS, approvals, etc.) using **AI auto-classifier**. \[18 April, 05:22–08:30; 24 April, 02:44–04:31\]

* **Human still involved:**

  * Confirm mapping is correct and adjust training if needed.

**Step T3 – Document-level extraction**

* **Docsumo automates:**

  * For each doc type, extract required fields using custom models that can be configured via UI (add/remove fields, define data types, fix formats like MM/DD/YY vs DD/MM/YY). \[18 April, 08:30–12:17; 24 April, 20:19–21:34\]

  * Leverage continuous learning: corrections on low-confidence fields improve the model over time. \[18 April, 09:58–10:22\]

**Step T4 – Validation vs CRM “screenshots” and rule book**

* **Docsumo automates:**

  * For POC, they *simulate* CRM data by extracting from the provided screenshots, then run rule-book checks (name match, applicant count, tier score, term, rate, expiry dates, etc.). \[24 April, 06:43–09:58\]

  * Flag each check as **pass, fail, or needs review**, and show both values when mismatched (document vs CRM). \[24 April, 06:43–09:58; 18 April, 04:10–05:06\]

* **Outputs:**

  * Excel or JSON output listing all validations with status and reasons – essentially an automated version of their current spreadsheet. \[24 April, 16:02–17:20\]

**Step T5 – Manual review of POC results**

* **Humans:** Mike, Sol, Joseph, and devs review:

  * Extraction accuracy.

  * Correctness and completeness of pass/fail/needs review and associated reasons. \[24 April, 00:00–00:33; 18 April, 30:25–32:05\]

* **Success criteria:** Demonstrate that Docsumo can at least match Drively’s POC performance and ideally do more (easier config, broader doc types, stronger rules support). \[24 April, 00:00–00:33; 18 April, 28:59–33:50\]

### **Phase 2 – CRM-Integrated Stipulation Workflow**

**Step T6 – API-based ingestion directly from CRM**

* **Docsumo automates:**

  * Receive documents and **metadata (CRM field values, lender, state, etc.)** via API when docs are uploaded or when a deal hits a certain status. \[18 April, 13:18–17:55; 24 April, 10:17–11:43\]

* **Humans:** CRM/engineering team sets up API calls and mapping; Docsumo’s CS team assists during onboarding. \[24 April, 40:23–41:26\]

**Step T7 – Auto-classification and extraction at scale**

* Same as Phase 1, but now triggered automatically from CRM events rather than manually uploading sample files. \[18 April, 05:22–10:22\]

**Step T8 – Two-way matching (document vs CRM)**

* **Docsumo automates:**

  * Compare extracted values from each doc to the CRM values sent as metadata (name, DOB, address, amount, etc.). \[24 April, 06:43–09:58; 18 April, 15:01–17:53\]

  * Mark each field:

    * Pass – both sources match.

    * Fail – mismatch, with JSON including “CRM value” and “document value”.

    * Needs review – field missing/low confidence. \[24 April, 06:43–09:58; 24 April, 25:18–25:46\]

* **Output:** JSON per document/packet with structured `matches`, `mismatches`, and `exceptions`. \[24 April, 16:02–17:20\]

**Step T9 – Three-way matching with external rule tables**

* **Docsumo automates:**

  * Use an **external data table** feature to load state and lender rules from CSV (e.g., max GAP by state, LTV limits, date windows for rate cards). \[24 April, 13:34–16:02\]

  * Attach this table to the document type, and post-process extracted values through rules (e.g., “if GAP \> max\_for\_state then fail and explain”). \[24 April, 17:20–18:39; 24 April, 21:34–22:20\]

* **Humans:** Docsumo CS \+ the customer define and maintain rule tables; business teams supply rule content. \[24 April, 21:34–22:20; 1 May, 04:59–07:09\]

**Step T10 – Embedded review UI for exceptions**

* **Docsumo automates:**

  * Generate a **single URL** per document or per packet that opens the Docsumo review screen (with two-pane view: document and field list). \[18 April, 13:18–17:55; 24 April, 22:57–24:59\]

* **CRM team:**

  * Embed that URL as an iframe inside the CRM (similar to Salesforce example shown), so users never leave CRM. \[24 April, 22:57–24:59\]

* **Human action:**

  * Only open the embedded review UI when the JSON indicates mismatches or missing mandatory fields. \[24 April, 25:46–27:06\]

**Step T11 – Straight-through processing (STP)**

* **Docsumo automates:**

  * For documents/packets where all mandatory fields pass and confidence is high, mark as “ready” and send the JSON directly back; **no human review needed**. \[24 April, 25:46–27:06\]

* **Humans:**

  * Focus only on the subset with fails/needs review (e.g., license expiry, name mismatch).

* **Expected impact:**

  * Dramatically reduce manual checks; Vikram cites other customers where \>90% of docs are not manually reviewed once rules and extraction are stable. \[24 April, 25:46–27:06\] *(Example from other customers; not yet a committed target for this customer.)*

**Step T12 – Re-validation when CRM data changes**

* **Docsumo \+ CRM automates:**

  * CRM sends updated metadata (e.g., corrected name) to Docsumo via metadata API; Docsumo recomputes validations and updates JSON. \[24 April, 37:33–38:48\]

  * Optionally, they can schedule a **cron-like job** to periodically re-run checks or trigger revalidation on status changes. \[1 May, 01:45–03:55\]

* **Humans:**

  * Fix the source data in CRM; no need to manually manipulate rules in Docsumo for simple corrections.

### **Phase 3 – Push-button Contracting & At-bank Automation (longer term)**

**Step T13 – Titles and long documents**

* **Docsumo assists/automates:**

  * Extract a small set of fields (e.g., names, VIN, doc numbers) from long title packs. \[24 April, 48:25–49:37\]

  * Check **page count**, presence of required documents, and presence of signatures. \[24 April, 27:06–27:47\]

* **Limitations & open R\&D:**

  * Docsumo can detect *whether* a signature is present, but not whether it matches a known signature or detect all forms of “scratched-out” edits without further experimentation. \[24 April, 27:47–28:32\]

* **Humans:**

  * Handle edge cases like scratched-out text until (or if) automation proves reliable.

**Step T14 – Rate card, lender rule and state rule orchestration**

* **Docsumo automates:**

  * Convert **policy/rate documents** into structured tables by defining a “policy” or “rule” document type and extracting clauses as fields. \[24 April, 19:37–21:34\]

  * Use those structured rules in post-processing to validate each approval (correct rate, correct term, correct discount for autopay, etc.). \[2 April, 12:29–13:41; 24 April, 13:34–16:02\]

* **Humans:**

  * Decide which rules to keep in Docsumo vs their own CRM rules engine (for non-document logic like first payment date calculations). \[24 April, 33:31–34:12\]

**Step T15 – Re-installment contract analytics (front-end & post-sale)**

* **Docsumo assists:**

  * Extract “does this contract include warranty?”, “does it include GAP?”, product cost, purchase date, and key refund-policy clauses. \[18 April, 23:32–26:25\]

  * Feed those into their internal calculation logic for refund estimates.

* **Humans/CRM:**

  * Own the actual refund calculation formulas and customer communication.

**Step T16 – Push-button contracting**

* **End-state vision:**

  * Rep builds offer and customer says “yes” on the phone.

  * System **runs all validations in one shot** (stipulations, lender rules, state rules, titles, rates, products). \[2 April, 10:48–12:29; 24 April, 11:02–11:43\]

  * Any errors (e.g., expired license, missing signature, GAP too high) are immediately surfaced so they can fix them live with the customer. \[2 April, 06:36–07:09; 24 April, 27:06–28:32\]

  * Once clean, the system **generates the correct contract package** and sends it for signature while the customer is still on the call. \[2 April, 10:48–12:29\]

* **Docsumo’s role:**

  * Automate document ingestion, extraction and validation across all relevant docs.

  * Feed structured results into CRM; optionally host parts of the rule engine that are document-dependent.

* **Human role:**

  * Define business rules, manage exceptions, and design non-document workflows (e.g., payment schedule, notifications).

**Their definition of success**

* Reduced **cycle time** from \~27 hours toward near real-time contracting. \[2 April, 10:48–12:29\]

* Reduced **manual review scope** – from 100% of files to only the subset with fails/needs review. \[2 April, 12:29–13:13; 24 April, 25:46–27:06\]

* Lower **headcount growth** and less need to hire additional developers or processors as volume grows. \[18 April, 30:25–32:05; 24 April, 31:54–32:43\]

* Decreased **error and compliance risk** through consistent rule application. \[2 April, 12:29–14:55; 24 April, 13:34–14:21\]

[image1]: <data:image/png;base64,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>
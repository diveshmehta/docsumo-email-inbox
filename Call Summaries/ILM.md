# AS-IS Process

### **Current Process (AS-IS)**

1. ### **Physical checks received from clients**

* **Role:** Client → ILM operations/project managers (Molly, Brandy).  
* **Inputs:** Physical checks from multiple clients.  
* **Action:** ILM receives batches of checks to process and host in the client’s DMS  
* **Outputs:** Batches ready for scanning.

### **2\. Scanning checks on production scanners**

* **Role:** ILM production/scanning team (under operations / Stosh).  
* **Tools:**  
  * **IBML production-scale scanners** (\~$125k–150k each).  
  * Scanning software connected to ILM’s **local file server**.  
* **Action:**  
  * Scan physical checks using IBML scanners.  
  * Images are written to ILM’s **internal file server**.  
* **Inputs:** Physical checks.  
  **Outputs:** Check images stored on internal file server, organized per client/batch.

### **3\. OCR / data capture on checks**

* **Role:** ILM IT/developer (Stosh) \+ internal systems.  
* **Tools:**  
  * **Prime Recognition** multivote OCR engine for recognition.  
* **Action:**  
  * Run OCR on check images to extract fields like **amount, payee, etc.**  
  * **MICR line** (routing/account/check number) is also attempted but accuracy is poor.  
* **Inputs:** Check images from file server.  
* **Outputs:** Raw extracted data for each check (often needing repair).

### **4\. Manual quality control & data repair**

* **Role:** ILM operators \+ project managers (Molly & Brandy) organizing work.  
* **Tools:**  
  * Internal tools / interfaces (not described in detail).  
  * Email / task assignments from PMs.

* **Action:**

  * Operators manually review and correct all fields that OCR mis-reads, **especially MICR line**.  
  * For each check: verify **account number, routing number, check number, amount, payee**, etc.  
* **Performance:**  
  * **Throughput:** \~**50–55 checks/hour** per operator when capturing all required fields.  
* **Outputs:** Corrected data for each check, accurate enough (ILM targets \~99.99% accuracy for their service overall).

### **5\. CSV creation for DMS ingestion**

* **Role:** ILM IT/developer \+ operations (Stosh, team).  
* **Tools:**

  * Spreadsheets/CSV creation tools.  
  * Internal scripts/importer tools.

* **Action:**  
  * Build **CSV files** that include:  
    * **File name**,  
    * **File path** on file server,  
    * Extracted data fields (amount, check number, etc.).

  * CSV schema is **client-specific** (different clients require different fields).  
* **Inputs:** Reviewed/corrected data \+ file locations.  
* **Outputs:** Client-specific CSVs ready for import.

### **6\. Uploading into client DMS**

* **Role:** ILM IT/admin team (Stosh) managing shared DMS instances.  
  **Tools:**  
  * **Document Management Systems (DMS)** – created and hosted by ILM but client-specific.  
  * **FTP clients** or other importer tools to push images and CSV data.

* **Action:**  
  Use FTP/importer tool to **ingest CSV \+ images** into DMS.

  * Ensure each check image is associated with correct metadata fields in DMS so clients can search and view.

* **Outputs:** Fully indexed checks available to end-clients in DMS.

### **7\. Monitoring throughput & handling growth**

* **Role:** Jason (leadership), project managers, Stosh.  
* **Inputs:** Check volumes (\~3,000 to \~5,000 checks currently; can double as they onboard check-heavy clients).  
* **Action:**  
  * Monitor volumes and operator capacity.  
  * Evaluate whether manual \+ existing tools remain cost-effective vs automation (e.g., Docsumo, Veryfi, Mindee).

* **Outputs:** Decisions on tooling investments and prioritization.

# Pain Points, Bottlenecks, Risks (by area)

### **Pain Points, Bottlenecks, Risks (by area)**

#### **1\. MICR line accuracy**

* **Pain:**  
  * MICR line (routing, account, check number) is *“often very difficult to pick up with traditional scanners and OCR”*; other fields (amount, payee, etc.) are usually fine.

* **Bottleneck:**  
  * Operators must spend disproportionate time repairing MICR fields, which limits throughput.

* **Risk:**  
  * MICR errors directly affect deposits and client trust; ILM targets \~99.99% accuracy, so even 95% automated capture still requires careful review.

#### **2\. Throughput vs ROI**

* **Current throughput:**  
  * Manual: **50–55 checks/hour** per operator.  
  * Earlier Docsumo test: **100–120 checks/hour**, but combined labor \+ software cost was **\~30% higher** for ILM at that volume.  
* **Pain:**  
  * At current volume (\~3k–5k checks, potentially doubling), Docsumo must deliver enough productivity gains to offset software cost.  
* **Risk:**  
  * If ROI doesn’t work, ILM cannot justify switching, even if the tech is faster. They emphasize it’s **“not price, it’s return on investment”**.

#### **3\. Building & maintaining “repair/reject” UI**

* **Pain:**

  * ILM has **recognition “side down”**; their OCR is as good as Docsumo’s on non-MICR fields. What they lack is a robust **repair/reject interface** for operators.

  * They intended to build such an interface internally but have been **“too busy”**; project keeps falling down the priority list.

* **Risk:**

  * Without a robust UI, scaling operators and managing quality gets harder as volumes grow.

#### **4\. CSV \+ DMS ingestion complexity**

* **Pain:**  
  * Need to **generate CSVs** with file path \+ fields per client; schemas differ by client.  
  * Manual or semi-manual CSV building is time-consuming and error-prone.

* **Risk:**  
  * Misalignment between CSV and DMS configuration can break imports or mis-index checks in DMS.

# Desired Future Process with Docsumo (TO-BE)

## **Desired Future Process with Docsumo (TO-BE)**

Below is how ILM implicitly wants the process to work, based on what they reacted positively to and requested.

### **1\. Ingestion from scanners to Docsumo (automated where possible)**

* **Who:** Stosh / ILM IT \+ Docsumo team for setup.

* **Docsumo’s role (Automate):**

  * Connect Docsumo via **API** to either:

    * IBML scanners (if open API is available), or

    * A centralized repository (e.g., local file server, or cloud storage like S3 / Drive) that receives scanned images.

  * As soon as a check image lands in that repository, it is **auto-imported** into the relevant Docsumo **check document type**.

* **Human role:**

  * Maintain scanning operations as today; no manual upload needed.

### **2\. Automated OCR \+ VLLM \+ MICR extraction**

* **Who:** Docsumo’s back-end models.

* **Docsumo’s role (Automate):**

  * Use **VLLM-based extraction** \+ specialized MICR region logic to extract:

    * Account number, routing number, check number (MICR),

    * Amount (numbers & words), payee, dates, etc.

  * Leverage **field-specific prompts** (e.g., “check number is at bottom in MICR font”) to improve MICR capture.

  * Run multiple LLMs in ensemble and compute confidence; only low-confidence fields go to human review.

* **Human role:** None at this stage.

### **3\. Human review focused on exceptions only**

* **Who:** Operators \+ project managers (Molly & Brandy assigning work).

* **Docsumo’s role (Assist):**

  * Present checks in a **Data Table view**: one consolidated table of all checks and fields across a batch.

  * Highlight **low-confidence** fields (e.g., MICR fields with yellow dots).

  * Allow operators to:

    * Filter by client, status, user, or confidence.

    * Hide non-essential fields so they only validate what matters (e.g., MICR only).

    * Click a field to see only the relevant snippet or open full check in **Review in detail** if needed.

  * **Continuous learning** uses operator corrections (e.g., correcting MICR) to retrain the model and improve future accuracy.

  * Define **straight-through rules** (e.g., amount-in-words \= amount-in-numbers, MICR confidence \> threshold) to skip human review for clean cases.

* **Human role (Review):**

  * Operators focus on low-confidence or exception cases only.

  * Molly/Brandy configure teams, assign queues, and ensure coverage.

### **4\. Per-client configuration & separation**

* **Who:** Stosh \+ Docsumo admin users.

* **Docsumo’s role (Assist):**

  * Duplicate the check model into **client-specific document types** (e.g., “Checks – Client A”, “Checks – Client B”), each with:

    * Tailored field list (only fields that client wants).

    * Separate folders/queues and user permissions.

  * Let operators hide fields that are not relevant for that client in the review UI, while still exporting full data if needed.

* **Human role:** Configure per-client models once; maintain as needed.

### **5\. Automated CSV export aligned with DMS needs**

* **Who:** Stosh \+ operators.

* **Docsumo’s role (Automate):**

  * From the Data Table, **export** all checks for a client/batch as Excel or JSON, including:

    * File name (title), doc ID, status, etc.,

    * Extracted fields (amount, MICR, payee, etc.).

  * (Assumption) Configure a repeatable export format matching each client’s DMS import schema, so ILM only needs minor transformations before upload.

* **Human role (Light manual):**

  * Convert Excel to CSV if needed and feed into existing importer tools.

### **6\. Ingestion into DMS and client access**

* **Who:** ILM IT/admin team.

* **Docsumo’s role:** Provide consistent, accurate CSV outputs with file names so mapping to images is straightforward.

* **Human role:** Continue using FTP/importers to push into DMS as today, but with less prep and fewer errors.

### **7\. Monitoring, analytics, and scaling**

* **Who:** Jason \+ PMs \+ Stosh.

* **Docsumo’s role (Assist):**

  * **Analytics dashboard** showing:

    * Documents uploaded vs. processed vs. reviewed,

    * Average processing time vs. operator turnaround time,

    * Straight-through percentage.

  * User-level metrics (time per document, throughput) to identify bottlenecks.

* **Human role:**

  * Adjust staffing, thresholds, and client pricing based on throughput and accuracy.

| Stage / Step | Before Docsumo (Current) | After Docsumo (Future) | Value / Impact for Customer |
| ----- | ----- | ----- | ----- |
| 1\. Check intake & scanning | Physical checks scanned via IBML scanners; images saved to local file server. | Same scanners & file server, but images auto-ingested into Docsumo via API/auto-import. | Removes manual uploads; smoother flow from scanner to extraction. |
| 2\. First-pass data capture | Prime Recognition OCR extracts fields; MICR accuracy is poor; all fields treated similarly. | VLLM-based Docsumo model extracts all fields, with specialized MICR logic \+ prompts and ensemble confidence scoring. | Better automatic MICR capture; more fields high-confidence; fewer items needing manual repair. |
| 3\. Review & repair | Operators manually review *every* check; \~50–55 checks/hour; heavy focus on fixing MICR errors. | Operators work from Data Table; only low-confidence/exception checks need review; high-confidence items can be straight-through. | Higher effective throughput per operator, less cognitive load, fewer clicks. |
| 4\. UI for QC (repair/reject) | Existing internal tools; no dedicated, optimized repair/reject UI described; ILM hasn’t had time to build desired interface. | Docsumo provides purpose-built review UI with bounding boxes, confidence colors, per-field prompts, and user assignment. | Faster QC, easier training of new staff, better visibility; solves the “missing repair/reject side” problem. |
| 5\. Client-specific rules & fields | Per-client differences handled through separate CSV schemas and manual process know-how. | Separate Docsumo document types per client; customized fields and queues; ability to hide non-relevant fields in UI. | Cleaner separation per client, lower risk of mixing rules, smoother onboarding of new clients. |
| 6\. CSV creation | Operators/developers build CSVs manually from reviewed data and file paths; convert to CSV; error-prone and time-consuming. | Docsumo’s Data Table export produces a consolidated Excel/JSON (and then CSV) with file name \+ fields for all checks at once. | Significant time saved; reduced manual formatting; fewer mapping errors into DMS. |
| 7\. DMS import | FTP/importer loads CSV \+ images; correctness depends on CSV quality. | Same DMS tools, but fed by higher-quality, more consistent exports from Docsumo. | More reliable imports; less rework due to bad metadata; better client experience. |
| 8\. Monitoring & analytics | Throughput and operator performance monitored manually; no unified analytics view is described. | Docsumo analytics show docs processed, review vs straight-through, average time per doc, API vs human time, user-level stats. | Clear view of productivity; easier to justify ROI and tune staffing/thresholds. |
| 9\. Scaling to more volume / use cases | Manual process hitting ceiling as volume grows; limited by operator availability and UI limitations. | Automation \+ better UI enables higher volumes for checks and future forms (via custom document types) using same platform. | Supports business growth without linear headcount increase; more revenue per operator. |
| 10\. Vendor evaluation & pricing | Tests with March Docsumo showed speed gains but 30% higher total cost at low volume; evaluating Veryfi & Mindee in parallel. | Docsumo offers improved MICR model \+ Data Table \+ flexible credits (e.g., 25/50/100k or 30k over 3 months) to prove ROI over a realistic period. | Increases likelihood that Docsumo demonstrates compelling ROI vs manual and competitors, leading to long-term adoption and expansion. |

# What success looks like

### **What success looks like for ILM (explicit/implicit)**

* **Positive ROI:**

  * Automation \+ human review must be cheaper or at least clearly more scalable than manual (no 30% cost penalty vs manual).

* **Higher throughput:**

  * Effective operator throughput well above current 50–55 checks/hour, ideally approaching or exceeding earlier 100–120 checks/hour with fewer touches.

* **High accuracy:**

  * MICR extraction **≥ \~95%** automated accuracy, with human review closing gap to ILM’s \~99.99% target.

* **Less manual CSV work:**

  * CSV exports ready for DMS import, reducing time spent building these files.

* **Scalability:**

  * Able to handle growing volumes (3–5k checks and beyond, including new clients) without hitting a “ceiling” on production capacity.


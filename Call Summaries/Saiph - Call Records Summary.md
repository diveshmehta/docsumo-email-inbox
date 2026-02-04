# Customer Context (Consolidated Summary)

## **Customer Context (Consolidated Summary)**

* **Who they are:**  
   U.S.–based investor in annuity / court-ordered payment streams, handling both **loan/asset origination (underwriting closing binders)** and **servicing (receiving checks from insurers/banks)**. Documents include court orders, petitions, settlement agreements, state disclosures, annuity contracts/benefit letters, seller IDs, proof of residence, notices of hearing, proof of service, check images, and statements.

* **Key personas:**

  * **Abby** – senior underwriter / case owner for closing binders; does the bulk of manual review today and is “super fast.”

  * **Lauren** – operations / product / technical owner; defines requirements, validations, integration expectations, and helps with checks workflow.

  * **Mila** – will help on checks / servicing side.

  * **John / Paul** – leadership / decision-makers; care about implementation timeline, model count, pricing and scale (1,000–5,000+ cases).

* **What they want to achieve with Docsumo:**

  * **Process underwriting closing binders automatically**:

    * Split multi-hundred-page binders into correct document types.

    * Extract a large set of structured fields from each doc type.

    * Run **cross-document compliance checks** in a case management view (seller name, DOB, SSN, state, originator, purchase price, policy numbers, required phrases in court orders, etc.).

  * **Process check images and statements** from multiple insurance carriers/banks in a second workflow, proving that Docsumo can reliably read different check formats.

  * **Integrate into their Postgres SQL database** via API as the system of record for extracted/validated data.

* **Key constraints / parameters:**

  * Binders average **\~150 pages**, often **100–200+ pages** with lots of repetition (exhibits, duplicates).

  * Manual processing time per binder:

    * Abby: **45–75 minutes**.

    * New underwriters: up to **\~3 hours**.

  * Busy periods: Abby can see **four binders in a single morning**.

  * Documents vary heavily by **state, county, and originator**, including amended petitions, multiple notices of hearing, multiple proofs of service, etc.

  * POC is scoped for **\~3 months**, with success metric of reducing binder processing time and proving robustness for both binders and checks.

---

## **Current Process (AS-IS) – Step-by-Step**

### **Variant A – Underwriting Closing Binders (Origination side)**

1. **Receive binder from originator**

   * **Who:** Abby (primary), sometimes others.

   * **Input:**

     * Email from originator (ex: Black Square) with either:

       * One large **closing binder PDF (\~150 pages)**, or

       * \~12 separate attachments that together form the binder.

     * For portfolio deals, multiple binders or larger “portfolio” packages may come via shared file sites.

   * **Output:** Binder(s) saved to Saiph’s internal storage (exact tool not stated – *assumption*).

2. **Manually split and label documents**

   * **Who:** Abby.

   * **What she does:**

     * Opens the big PDF and **manually breaks it apart** into individual documents: petitions, court orders, settlement agreements, state disclosures, annuity contracts/benefit letters, seller IDs, proof of residence (POR), notices of hearing (NOH), proofs of service (POS), proof of disclosure delivery, check samples, etc.

     * For some vendors (e.g. Black Square), she receives binders already broken apart and named, but **still “takes them apart” and renames** them to her standard.

   * **Inputs:** Original binder PDF and any pre-split attachments.

   * **Outputs:** Individually saved PDFs, named to reflect doc type & context (petition, court order, NOH, etc.).

3. **Manage multiple versions of key documents**

   * **Who:** Abby.

   * **What she does:**

     * Keeps track of **multiple petitions in a file**:

       * Unfiled/unredacted petition (no timestamps).

       * Redacted petition (same document with information removed).

       * Amended petition (latest changes, sometimes only this is received).

     * Ensures these are kept as a **coherent set**, so when binders go to investors, they see the full history of what the court filed and how it was amended.

     * Handles **multiple NOH and POS docs** when the matter returns to court multiple times.

   * **Risk:** If she or a future automated process splits the petition set incorrectly or mislabels amended vs original, investors lose critical context.

4. **Manual document review & data extraction**

   * **Who:** Abby (primary underwriter).

   * **Inputs:** All individual documents in the binder.

   * **What she does (examples):**

     * Reads each doc and **extracts key data**, including:

       * Seller name, DOB, SSN, seller state (from seller IDs, POR, court documents).

       * Originator name.

       * Purchase price and payment stream details (amounts, terms).

       * Policy numbers and annuity/benefit information from annuity contract / benefit letter and sometimes court orders.

       * Intermediary address using context of clauses around payment splits (e.g. payment goes to one party then remitted to another).

       * State, court name, county, case numbers, and parties in NOH and POS.

       * Whether beneficiaries are present and who they are, where required.

       * Country of issue for IDs (e.g. Mexico vs US) when foreign nationals are involved.

     * Writes these into whatever internal system they use (sheet/database – *assumption*).

5. **Manual cross-document compliance checks**

   * **Who:** Abby.

   * **Inputs:** Hand-extracted data from all docs.

   * **What she checks:**

     * Seller name, DOB, SSN **match** across court order, seller ID, SSA docs, and disclosures.

     * **Seller state** (from ID / POR) matches the state in relevant disclosures, and that the **correct state disclosure** is present for where the seller lives.

     * **Purchase agreement date** in one document (e.g. purchase agreement/contract) matches what is referenced in court order or disclosures.

     * **Payment stream description** is consistent across court order, contract, disclosures, and any annuity documentation.

     * **Policy numbers** in annuity contract/benefits letter match any policy reference in court order, if present.

     * **Required phrases** in court orders (e.g. language validating that the order meets specific statutory/formal requirements).

     * Confirms if a value is present once or multiple times and whether duplicates are consistent (e.g. values appearing in multiple sections of a doc).

6. **Identify missing or inconsistent information**

   * **Who:** Abby.

   * **What happens:**

     * Spots cases where originator name is **present in contract but not in disclosure** – she knows that’s acceptable and doesn’t automatically treat as a hard fail.

     * Flags missing documents (e.g. SSA checks, original petitions, certain disclosures).

     * Manages tricky edge cases like proofs of service vs notice-of-hearing certificates, which may have overlapping content but are used differently in their process.

7. **Communication & decisions**

   * **Who:** Abby (with Lauren / John where needed).

   * **Inputs:** Manual review findings.

   * **What she does:**

     * Sends **emails** to originators and internal stakeholders for missing docs, clarifications, or corrections.

     * Once satisfied, she **finalizes the underwriting decision** and prepares whatever package is needed for investors (binder in correct structure, plus internal approvals). (*Exact investor-facing output not fully described – assumption.*)

8. **Scale and training**

   * New staff need **hours per binder (3+ hours)** to do what Abby does in 45–75 minutes due to complexity and domain knowledge.

---

### **Variant B – Checks / Servicing Workflow (Currently nascent)**

1. **Receive check images & statements**

   * **Who:** Primarily Mila & Lauren (servicing).

   * **Input:**

     * Check images \+ statements from Wells Fargo / bank via some “transmission.” They are still working with Wells Fargo to determine **how** these are delivered (likely SFTP / file feed).

2. **Manual processing (implied)**

   * **Who:** Mila / servicing team, with Lauren’s oversight.

   * **What they likely do (explicit detail is limited, so this is an *assumption*):**

     * Split large PDFs of check images into individual checks.

     * Read each check and statement to capture payment info (amount, date, policy/case linkage, etc.) and reconcile with their deal records.

3. **Separation from closing binder workflow**

   * They explicitly state that **checks for USA checks workflow come directly from the bank and should never come from the closing binder**. Closing-binder-related checks must not be classified into the checks pipeline.

# Manual Steps (non-exhaustive)

### **Manual Steps (non-exhaustive)**

* Splitting 100–200+-page binders by hand.

* Manually recognizing and naming doc types (petition, NOH, POS, etc.) including **multiple versions**.

* Extracting all required fields from text-heavy court documents, annuity contracts, and disclosures.

* Doing cross-document comparisons and compliance checks mentally or in spreadsheets.

* Managing exceptions: amended petitions, missing disclosures, foreign IDs, mismatching names, etc.

* Communicating back-and-forth with originators / internal stakeholders to fix issues.

### **Pain Points, Bottlenecks, Risks**

1. **Time & Capacity Constraints**

   * 45–75 minutes per binder for Abby; 3+ hours for newer staff.

   * Binders are **150+ pages**, often with repetitive exhibits, making manual review expensive.

   * At busy times, multiple binders per day (e.g. four in one morning) stretch capacity.

2. **Complex Document Structure**

   * Multiple versions of petitions, notices, proofs of service; amended vs original; redacted vs unredacted—all must be preserved and correctly grouped.

   * Some documents look similar (e.g. court order vs settlement agreement; shipping labels vs different doc types), making classification difficult even for humans.

3. **High Compliance Risk**

   * Requirements differ by **state and county**; each has its own flavors of petitions, orders, notices, and disclosures.

   * Missing or incorrect state disclosures, missing required phrases, or mismatched policy numbers can make deals **non-compliant**.

   * Foreign IDs (e.g. Mexico) require correct **country-of-issue** capture and checks that licenses belong to USA or not.

4. **Manual Cross-Doc Checks Are Error-Prone**

   * Cross-document validation (names, DOBs, SSNs, states, pricing, payment descriptions, policy numbers) is now manual.

   * Multiple occurrences of values within and across documents (and their absence) complicate logic.

5. **Scaling to Higher Volumes is Risky**

   * They are considering acquiring **3,500 records**, with potential to process **\~5,000 cases/year**; current manual process will not scale.

6. **Checks Workflow Still Manual and Underspecified**

   * Need to handle **different check formats** from multiple insurers; currently rely on manual parsing but want a robust automated solution.

# Desired Future Process with Docsumo (TO-BE)

## **Desired Future Process with Docsumo (TO-BE) – Consolidated**

### **High-level goals**

* **Automated ingestion, splitting, and classification** of both binders and check feeds.

* **Structured extraction** of all required fields per doc type.

* **Cross-document validation in a case management UI**, with pass/fail/needs-review status.

* **Continuous learning** from user corrections (no need to re-upload entire documents).

* **API integration** into their Postgres DB, supporting downstream systems.

### **Future Workflow – Underwriting Binders**

1. **Ingestion to Docsumo**

   * **Step:** Originators’ binders are uploaded to a Docsumo doc type called **“AI auto-classifier”** (or a dedicated “Closing Binder Auto-classifier”).

   * **Automation:** System handles large binders (page limit increased beyond 150).

   * **Human:** Decide ingestion channel (UI upload, email dropbox, or API) and naming conventions (*final choice still open*).

2. **AI-driven Split & Classification**

   * **Step:** Docsumo automatically:

     * Splits the binder into individual docs.

     * Classifies each doc into types (petition, court order, NOH, POS, disclosures, annuity contract, benefits letter, seller ID, proof of residence, check stubs, etc.).

   * **Automation:**

     * Uses both **titles and keywords** in the documents and can incorporate more specific rules (e.g. shipping labels where destination indicates doc type; state-specific titles).

     * Supports **custom document types** (e.g. Docusign certificate variants) that Abby / team can add via UI.

   * **Human:**

     * Abby can **manually reclassify** misclassified docs and create new doc types as required.

     * For tricky structures (e.g. petitions that must stay together; NOH vs POS pages), Docsumo’s team will embed rules in the classifier based on binder samples and Abby’s feedback.

3. **Field Extraction per Doc Type**

   * **Step:** Each doc type has a **configured field set** (based on Lauren’s “settlement binder PDF” requirements and subsequent discussions).

   * **Automation:**

     * Extracts:

       * Owner/seller details (name, DOB, SSN, address, state).

       * Originator names where present.

       * Purchase price, payment stream descriptions.

       * Policy numbers from annuity contract and benefit letters.

       * Court details: state, county, case number, beneficiary names (if present).

       * Country of issue and whether ID belongs to USA or not.

       * Intermediary address by reading contextual clauses about payment splits.

       * Lists of dependents in **tabular form**, restricted to the actual dependents table and not including the annuitant.

     * Supports **post-processing code** to manipulate extracted values or route them to downstream systems (formatting, mapping, etc.).

   * **Human:**

     * Abby / Lauren can tweak **prompts** for fields to improve extraction; simple fixes can be done directly in UI (e.g. removing “LLP” from seller name).

     * Annotations/corrections in the review screen train the ML models (**continuous learning**), removing the need to re-upload to correct extraction errors.

4. **Case Management & Cross-Doc Validation**

   * **Step:** Each binder becomes a **case/folder** with all its doc types. A **validation screen** lists checks with pass/fail/needs-review.

   * **Automation:**

     * For each case:

       * Checks **seller name, DOB, SSN** consistency across key docs (COA, seller ID, SSA docs, etc.).

       * Validates **seller state vs disclosure state**; uses “Seller State” instead of “Settlement State.”

       * Checks **originator**: if originator is present on disclosure and differs from contract, it fails; if it’s missing on disclosure (common), that should **not fail**.

       * Matches **purchase agreement date**, **payment stream description**, and **policy numbers** across relevant docs.

       * Confirms presence of specific phrases in court orders that determine validity.

       * Handles **multiple occurrences** logic correctly: if a value appears twice with different values, it fails; if it appears once or not at all, it should not be marked false just because a second occurrence is missing.

       * Implements **amended-document logic** that uses dates to pick the latest amendment and compare that version against others.

     * Provides **summary at top** (all checks passed / issues found) plus per-doc detailed checks (e.g. Seller Name Check, Seller DOB Check, Seller SSN Check).

   * **Human:**

     * Underwriter reviews only the **failed or needs-review** checks, not the entire binder.

     * They can click into each check, view the doc and values side-by-side, and correct mis-extractions or tweak rules.

5. **Exception Handling & Continuous Improvement**

   * **Step:** Abby logs issues in **issue sheets** (for extraction, checks, and classifier problems), which Docsumo treats as tickets.

   * **Automation:**

     * Once the issue is fixed and moved to UAT, they re-run the same doc in Docsumo to see improved results.

   * **Human:**

     * Abby continues to give domain feedback about tricky docs (e.g. petitions, NOH/POS, proofs of disclosure).

6. **Export & Integration**

   * **Step:** Validated case data is **exported via Docsumo API** into Saiph’s Postgres DB.

   * **Automation:**

     * Docsumo will send extracted/validated fields to the database, which Saiph is designing to match the doc types & field sets.

   * **Human:**

     * Saiph’s tech/contracting team configures API integration and mapping.

# Customer Journey: Before vs After Docsumo (Table)

## **Customer Journey: Before vs After Docsumo (Table)**

| Stage / Step | Before Docsumo (Current) | After Docsumo (Future) | Value / Impact for Customer |
| ----- | ----- | ----- | ----- |
| 1\. Binder Receipt | Originators email 150+ page binders or multiple attachments; Abby downloads and stores them manually. | Binders uploaded directly into Docsumo’s “AI auto-classifier” / closing binder doc type via UI/email/API. | Centralized, trackable ingestion; no manual routing; ready for automated processing. |
| 2\. Splitting & Document ID | Abby manually splits PDFs and labels dozens of doc types, including multiple versions of petitions, NOH, POS, etc. | Docsumo splits binders and auto-classifies docs into configured doc types; Abby only fixes edge cases and creates new doc types as needed. | Huge time saving; more consistency; reduced risk of mislabeling or missing docs. |
| 3\. Field Extraction | Abby reads each doc and manually keys seller details, state, originator, purchase price, payment stream, policy numbers, etc. | Docsumo extracts configured fields per doc type, including complex items like intermediary address, NOH details, foreign ID country, and dependents tables. | Less data entry; fewer manual errors; consistent structured data ready for DB. |
| 4\. Cross-Doc Validation | Abby manually cross-checks consistency across documents (names, SSNs, policy numbers, states, payment descriptions, required phrases). | Case management screen shows pass/fail/needs-review per rule, with reference vs value for each check and logic for missing values and multiple occurrences. | Risk reduction; faster review; easier training for new staff; standardization of compliance checks. |
| 5\. Exception Handling | Missing docs or inconsistencies discovered late by Abby; she emails originators/internal team to resolve; no central issue tracking. | Issues logged in structured Excel issue/validation sheets; Docsumo team adjusts models/prompts/code; Abby re-tests in platform with updated models. | Systematic continuous improvement; less back-and-forth; faster iterations on edge cases. |
| 6\. Learning & Corrections | Corrections require re-reading docs; sometimes Abby re-creates docs or corrects repeated errors manually; no machine learning feedback loop. | Abby corrects extraction or classification via review screen; platform’s continuous learning uses annotations, so the same errors diminish over time without re-uploads. | Increasing automation quality over time; reduced recurring manual work. |
| 7\. Output & Handoff | Underwriting results live across emails, personal files, and possibly spreadsheets; integration to systems is manual. (*Assumption*) | Validated data exported via API to Postgres DB; consistent mapping of fields to internal systems. | Single source of truth; easier analytics and downstream automation. |
| 8\. Checks / Servicing | Bank transmits check images and statements; Mila/Lauren likely split and key manually; checks are separate from binder workflow but not yet systematized. | Dedicated checks auto-classifier/doc type splits check PDFs into individual checks and extracts key check data; separated from binder docs and with tailored validations. |  |

# Definition of Success (explicit/implicit)

### **Definition of Success (explicit/implicit)**

* **Binder processing time** significantly reduced from 45–75+ mins to much lower (target not explicitly stated, but reduction is a core POC metric).

* **High validation coverage** and accuracy for their main doc types (court order, contract, disclosures, annuity docs).

* **Ability to handle complexity**: amended petitions, multiple NOH/POS, foreign IDs, many originators/states.

* **Scalability** to thousands of cases and large portfolios (3,500–5,000 records) with clear pricing and processing economics.

* **Positive user experience**: Abby and Lauren repeatedly say they like the validation view and splitting improvements when things work correctly.

---


# Case Evaluation JTBD

### Job statement
**When** I’m processing many loan-application cases through automated extraction + validations, and exceptions are causing rework and delays,
**I want** a case evaluation system that shows me the **most common/frequent issues**, explains **exactly what’s wrong and why**, and helps me **improve + experiment + confirm** fixes,
**so I can** increase straight-through processing, cut time-to-decision, reduce manual touches, and maintain audibility.
(Semine: SLA + operator cost + need transparent guidance; Brevet: UI mainly for debugging/edge cases; InterTek: “missing docs vs complete pack” risk)

* * *
## Jobs to be done (prioritized)
### 1) Understand what’s going wrong across cases ( Analytics)
*   **\[Critical\]** Identify the **top recurring failure reasons** across cases (missing docs, failed validations, low-confidence extractions, integration errors) with frequency + trend.
*   **\[Critical\]** Break down issues by **case type / document type / source channel / assignee / vendor/customer segment** to find concentrated failure clusters.
*   **~~\[High\]~~** ~~Quantify operational impact per issue (time lost, review touches, SLA risk) to prioritize fixes by ROI.~~
### 2) Explain what’s wrong in a specific case (case-level diagnostics)
*   **\[Critical\]** For any failed/slow case, show a **single “Case Health” summary**: what passed, what failed, what’s missing, and what’s waiting on humans.
*   **\[Critical\]** For each failure, show **actionable reason** and **“what to do next”** (chase borrower vs fix config vs re-run vs override).
*   **\[High\]** Provide evidence for extraction issues (field-level confidence, bounding-box/source snippet, conflicting candidates) so an operator can verify quickly.
*   **\[High\]** Distinguish **data problems vs doc problems**: “missing required document” vs “doc present but unreadable/too large/wrong language/template.”
### 3) Learn from corrections and validations (feedback signals)
*   **\[Critical\]** Track **human corrections** by field/doc type: what was changed, how often, and common “before → after” patterns.
*   **\[High\]** Surface the **most frequently failing validations** (incl. cross-doc checks) and the fields driving them.
*   **\[High\]** Detect **rule drift** (a validation that used to pass now fails) and flag regressions early.
### 4) Improve, experiment, and confirm improvements (closed-loop iteration)
*   **\[Critical\]** Let me propose a change (classifier tweak, extraction config/prompt, validation rule, threshold) and test it on a **representative evaluation set** before shipping.
*   **\[Critical\]** Compare **Before vs After** on the same cases: STP rate, exception rate, correction rate, key-field accuracy proxies, and time-to-decision.
*   **\[High\]** Enable safe rollout (versioning) and the ability to **re-run** workflow/validations when documents are updated, without losing audit trail.
*   **\[High\]** Recommend “next best fixes” automatically (top 3 configs to change) based on clustering of failures and correction patterns.
### 5) \[Low\]Prove compliance & auditability
*   **\[High\]** Produce an **auditable case record**: documents + extracted data + validations + who changed what + timestamps (pre/post decision).
*   **\[Low\]** Export evaluation insights and issue breakdowns to downstream systems (BI, LOS, CRM) for cross-team visibility.
* * *
## How competitors solve adjacent parts of this problem (patterns + references)
*   **Extend**: “Evaluation Sets” to continuously test processors and verify improvements. [Extend Developer Documentation+1](https://docs.extend.ai/product/evaluation/overview?utm_source=chatgpt.com)
*   **n8n**: Load data from past executions to debug and re-run workflows. [n8n Docs](https://docs.n8n.io/workflows/executions/debug/?utm_source=chatgpt.com)
*   **Zapier**: Zap History + replay errored runs for debugging after changes. [help.zapier.com+1](https://help.zapier.com/hc/en-us/articles/8496291148685-View-and-manage-your-Zap-history?utm_source=chatgpt.com)
*   **Parabola**: Run History showing successful/failed runs for operational debugging. [parabola.io](https://parabola.io/product/overview/updating-and-running-your-flow?utm_source=chatgpt.com)
*   **ABBYY FlexiCapture**: Rule validation layer for field constraints and data checks. [help.abbyy.com](https://help.abbyy.com/en-us/flexicapture/12/distributed_administrator/rules?utm_source=chatgpt.com)
*   **Rossum**: Business-rule validation + schema validation errors as part of extraction workflow. [Rossum.ai+1](https://rossum.ai/platform/validate-data/?utm_source=chatgpt.com)
*   **Klippa DocHorizon**: Human-in-the-loop reviews driven by confidence/candidates; configurable review conditions. [dochorizon.klippa.com+1](https://dochorizon.klippa.com/docs/hitl/reviews?utm_source=chatgpt.com)
*   **Nanonets**: Confidence scores used to route low-confidence fields into manual review; overall doc confidence. [Nanonets](https://docs.nanonets.com/docs/confidence-scores?utm_source=chatgpt.com)
*   **Ocrolus**: Confidence scores + authenticity/tamper scoring; also cross-source validation to reduce “stare and compare.” [Ocrolus API+2Ocrolus API+2](https://docs.ocrolus.com/docs/confidence-score?utm_source=chatgpt.com)
*   **MoneyThumb**: Bank-statement analytics + fraud detection positioning for lending workflows. [MoneyThumb+1](https://www.moneythumb.com/?utm_source=chatgpt.com)
*   **Reducto**: Extraction responses include confidence + citations (source locations) to support audit/debug; positioning includes “observability tools.” [reducto.mintlify.app+2docs.reducto.ai+2](https://reducto.mintlify.app/extract/response-format?utm_source=chatgpt.com)
*   **Omni** (data platform): “Content Validator” concept for validating changes before publishing (branching recommended). [docs.omni.co](https://docs.omni.co/modeling/develop/content-validator?utm_source=chatgpt.com)
*   **Heron Data**: Validation action guides emphasize exception rate + validation metrics framing. [herondata.io+1](https://www.herondata.io/action-guides/validate-for-bank-statements?utm_source=chatgpt.com)
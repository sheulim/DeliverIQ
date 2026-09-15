# DeliverIQ Build 25 — Product Scope Increment

This is cumulative from Build 24. It does not remove prior functionality.

Implemented in this increment:
- Global project-workspace navigation: DeliverIQ logo links Home; Home, Projects, Prompt Library and ProofLayer AI are visible.
- Prompt Library foundation with categorized, selectable prompt cards and Copy Prompt UX. Includes Daily Brain Dump → Action Plan and 1:1 Preparation exactly as agreed (with typo cleanup only), plus initial practitioner prompt set.
- ProofLayer AI specialist-copilot foundation with three evidence gates, evidence dimensions, human-accountability guardrail and auditable decision states.
- Homepage/footer discovery links for Prompt Library and ProofLayer AI.

ProofLayer next production increment:
- document/CSV ingestion
- evidence-linked acceptance matrix
- sign-off/waiver workflow
- contradiction detection
- go/no-go, rollback, hypercare and decommission executive exports
- run-cost avoided / cost-of-delay calculations

Deferred / owner actions:
- OPENAI_API_KEY/billing remains an environment/account action and does not block non-AI UI/product work.
- Template redesign remains deliberately deferred for user one-by-one review; existing templates are preserved unchanged.
- Live connector execution/secret broker remains a later governed integration increment.

Guardrails:
- AI never grants migration acceptance.
- No fabricated consent, evidence, dates, savings, usage or readiness scores.
- Every material ProofLayer assertion should ultimately link to evidence and named human accountability.

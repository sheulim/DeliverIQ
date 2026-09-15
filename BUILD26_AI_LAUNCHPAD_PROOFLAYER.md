# DeliverIQ Build 26 — AI Project Launchpad + ProofLayer workflow

## AI Project Launchpad
Replaces the single prompt box with guided mobilisation discovery. The AI response is structured into supplied facts, assumptions to validate, missing evidence, objectives, scope, milestones, RAID, dependencies, stakeholders, governance, KPIs, benefits, 30/60/90 mobilisation and attention-first items. Nothing is saved until the user selects **Approve baseline & create workspace**.

Guardrail: unknown dates, budgets, named owners, capacity and compliance facts must remain unknown/assumptions rather than being fabricated.

## ProofLayer AI
Deepens the specialist Migration Acceptance & Decommissioning Copilot with three decision gates, an editable acceptance evidence matrix, rule-based decision state, contradiction radar, decommission cost-of-delay calculator and printable decision pack. AI does not grant acceptance.

`supabase/BUILD26_PROOFLAYER_MIGRATION.sql` adds the production data model for evidence and human decision provenance. The current UI is deliberately usable without this migration; wiring persistence is the next production step after migration application.

## Still intentionally deferred
- Individual template redesign/finalisation pending owner review.
- Live external migration evidence connectors pending secure connector broker/secret store.
- Automated acceptance is prohibited; named humans approve/waive/reject.

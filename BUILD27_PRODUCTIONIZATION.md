# DeliverIQ Build 27 — Productionization increment

Production hardening applied without changing the template-review stream.

- Restored authenticated route protection for `/projects/*`.
- Protected AI Project Launchpad API from anonymous use.
- Added input validation and clearer API/quota/auth failure handling.
- Added project-specific ProofLayer workspace with persistent evidence, RLS-backed storage, decision provenance, contradiction checks, deterministic cost-of-delay and printable decision pack.
- Linked project workspace to ProofLayer.
- Kept AI advisory: it cannot record GO/NO-GO on behalf of an accountable human.
- Preserved Prompt Library, Guides, Metrics, integrations/newsletter foundations and prior cumulative product code.

Live DB migration `deliveriq_prooflayer_build26` is applied separately through Supabase. Full historical schema activation remains a controlled migration stream because production currently began from the Build 24 baseline rather than every Build 6–22 migration.

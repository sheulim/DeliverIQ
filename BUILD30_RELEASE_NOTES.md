# DeliverIQ Build 30 Release Candidate

Cumulative source based on Build 29 (which includes Builds 25–28 integration), plus the Project Learning Lab MVP.

## Build 30 additions
- `/learning-lab` — real-project learning path with Learn → Apply → Submit Evidence → Review → Improve loop.
- `/api/ai/learning-feedback` — evidence-grounded AI coaching endpoint with graceful non-AI fallback.
- Learning Lab links to the Template Library and Consolidated Metrics Dashboard.
- Browser-local learning progress for MVP; no silent writes.
- File selection records filename only in this MVP. The AI is explicitly told that the attachment contents were not inspected.
- Human review remains authoritative; completion is based on reviewed evidence, not content views.
- Shell navigation adds Learning Lab and Metrics Dashboard.
- Package version 0.30.0.

## Existing cumulative capabilities retained
Prompt Library, ProofLayer AI, Intelligence Studio, Metrics Intelligence, practitioner guides, project launchpad, authenticated project workspace, Agile Assistant, templates, newsletter, programme/portfolio/delivery intelligence and Build 29 consolidated metrics dashboard.

## Production note
This is a release candidate for manual GitHub upload and Vercel compile/deployment validation. Do not call it productionized until Vercel build and smoke tests pass.

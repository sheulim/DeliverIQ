# DeliverIQ Build 4

Authenticated, persistent project-workspace MVP.

Features:
- Supabase email/password authentication
- User-specific Projects dashboard
- Project workspace
- Database-backed RAID Manager
- Add/delete RAID records
- Server-side OpenAI project-analysis endpoint
- Server-side AI risk-review endpoint
- Architecture ready for milestones, dependencies and KPIs

Setup:
1. Create a Supabase project and enable Email authentication.
2. Apply the Build 2/3 database schema and RLS policies.
3. Copy .env.local.example to .env.local.
4. Add Supabase URL, anon key, OpenAI API key and model.
5. npm install
6. npm run dev

Never expose OPENAI_API_KEY as NEXT_PUBLIC_.


## Build 6 additions
- Historical delivery snapshots
- Delivery-confidence heuristic
- RAID ageing
- Trend comparison
- "What changed since last review?"
- Predictive watchlist
- Executive trend summary

Run `supabase/BUILD6_MIGRATION.sql` before using the Build 6 intelligence features.


## Build 7 additions
- AI weekly delivery report
- Steering-committee-ready executive summary
- Decisions required and executive asks
- Achievements and next-week priorities
- Report history
- Human review before save

Run `supabase/BUILD7_MIGRATION.sql` before using reporting history.


## Build 8 additions
- Programme / portfolio entities
- Assign projects to programmes
- Cross-project RAG view
- Programme-level RAID and dependency aggregation
- AI systemic-risk identification
- Dependency hotspot analysis
- Programme confidence score
- Executive programme review history

Run `supabase/BUILD8_MIGRATION.sql` before using programme features.


## Build 9 additions
- Dependency Intelligence workspace
- Link dependencies to milestones and downstream projects
- Cross-project dependency heatmap
- Dependency criticality model
- Schedule-slip impact simulation
- AI "What happens if this slips?" analysis
- Simulation history

Run `supabase/BUILD9_MIGRATION.sql` before using Build 9 dependency features.


## Build 10 additions
- Action register
- Decision register
- Owners, due dates and priorities
- Overdue action detection
- AI commitment review
- "What commitments are slipping?"
- Programme-level commitment roll-up

Run `supabase/BUILD10_MIGRATION.sql` before using Build 10 accountability features.


## Build 11 additions
- Meeting register
- Governance meeting types
- AI-generated minutes
- Extracted actions and decisions
- Add extracted items directly to Action / Decision registers
- Meeting history
- Programme-level meeting roll-up

Run `supabase/BUILD11_MIGRATION.sql` before using Build 11 meeting features.


## Build 12 additions
- Stakeholder register
- Influence / interest mapping
- Engagement strategy fields
- AI stakeholder communication drafting
- Executive / business / delivery / vendor variants
- Escalation and decision-request messages
- Communication history
- Programme stakeholder roll-up

Run `supabase/BUILD12_MIGRATION.sql` before using Build 12 stakeholder features.


## Build 13 additions
- Benefits register
- OKR tracking
- Planned vs actual outcomes
- Deterministic value progress score
- AI value realisation review
- Delivery-vs-value gap analysis
- Programme benefits and OKR roll-up

Run `supabase/BUILD13_MIGRATION.sql` before using Build 13 value features.


## Build 14 additions
- Resource register
- Capacity allocation
- Demand vs capacity tracking
- Throughput history
- Deterministic capacity metrics
- AI delivery forecast review
- Programme-level capacity roll-up

Run `supabase/BUILD14_MIGRATION.sql` before using Build 14 forecasting features.


## Build 15 additions
- Project budget register
- Cost entries: actuals, commitments, accruals
- ETC / EAC forecasts
- Variance and burn-rate metrics
- AI financial review
- Benefits-vs-cost signals
- Programme financial roll-up

Run `supabase/BUILD15_MIGRATION.sql` before using Build 15 finance features.

# Final Product Consolidation

This package consolidates DeliverIQ through Build 20.

Core positioning:
**DeliverIQ — The Intelligence Layer for Project Delivery**

Final capability areas:
- Planning
- RAID
- Dependencies
- Delivery health
- Executive reporting
- Programme intelligence
- Dependency simulation
- Actions / decisions
- Meetings
- Stakeholders / communications
- Benefits / OKRs
- Capacity / forecasting
- Finance
- Change / requirements
- Integrations architecture
- AI PM Workspace
- Governance / audit foundations

Start with `FINAL_REVIEW_GUIDE.md`.

## Content, learning & growth enhancements
- Five role playbooks: Scrum Master, Delivery Manager, Project Manager, Program Manager, Portfolio Manager
- Open template library with downloadable CSV / Markdown assets
- CC BY 4.0 license for original DeliverIQ playbooks and templates
- Weekly newsletter subscription endpoint and UI
- Curated PM learning hub
- AI automation future roadmap
- Copyright © 2026 Sheuli A Mukherjee

## Enhanced V2 additions
- Multi-template galleries per PM area
- Full consumable role-playbook structures
- Zoom / Microsoft Teams / Slack / Google Meet meeting-ingestion architecture
- Stakeholder + RACI combined view
- Vaibhav Sisinty AI podcast/video links in learning hub
- AI Lab with runnable future-PM automation demos
- Richer result-message UX planned for all AI actions

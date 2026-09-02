# DeliverIQ Vercel Fixed v3

Fixes the Vercel build failure:
`Error: Missing credentials. Please pass an apiKey...`
during page-data collection for AI API routes.

Change:
- OpenAI clients are now instantiated lazily at request time instead of at module import/build time.
- If OPENAI_API_KEY is not configured, AI endpoints return a controlled 503 response.
- The rest of DeliverIQ can still build and render for review without an OpenAI key.

Files changed:
- app/api/ai/commitment-review/route.ts
- app/api/ai/risks/route.ts
- app/api/ai/impact-simulation/route.ts
- app/api/ai/delivery-intelligence/route.ts
- app/api/ai/delivery-forecast/route.ts
- app/api/ai/delivery-review/route.ts
- app/api/ai/project/route.ts
- app/api/ai/agile-assistant/route.ts
- app/api/ai/programme-review/route.ts
- app/api/ai/stakeholder-update/route.ts
- app/api/ai/status-report/route.ts
- app/api/ai/value-review/route.ts
- app/api/ai/meeting-minutes/route.ts
- app/api/ai/change-impact/route.ts
- app/api/ai/project-copilot/route.ts
- app/api/ai/financial-review/route.ts
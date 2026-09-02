# Meeting Copilot Integration Architecture

Supported architecture:
- Zoom: OAuth + cloud recording/transcript webhook
- Microsoft Teams: Microsoft Graph meeting/transcript APIs
- Slack: app installation + channel/huddle message/event ingestion where APIs and permissions permit
- Google Meet: Google Workspace meeting artifacts where available
- Manual: paste transcript / upload approved transcript

Flow:
Meeting provider
→ authorized company connection
→ transcript/meeting event
→ DeliverIQ meeting ingestion
→ project/programme matching
→ AI minutes
→ extracted actions/decisions/risks/dependencies
→ human review
→ structured registers

Important:
- A company admin/member must authorize the integration.
- Transcript availability depends on provider plan, recording/transcription settings and permissions.
- DeliverIQ should never record secretly.
- Consent, privacy, retention and company policy must be respected.

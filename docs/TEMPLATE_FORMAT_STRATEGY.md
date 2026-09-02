# DeliverIQ Template Format Strategy

Every core public template should be available in:
- XLSX: native Excel; also uploadable to Google Sheets
- CSV: universal tabular interchange
- JSON: AI/agent/API-friendly structured representation

Future formats:
- Google Sheets one-click copies once Google integration is configured
- Microsoft 365 workbook templates through Graph integration
- Notion / Coda / Airtable structured imports
- YAML schemas for AI agents and workflow automation
- JSON Schema for validation and agent-generated artefacts
- MCP resource exposure so AI assistants can discover and instantiate templates

Principle: content should never be locked in a proprietary UI. A user should be able to download, edit, remix, import, automate and AI-enrich every DeliverIQ template.

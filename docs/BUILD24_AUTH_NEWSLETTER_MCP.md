# Build 24 — Authentication, Newsletter & MCP foundation

This cumulative build preserves the existing DeliverIQ product and adds:
- Email/password sign-up and sign-in UX
- Google OAuth entry point and PKCE callback
- Forgot/reset password flow
- Newsletter public archive shell
- Newsletter Studio shell with controlled Draft/Publish/Send workflow
- Newsletter subscription duplicate-safe handling
- Integration & Agent Hub
- MCP / REST / Webhook / Native connector model
- Explicit Read / Recommend / Draft / Execute permission model
- Connector audit-log data model
- Consolidated baseline SQL for core project workspace, newsletter and connectors

Production activation still requires real Supabase environment variables, migration application, Google OAuth provider configuration, and a secure server-side connector broker/secret store.

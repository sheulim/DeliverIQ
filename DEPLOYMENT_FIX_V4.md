# DeliverIQ Vercel Fixed v4

Purpose: stabilize the first browser review deployment.

Changes:
- Supabase browser/server clients now have harmless placeholder configuration
  when NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are absent.
- Authentication middleware is disabled only for this review deployment package,
  avoiding Edge-runtime warnings and preventing missing auth config from blocking
  static generation.
- OpenAI routes retain the v3 lazy initialization fix.
- Cumulative DeliverIQ functionality/content is preserved.

After the review environment is live, real Supabase environment variables and
authentication middleware can be restored for the production deployment.

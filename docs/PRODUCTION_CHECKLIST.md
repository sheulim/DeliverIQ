# DeliverIQ Production Checklist

## Required
- Supabase project configured
- All migrations applied
- RLS enabled and tested
- OpenAI API key server-side only
- Vercel environment variables configured
- Authentication tested
- Project ownership tested
- Programme ownership tested
- AI routes tested with unauthorized users
- Error monitoring configured
- Backups enabled
- Terms / privacy / AI disclaimer added

## Before public launch
- Replace remaining inline CSS with shared design system
- Add robust form validation
- Add structured-output schemas for all AI routes
- Add rate limiting
- Add audit logging to all important mutations
- Add export / backup flows
- Add user-friendly onboarding
- Add empty states and loading skeletons
- Add accessibility pass
- Add automated tests

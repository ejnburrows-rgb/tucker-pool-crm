## 2025-02-12 - Global RLS Bypass in Server Client
**Vulnerability:** `lib/supabase/server.ts` was configured to use `SUPABASE_SERVICE_ROLE_KEY` by default, granting admin privileges to all server-side data fetching and bypassing Row Level Security (RLS).
**Learning:** The codebase contained an explicit comment acknowledging the risk but implemented it anyway. This suggests a history of "making it work" over security.
**Prevention:** Always verify Supabase client initialization in Next.js apps. Ensure `createServerClient` from `@supabase/ssr` is used with `cookies()` for user-scoped access, and strictly limit `SERVICE_ROLE_KEY` usage to specific, named admin functions (e.g. `createAdminClient`).

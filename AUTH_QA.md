# Admin Auth QA

This document records the review and verification plan for the portfolio admin authentication flow.

## Current verdict

The `/admin` route is protected by a real route guard that checks the Supabase Auth session and the allowed admin email from `VITE_ADMIN_EMAIL` before rendering admin content.

## Security checks

| Check | Result |
|-------|--------|
| Supabase Auth client uses environment variables | Passed: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used by `src/lib/supabase.ts`. |
| Admin identity is not hardcoded | Passed: the allowed admin email comes from `VITE_ADMIN_EMAIL`. |
| Passwords are not stored in the repo | Passed: no password was added to source files. |
| Service role key is not used in the frontend | Passed: no service role key was added. |
| `/admin` is not protected by hidden buttons only | Passed: `/admin` renders through `ProtectedRoute`. |
| Any authenticated user is not treated as admin | Passed: the session user email must match `VITE_ADMIN_EMAIL`. |
| Missing admin config fails closed | Passed: missing `VITE_ADMIN_EMAIL` blocks access and shows a clear configuration error. |
| RLS compatibility | Expected compatible: previous Supabase SQL allows admin writes through `public.is_admin()` and does not open anonymous writes. |
| Dangerous frontend auth patterns | Passed: scan found no `service_role`, manual `localStorage` auth, hardcoded `isAdmin = true`, or committed password assignment. |

## Supabase admin user setup

If the admin user does not exist yet, create it manually in Supabase Dashboard:

1. Go to **Authentication > Users**.
2. Create a user with Liam's admin email and a strong password.
3. Set the same email in the frontend environment:

```env
VITE_ADMIN_EMAIL=liam-admin-email@example.com
```

Do not commit real passwords or private keys.

## QA cases

### Case 1 — No session

- Action: manually open `/admin` in the browser.
- Expected result: redirect to `/login` before admin content renders.
- Obtained result: pending manual browser test with local env configured.

### Case 2 — Admin session

- Action: log in from `/login` with Liam's valid Supabase Auth email/password.
- Expected result: redirect to `/admin` and show the admin page.
- Obtained result: pending manual browser test with the real Supabase admin user.

### Case 3 — Post-logout

- Action: click logout, then manually open `/admin` again.
- Expected result: session is signed out and `/admin` redirects to `/login`.
- Obtained result: pending manual browser test with local env configured.

## Console and build

- Critical console errors: pending manual browser check.
- Build: passed with `npm run build` during review.
- Secret/pattern scan: passed. The only `VITE_ADMIN_EMAIL=` match is the placeholder example in this document.

## Files modified

- `src/App.tsx` — adds lightweight path routing for `/`, `/login`, and `/admin`.
- `src/components/auth/ProtectedRoute.tsx` — checks Supabase session and admin email before rendering protected content.
- `src/pages/Login.tsx` — signs in with `supabase.auth.signInWithPassword` and handles friendly errors.
- `src/pages/Admin.tsx` — protected admin placeholder with visible logout.
- `src/vite-env.d.ts` — adds `VITE_ADMIN_EMAIL` typing.
- `AUTH_QA.md` — records this QA checklist and manual verification plan.

## Remaining tasks

- Create or confirm Liam's admin user in Supabase Auth.
- Configure `VITE_ADMIN_EMAIL` in the local and deployment environments.
- Run the three browser QA cases above.
- Confirm the browser console has no critical errors during login, refresh, and logout.

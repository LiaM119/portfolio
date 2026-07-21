-- Supabase portfolio security hardening.
--
-- Run this in Supabase SQL Editor only after confirming the admin UUID.
-- This script does not drop tables or delete data.
--
-- Before running:
-- 1. Create or confirm your admin user in Supabase Auth.
-- 2. Copy the admin user id from Authentication > Users.
-- 3. Confirm the admin UUID in the "Register the admin user" block is correct.
-- 4. Confirm the bucket name `portfolio-assets` is the one you want.

begin;

-- =========================================================
-- 1. Published flags for controlled public reads
-- =========================================================
-- Existing rows remain public by default so the current home does not break.

alter table public.profile
  add column if not exists is_published boolean not null default true;

alter table public.skills
  add column if not exists is_published boolean not null default true;

alter table public.skills
  alter column level_label drop not null;

alter table public.certifications
  add column if not exists is_published boolean not null default true;

alter table public.projects
  add column if not exists is_published boolean not null default true;


-- =========================================================
-- 2. Admin allowlist + helper
-- =========================================================
-- Do not use auth.role() = 'authenticated' as the admin rule. That would allow
-- every logged-in user to write. The allowlist keeps the rule explicit.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

revoke all on public.admin_users from anon;
revoke all on public.admin_users from authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users admin_users
    where admin_users.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Register the admin user.
-- Admin user id from Supabase Auth > Users.
do $admin_setup$
declare
  admin_user_id constant uuid := 'fdb65cf7-b904-40fc-8eff-9e882be1c566';
begin
  insert into public.admin_users (user_id)
  values (admin_user_id)
  on conflict (user_id) do nothing;
end
$admin_setup$;


-- =========================================================
-- 3. RLS + grants
-- =========================================================

alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.projects enable row level security;
alter table public.project_tech enable row level security;

grant usage on schema public to anon, authenticated;

revoke all on public.profile from anon, authenticated;
revoke all on public.skills from anon, authenticated;
revoke all on public.certifications from anon, authenticated;
revoke all on public.projects from anon, authenticated;
revoke all on public.project_tech from anon, authenticated;

grant select on public.profile to anon, authenticated;
grant select on public.skills to anon, authenticated;
grant select on public.certifications to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.project_tech to anon, authenticated;

grant insert, update, delete on public.profile to authenticated;
grant insert, update, delete on public.skills to authenticated;
grant insert, update, delete on public.certifications to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant insert, update, delete on public.project_tech to authenticated;


-- =========================================================
-- 4. Remove previous broad portfolio policies
-- =========================================================

drop policy if exists "Public read profile" on public.profile;
drop policy if exists "Public read skills" on public.skills;
drop policy if exists "Public read certifications" on public.certifications;
drop policy if exists "Public read projects" on public.projects;
drop policy if exists "Public read project tech" on public.project_tech;

drop policy if exists "Public read published profile" on public.profile;
drop policy if exists "Public read published skills" on public.skills;
drop policy if exists "Public read published certifications" on public.certifications;
drop policy if exists "Public read published projects" on public.projects;
drop policy if exists "Public read published project tech" on public.project_tech;

drop policy if exists "Admin read profile" on public.profile;
drop policy if exists "Admin read skills" on public.skills;
drop policy if exists "Admin read certifications" on public.certifications;
drop policy if exists "Admin read projects" on public.projects;
drop policy if exists "Admin read project tech" on public.project_tech;

drop policy if exists "Admin insert profile" on public.profile;
drop policy if exists "Admin insert skills" on public.skills;
drop policy if exists "Admin insert certifications" on public.certifications;
drop policy if exists "Admin insert projects" on public.projects;
drop policy if exists "Admin insert project tech" on public.project_tech;

drop policy if exists "Admin update profile" on public.profile;
drop policy if exists "Admin update skills" on public.skills;
drop policy if exists "Admin update certifications" on public.certifications;
drop policy if exists "Admin update projects" on public.projects;
drop policy if exists "Admin update project tech" on public.project_tech;

drop policy if exists "Admin delete profile" on public.profile;
drop policy if exists "Admin delete skills" on public.skills;
drop policy if exists "Admin delete certifications" on public.certifications;
drop policy if exists "Admin delete projects" on public.projects;
drop policy if exists "Admin delete project tech" on public.project_tech;


-- =========================================================
-- 5. Public read policies: published content only
-- =========================================================

create policy "Public read published profile"
on public.profile
for select
to anon, authenticated
using (is_published = true);

create policy "Public read published skills"
on public.skills
for select
to anon, authenticated
using (is_published = true);

create policy "Public read published certifications"
on public.certifications
for select
to anon, authenticated
using (is_published = true);

create policy "Public read published projects"
on public.projects
for select
to anon, authenticated
using (is_published = true);

create policy "Public read published project tech"
on public.project_tech
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects projects
    where projects.id = project_tech.project_id
      and projects.is_published = true
  )
  and exists (
    select 1
    from public.skills skills
    where skills.id = project_tech.skill_id
      and skills.is_published = true
  )
);


-- =========================================================
-- 6. Admin read policies: admin can see drafts
-- =========================================================

create policy "Admin read profile"
on public.profile
for select
to authenticated
using (public.is_admin());

create policy "Admin read skills"
on public.skills
for select
to authenticated
using (public.is_admin());

create policy "Admin read certifications"
on public.certifications
for select
to authenticated
using (public.is_admin());

create policy "Admin read projects"
on public.projects
for select
to authenticated
using (public.is_admin());

create policy "Admin read project tech"
on public.project_tech
for select
to authenticated
using (public.is_admin());


-- =========================================================
-- 7. Admin write policies
-- =========================================================

create policy "Admin insert profile"
on public.profile
for insert
to authenticated
with check (public.is_admin());

create policy "Admin update profile"
on public.profile
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin delete profile"
on public.profile
for delete
to authenticated
using (public.is_admin());

create policy "Admin insert skills"
on public.skills
for insert
to authenticated
with check (public.is_admin());

create policy "Admin update skills"
on public.skills
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin delete skills"
on public.skills
for delete
to authenticated
using (public.is_admin());

create policy "Admin insert certifications"
on public.certifications
for insert
to authenticated
with check (public.is_admin());

create policy "Admin update certifications"
on public.certifications
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin delete certifications"
on public.certifications
for delete
to authenticated
using (public.is_admin());

create policy "Admin insert projects"
on public.projects
for insert
to authenticated
with check (public.is_admin());

create policy "Admin update projects"
on public.projects
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin delete projects"
on public.projects
for delete
to authenticated
using (public.is_admin());

create policy "Admin insert project tech"
on public.project_tech
for insert
to authenticated
with check (public.is_admin());

create policy "Admin update project tech"
on public.project_tech
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin delete project tech"
on public.project_tech
for delete
to authenticated
using (public.is_admin());


-- =========================================================
-- 8. Storage bucket + policies
-- =========================================================
-- Public read is allowed for portfolio assets. Public writes are not allowed.
-- Suggested object paths:
-- - profile/avatar.webp
-- - projects/project-name.webp
-- - certifications/certificate-name.webp

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  5242880,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read portfolio assets" on storage.objects;
drop policy if exists "Admin insert portfolio assets" on storage.objects;
drop policy if exists "Admin update portfolio assets" on storage.objects;
drop policy if exists "Admin delete portfolio assets" on storage.objects;

create policy "Public read portfolio assets"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-assets');

create policy "Admin insert portfolio assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and public.is_admin()
  and (storage.foldername(name))[1] in ('profile', 'projects', 'certifications')
);

create policy "Admin update portfolio assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and public.is_admin()
)
with check (
  bucket_id = 'portfolio-assets'
  and public.is_admin()
  and (storage.foldername(name))[1] in ('profile', 'projects', 'certifications')
);

create policy "Admin delete portfolio assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and public.is_admin()
);

commit;


-- =========================================================
-- Manual verification after running the script
-- =========================================================
-- Public reads should work:
-- select * from public.profile;
-- select * from public.skills order by display_order;
-- select * from public.certifications order by display_order;
-- select * from public.projects order by display_order;
-- select * from public.project_tech order by display_order;
--
-- Negative test from the browser/client without login should fail:
-- supabase.from('skills').insert({ name: 'Anonymous write test', category: 'test', level_label: 'test', display_order: 999 })
--
-- Admin test after login should pass only for the user registered in public.admin_users.

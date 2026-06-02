-- Portfolio MVP schema for Supabase/Postgres.
-- Run this only after explaining each table, column group, relationship, and risk.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  headline text not null,
  summary text not null,
  location text,
  email text,
  linkedin_url text,
  github_url text,
  avatar_url text,
  resume_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_single_row check (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  level_label text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skills_display_order_non_negative check (display_order >= 0)
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_at date,
  credential_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certifications_display_order_non_negative check (display_order >= 0)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  description text,
  image_url text,
  live_url text,
  repo_url text,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_display_order_non_negative check (display_order >= 0)
);

create table if not exists public.project_tech (
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete restrict,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, skill_id),
  constraint project_tech_display_order_non_negative check (display_order >= 0)
);

alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.projects enable row level security;
alter table public.project_tech enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.profile to anon, authenticated;
grant select on public.skills to anon, authenticated;
grant select on public.certifications to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.project_tech to anon, authenticated;

drop policy if exists "Public read profile" on public.profile;
create policy "Public read profile"
on public.profile for select
to anon, authenticated
using (true);

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills"
on public.skills for select
to anon, authenticated
using (true);

drop policy if exists "Public read certifications" on public.certifications;
create policy "Public read certifications"
on public.certifications for select
to anon, authenticated
using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
on public.projects for select
to anon, authenticated
using (true);

drop policy if exists "Public read project tech" on public.project_tech;
create policy "Public read project tech"
on public.project_tech for select
to anon, authenticated
using (true);

drop trigger if exists set_profile_updated_at on public.profile;
create trigger set_profile_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists set_certifications_updated_at on public.certifications;
create trigger set_certifications_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_project_tech_updated_at on public.project_tech;
create trigger set_project_tech_updated_at
before update on public.project_tech
for each row execute function public.set_updated_at();

insert into public.profile (
  id,
  full_name,
  role_title,
  headline,
  summary,
  location,
  email,
  linkedin_url,
  github_url,
  avatar_url,
  resume_url
) values (
  '00000000-0000-0000-0000-000000000001',
  'Liameromero',
  'Software Developer',
  'Full Stack Angular & Spring Boot',
  'Desarrollador de software especializado en aplicaciones web Full Stack con Angular, Spring Boot y MySQL. Tecnico Superior en Programacion por la Universidad Tecnologica Nacional.',
  'Mar del Plata, Buenos Aires, Argentina',
  'liamnahuelromero.t@gmail.com',
  'https://www.linkedin.com/in/liamromero',
  'https://github.com/LiaM119',
  null,
  null
) on conflict (id) do update set
  full_name = excluded.full_name,
  role_title = excluded.role_title,
  headline = excluded.headline,
  summary = excluded.summary,
  location = excluded.location,
  email = excluded.email,
  linkedin_url = excluded.linkedin_url,
  github_url = excluded.github_url,
  avatar_url = excluded.avatar_url,
  resume_url = excluded.resume_url;

insert into public.skills (id, name, category, level_label, display_order) values
  ('10000000-0000-0000-0000-000000000001', 'Angular', 'frontend', 'Project experience', 1),
  ('10000000-0000-0000-0000-000000000002', 'TypeScript', 'frontend', 'Project experience', 2),
  ('10000000-0000-0000-0000-000000000003', 'HTML', 'frontend', 'Project experience', 3),
  ('10000000-0000-0000-0000-000000000004', 'CSS', 'frontend', 'Project experience', 4),
  ('10000000-0000-0000-0000-000000000005', 'Java', 'backend', 'Project experience', 5),
  ('10000000-0000-0000-0000-000000000006', 'Spring', 'backend', 'Project experience', 6),
  ('10000000-0000-0000-0000-000000000007', 'Spring Boot', 'backend', 'Project experience', 7),
  ('10000000-0000-0000-0000-000000000008', 'Spring Security', 'backend', 'Project experience', 8),
  ('10000000-0000-0000-0000-000000000009', 'MySQL', 'database', 'Project experience', 9),
  ('10000000-0000-0000-0000-000000000010', 'Git', 'tools', 'Project experience', 10),
  ('10000000-0000-0000-0000-000000000011', 'Tailwind CSS', 'frontend', 'Project experience', 11),
  ('10000000-0000-0000-0000-000000000012', 'Postman', 'tools', 'Project experience', 12),
  ('10000000-0000-0000-0000-000000000013', 'Supabase', 'backend', 'Learning', 13)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  level_label = excluded.level_label,
  display_order = excluded.display_order;

insert into public.certifications (id, title, issuer, issued_at, credential_url, display_order) values
  ('20000000-0000-0000-0000-000000000001', 'Java Spring Framework', 'Issuer to confirm', null, null, 1),
  ('20000000-0000-0000-0000-000000000002', 'Java Spring Security', 'Issuer to confirm', null, null, 2),
  ('20000000-0000-0000-0000-000000000003', 'Java Spring Data JPA', 'Issuer to confirm', null, null, 3),
  ('20000000-0000-0000-0000-000000000004', 'Java Spring', 'Issuer to confirm', null, null, 4),
  ('20000000-0000-0000-0000-000000000005', 'Autenticacion con Angular', 'Issuer to confirm', null, null, 5),
  ('20000000-0000-0000-0000-000000000006', 'Maquetacion Angular', 'Issuer to confirm', null, null, 6)
on conflict (id) do update set
  title = excluded.title,
  issuer = excluded.issuer,
  issued_at = excluded.issued_at,
  credential_url = excluded.credential_url,
  display_order = excluded.display_order;

insert into public.projects (id, title, summary, description, image_url, live_url, repo_url, is_featured, display_order) values
  (
    '30000000-0000-0000-0000-000000000001',
    'Organizer',
    'Aplicacion de gestion y organizacion de tareas y notas.',
    'Permite crear carpetas y notas personalizadas para organizarse de manera eficiente.',
    null,
    null,
    null,
    true,
    1
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Personal Portfolio',
    'Responsive portfolio built with React, TypeScript, and Tailwind CSS.',
    'Personal site used to practice professional Git workflow, UI structure, and Supabase-backed content modeling.',
    null,
    null,
    'https://github.com/LiaM119/portfolio',
    false,
    2
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Supabase Practice Schema',
    'Small backend model for editable portfolio content.',
    'Learning project for tables, primary keys, foreign keys, public read policies, and many-to-many relationships.',
    null,
    null,
    'https://github.com/LiaM119/portfolio',
    false,
    3
  )
on conflict (id) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  image_url = excluded.image_url,
  live_url = excluded.live_url,
  repo_url = excluded.repo_url,
  is_featured = excluded.is_featured,
  display_order = excluded.display_order;

delete from public.project_tech
where project_id in (
  '30000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000003'
);

insert into public.project_tech (project_id, skill_id, display_order) values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1),
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 2),
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 3),
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008', 4),
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000009', 5),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 1),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 2),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 3),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000011', 4),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000013', 1)
on conflict (project_id, skill_id) do update set
  display_order = excluded.display_order;

-- Basic read checks.
select * from public.profile;
select * from public.skills order by display_order;
select * from public.certifications order by display_order;
select * from public.projects order by display_order;

select
  p.title as project_title,
  s.name as technology,
  pt.display_order
from public.project_tech pt
join public.projects p on p.id = pt.project_id
join public.skills s on s.id = pt.skill_id
order by p.display_order, pt.display_order;

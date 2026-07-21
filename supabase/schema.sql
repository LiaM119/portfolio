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
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_single_row check (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  level_label text,
  display_order integer not null default 0,
  is_published boolean not null default true,
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
  is_published boolean not null default true,
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
  is_published boolean not null default true,
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
  '/cv-liam-romero.pdf'
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

-- Skills and certifications are intentionally not seeded.
-- Add them manually from the admin UI so they remain fully editable by the owner.
delete from public.project_tech
where skill_id in (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005',
  '10000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000007',
  '10000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000009',
  '10000000-0000-0000-0000-000000000010',
  '10000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000012',
  '10000000-0000-0000-0000-000000000013'
);

delete from public.certifications
where id in (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006'
);

delete from public.skills
where id in (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005',
  '10000000-0000-0000-0000-000000000006',
  '10000000-0000-0000-0000-000000000007',
  '10000000-0000-0000-0000-000000000008',
  '10000000-0000-0000-0000-000000000009',
  '10000000-0000-0000-0000-000000000010',
  '10000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000012',
  '10000000-0000-0000-0000-000000000013'
);

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

-- Project technologies are also entered manually after skills exist.

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

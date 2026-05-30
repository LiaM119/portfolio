# Supabase portfolio schema

This schema is the minimum backend model for rendering the portfolio home from
editable content. It keeps the model small on purpose: no admin dashboard, auth,
storage buckets, or audit tables in this card.

## Editable content

| Home section | Source table | Editable content |
| --- | --- | --- |
| Hero / About | `profile` | Name, role, headline, summary, location, contact links, avatar URL |
| Skills | `skills` | Skill name, category, level label, display order |
| Certifications | `certifications` | Title, issuer, issued date, credential URL, display order |
| Projects | `projects` | Title, summary, image URL, live/repo URLs, featured flag, display order |
| Project technologies | `project_tech` + `skills` | Which skills/technologies belong to each project |

Images are editable as URL fields for this MVP. A separate storage/images table
is intentionally out of scope until the portfolio needs uploads or image
metadata.

## Public vs administrative data

Public data is the content React needs to render the portfolio. Administrative
data is everything needed to manage that content, such as users, roles, drafts,
audit logs, and storage policies.

For this card, only public portfolio content tables are created. Admin/auth and
storage are not mixed into these tables because the goal is to understand the
content model first.

The SQL enables Row Level Security and adds public read-only policies. That
means the portfolio can read the content, but anonymous users do not get insert,
update, or delete permissions from this schema.

## Text model before SQL

React types must match the SQL column names exactly. `timestamptz` values arrive
as strings from Supabase, and `date` values arrive as `YYYY-MM-DD` strings when
present.

## Required and nullable fields

| Table | Required fields | Nullable fields |
| --- | --- | --- |
| `profile` | `id`, `full_name`, `role_title`, `headline`, `summary`, `created_at`, `updated_at` | `location`, `email`, `linkedin_url`, `github_url`, `avatar_url`, `resume_url` |
| `skills` | `id`, `name`, `category`, `level_label`, `display_order`, `created_at`, `updated_at` | None |
| `certifications` | `id`, `title`, `issuer`, `display_order`, `created_at`, `updated_at` | `issued_at`, `credential_url` |
| `projects` | `id`, `title`, `summary`, `is_featured`, `display_order`, `created_at`, `updated_at` | `description`, `image_url`, `live_url`, `repo_url` |
| `project_tech` | `project_id`, `skill_id`, `display_order`, `created_at`, `updated_at` | None |

Ordering rules:

- `skills`, `certifications`, and `projects` should be rendered by ascending `display_order`.
- Project technology chips should be rendered by ascending `project_tech.display_order` inside each project.
- All `display_order` values are non-negative integers. Use `0` only when an item has no intentional order yet.
- The seed data uses explicit `display_order` values so React can render stable lists without sorting by names or creation time.

### `profile`

Stores the single public profile shown in the hero/about sections.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `full_name` | Person name displayed on the site |
| `role_title` | Short professional title |
| `headline` | Main hero sentence |
| `summary` | About text |
| `location` | Optional public location |
| `email` | Optional public contact email |
| `linkedin_url`, `github_url`, `avatar_url`, `resume_url` | Optional public links/assets |
| `created_at`, `updated_at` | Timestamps for maintenance |

### `skills`

Stores reusable skills and technologies. The same table feeds the skills section
and the project technology relationship.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Skill or technology name |
| `category` | Grouping such as `frontend`, `backend`, `tools` |
| `level_label` | Human label such as `Learning`, `Comfortable`, `Advanced` |
| `display_order` | Stable order for UI rendering |
| `created_at`, `updated_at` | Timestamps for maintenance |

### `certifications`

Stores public certifications shown on the home page.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `title` | Certification name |
| `issuer` | Organization that issued it |
| `issued_at` | Optional issue date |
| `credential_url` | Optional verification link |
| `display_order` | Stable order for UI rendering |
| `created_at`, `updated_at` | Timestamps for maintenance |

### `projects`

Stores portfolio projects.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `title` | Project name |
| `summary` | Short card description |
| `description` | Optional longer detail |
| `image_url` | Optional public image URL |
| `live_url`, `repo_url` | Optional project links |
| `is_featured` | Whether the project should be highlighted |
| `display_order` | Stable order for UI rendering |
| `created_at`, `updated_at` | Timestamps for maintenance |

### `project_tech`

Connects projects to skills/technologies.

| Column | Purpose |
| --- | --- |
| `project_id` | Foreign key to `projects.id` |
| `skill_id` | Foreign key to `skills.id` |
| `display_order` | Stable order for technologies inside each project card |
| `created_at`, `updated_at` | Timestamps for maintenance |

Relationship: one project can have many technologies, and one technology can be
used by many projects. `project_tech` is the join table that makes that
many-to-many relationship explicit.

## Supabase project setup

Create the Supabase project from the Supabase dashboard before executing SQL:

1. Create a new Supabase project for this portfolio.
2. Open SQL Editor.
3. Read `supabase/schema.sql` before running it.
4. Execute the SQL only after explaining the rule below.
5. Open Table Editor and verify the five tables and seed rows.

Do not paste this SQL into another project. The main risk is creating or
overwriting portfolio tables in the wrong database.

## SQL execution rule

Before running `supabase/schema.sql`, Liam must explain:

1. What table the SQL creates.
2. What each important column means.
3. Which foreign key points to which table.
4. How to verify the result in Supabase Table Editor.
5. What the risk is if the SQL is run in the wrong project.
6. Why public read policies are safe but public write policies are not included.

## Verification queries

Run these after executing the schema in Supabase SQL Editor:

```sql
select * from profile;
select * from skills order by display_order;
select * from certifications order by display_order;
select * from projects order by display_order;

select
  p.title as project_title,
  s.name as technology,
  pt.display_order
from project_tech pt
join projects p on p.id = pt.project_id
join skills s on s.id = pt.skill_id
order by p.display_order, pt.display_order;
```

## QA evidence

Dashboard execution was verified after running `supabase/schema.sql` in the
Supabase SQL Editor.

| Check | Result |
| --- | --- |
| Supabase project created | Done |
| Tables visible in Table Editor | `profile`, `skills`, `certifications`, `projects`, `project_tech` |
| Seed data loaded | Done |
| `project_tech` relationship query | Passed |

Relationship query result:

```text
Organizer -> Angular -> display_order 1
Organizer -> Java -> display_order 2
Organizer -> Spring Boot -> display_order 3
Organizer -> Spring Security -> display_order 4
Organizer -> MySQL -> display_order 5
Personal Portfolio -> TypeScript -> display_order 1
Personal Portfolio -> HTML -> display_order 2
Personal Portfolio -> CSS -> display_order 3
Personal Portfolio -> Tailwind CSS -> display_order 4
Supabase Practice Schema -> Supabase -> display_order 1
```

## Learning question

What table answers each section of the home?

- Hero/About: `profile`
- Skills: `skills`
- Certifications: `certifications`
- Projects: `projects`
- Project technology chips: `project_tech` joined with `skills`

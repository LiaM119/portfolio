export type Timestamp = string
export type DateString = string

export type Profile = {
  id: string
  full_name: string
  role_title: string
  headline: string
  summary: string
  location: string | null
  email: string | null
  linkedin_url: string | null
  github_url: string | null
  avatar_url: string | null
  resume_url: string | null
  is_published: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export type Skill = {
  id: string
  name: string
  category: string
  level_label: string | null
  display_order: number
  is_published: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export type Certification = {
  id: string
  title: string
  issuer: string
  issued_at: DateString | null
  credential_url: string | null
  display_order: number
  is_published: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export type Project = {
  id: string
  title: string
  summary: string
  description: string | null
  image_url: string | null
  live_url: string | null
  repo_url: string | null
  is_featured: boolean
  display_order: number
  is_published: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export type ProjectTech = {
  project_id: string
  skill_id: string
  display_order: number
  created_at: Timestamp
  updated_at: Timestamp
}

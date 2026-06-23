import { getSupabaseClient } from './supabase'
import type { Certification, Profile, Skill } from '../types/supabase'

export const PROFILE_ID = '00000000-0000-0000-0000-000000000001'

export type ProfileInput = Pick<
  Profile,
  'full_name' | 'role_title' | 'headline' | 'summary' | 'location' | 'email' | 'linkedin_url' | 'github_url' | 'avatar_url' | 'resume_url' | 'is_published'
>

export type SkillInput = Pick<Skill, 'name' | 'category' | 'level_label' | 'display_order' | 'is_published'>

export type CertificationInput = Pick<Certification, 'title' | 'issuer' | 'issued_at' | 'credential_url' | 'display_order' | 'is_published'>

export type AdminContent = {
  profile: Profile | null
  skills: Skill[]
  certifications: Certification[]
}

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message)
  }

  if (data === null) {
    throw new Error('Supabase returned no data')
  }

  return data
}

function normalizeOptional(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function normalizeProfileInput(input: ProfileInput): ProfileInput {
  return {
    full_name: input.full_name.trim(),
    role_title: input.role_title.trim(),
    headline: input.headline.trim(),
    summary: input.summary.trim(),
    location: input.location ? normalizeOptional(input.location) : null,
    email: input.email ? normalizeOptional(input.email) : null,
    linkedin_url: input.linkedin_url ? normalizeOptional(input.linkedin_url) : null,
    github_url: input.github_url ? normalizeOptional(input.github_url) : null,
    avatar_url: input.avatar_url ? normalizeOptional(input.avatar_url) : null,
    resume_url: input.resume_url ? normalizeOptional(input.resume_url) : null,
    is_published: input.is_published,
  }
}

export function normalizeSkillInput(input: SkillInput): SkillInput {
  return {
    name: input.name.trim(),
    category: input.category.trim(),
    level_label: input.level_label ? normalizeOptional(input.level_label) : null,
    display_order: Number.isFinite(input.display_order) ? input.display_order : 0,
    is_published: input.is_published,
  }
}

function formatLinkedProjectError(data: unknown) {
  const linkedProjects = Array.isArray(data) ? data : []
  const projectNames = linkedProjects
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const project = 'projects' in item ? item.projects : null

      if (!project || typeof project !== 'object' || !('title' in project) || typeof project.title !== 'string') {
        return null
      }

      return project.title
    })
    .filter((name): name is string => Boolean(name))

  const suffix = projectNames.length > 0 ? ` Linked projects: ${projectNames.join(', ')}.` : ''
  return `This skill is used by one or more projects. Remove it from those project tech lists before deleting it.${suffix}`
}

export function normalizeCertificationInput(input: CertificationInput): CertificationInput {
  return {
    title: input.title.trim(),
    issuer: input.issuer.trim(),
    issued_at: input.issued_at ? normalizeOptional(input.issued_at) : null,
    credential_url: input.credential_url ? normalizeOptional(input.credential_url) : null,
    display_order: Number.isFinite(input.display_order) ? input.display_order : 0,
    is_published: input.is_published,
  }
}

export async function getAdminContent(): Promise<AdminContent> {
  const supabase = getSupabaseClient()

  const [profileResult, skillsResult, certificationsResult] = await Promise.all([
    supabase.from('profile').select('*').limit(1).maybeSingle(),
    supabase.from('skills').select('*').order('display_order', { ascending: true }),
    supabase.from('certifications').select('*').order('display_order', { ascending: true }),
  ])

  if (profileResult.error) {
    throw new Error(profileResult.error.message)
  }

  return {
    profile: profileResult.data as Profile | null,
    skills: requireData(skillsResult.data as Skill[] | null, skillsResult.error),
    certifications: requireData(certificationsResult.data as Certification[] | null, certificationsResult.error),
  }
}

export async function saveProfile(input: ProfileInput): Promise<Profile> {
  const supabase = getSupabaseClient()
  const normalized = normalizeProfileInput(input)
  const { data, error } = await supabase
    .from('profile')
    .upsert({ id: PROFILE_ID, ...normalized }, { onConflict: 'id' })
    .select('*')
    .single()

  return requireData(data as Profile | null, error)
}

export async function createSkill(input: SkillInput): Promise<Skill> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('skills').insert(normalizeSkillInput(input)).select('*').single()

  return requireData(data as Skill | null, error)
}

export async function updateSkill(id: string, input: SkillInput): Promise<Skill> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('skills').update(normalizeSkillInput(input)).eq('id', id).select('*').single()

  return requireData(data as Skill | null, error)
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const linkedProjectsResult = await supabase
    .from('project_tech')
    .select('project_id, projects(title)')
    .eq('skill_id', id)

  if (linkedProjectsResult.error) {
    throw new Error(linkedProjectsResult.error.message)
  }

  if (linkedProjectsResult.data && linkedProjectsResult.data.length > 0) {
    throw new Error(formatLinkedProjectError(linkedProjectsResult.data))
  }

  const { error } = await supabase.from('skills').delete().eq('id', id)

  if (error) {
    throw new Error(error.code === '23503' ? formatLinkedProjectError([]) : error.message)
  }
}

export async function createCertification(input: CertificationInput): Promise<Certification> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('certifications').insert(normalizeCertificationInput(input)).select('*').single()

  return requireData(data as Certification | null, error)
}

export async function updateCertification(id: string, input: CertificationInput): Promise<Certification> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from('certifications').update(normalizeCertificationInput(input)).eq('id', id).select('*').single()

  return requireData(data as Certification | null, error)
}

export async function deleteCertification(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('certifications').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

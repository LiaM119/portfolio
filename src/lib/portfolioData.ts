import { getSupabaseClient } from './supabase'
import type { Certification, Profile, Project, ProjectTech, Skill } from '../types/supabase'

export type ProjectWithTech = Project & {
  tech: Pick<Skill, 'id' | 'name'>[]
}

export type HomeData = {
  profile: Profile | null
  skills: Skill[]
  certifications: Certification[]
  projects: ProjectWithTech[]
}

function requireSupabaseData<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message)
  }

  if (data === null) {
    throw new Error('Supabase returned no data')
  }

  return data
}

export async function getHomeData(): Promise<HomeData> {
  const supabase = getSupabaseClient()

  const [profileResult, skillsResult, certificationsResult, projectsResult, projectTechResult] = await Promise.all([
    supabase.from('profile').select('*').eq('is_published', true).limit(1).maybeSingle(),
    supabase.from('skills').select('*').eq('is_published', true).order('display_order', { ascending: true }),
    supabase.from('certifications').select('*').eq('is_published', true).order('display_order', { ascending: true }),
    supabase.from('projects').select('*').eq('is_published', true).order('display_order', { ascending: true }),
    supabase.from('project_tech').select('*').order('display_order', { ascending: true }),
  ])

  if (profileResult.error) {
    throw new Error(profileResult.error.message)
  }

  const profile = profileResult.data as Profile | null
  const skills = requireSupabaseData(skillsResult.data as Skill[] | null, skillsResult.error)
  const certifications = requireSupabaseData(certificationsResult.data as Certification[] | null, certificationsResult.error)
  const projects = requireSupabaseData(projectsResult.data as Project[] | null, projectsResult.error)
  const projectTech = requireSupabaseData(projectTechResult.data as ProjectTech[] | null, projectTechResult.error)

  const skillsById = new Map(skills.map((skill) => [skill.id, skill]))
  const techByProjectId = new Map<string, Pick<Skill, 'id' | 'name'>[]>()

  projectTech.forEach((item) => {
    const skill = skillsById.get(item.skill_id)

    if (!skill) {
      return
    }

    const projectSkills = techByProjectId.get(item.project_id) ?? []
    projectSkills.push({ id: skill.id, name: skill.name })
    techByProjectId.set(item.project_id, projectSkills)
  })

  return {
    profile,
    skills,
    certifications,
    projects: projects.map((project) => ({
      ...project,
      tech: techByProjectId.get(project.id) ?? [],
    })),
  }
}

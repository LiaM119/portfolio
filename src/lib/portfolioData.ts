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

const fallbackTimestamp = '2026-01-01T00:00:00.000Z'

const fallbackProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: 'Liameromero',
  role_title: 'Software Developer',
  headline: 'Full Stack Angular & Spring Boot',
  summary:
    'Desarrollador de software especializado en aplicaciones web Full Stack con Angular, Spring Boot y MySQL. Tecnico Superior en Programacion por la Universidad Tecnologica Nacional.',
  location: 'Mar del Plata, Buenos Aires, Argentina',
  email: 'liamnahuelromero.t@gmail.com',
  linkedin_url: 'https://www.linkedin.com/in/liamromero',
  github_url: 'https://github.com/LiaM119',
  avatar_url: null,
  resume_url: '/cv-liam-romero.pdf',
  is_published: true,
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}

const fallbackProjects: Project[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    title: 'Organizer',
    summary: 'Aplicacion de gestion y organizacion de tareas y notas.',
    description: 'Permite crear carpetas y notas personalizadas para organizarse de manera eficiente.',
    image_url: null,
    live_url: null,
    repo_url: null,
    is_featured: true,
    display_order: 1,
    is_published: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    title: 'Personal Portfolio',
    summary: 'Responsive portfolio built with React, TypeScript, and Tailwind CSS.',
    description: 'Personal site used to practice professional Git workflow, UI structure, and Supabase-backed content modeling.',
    image_url: null,
    live_url: null,
    repo_url: 'https://github.com/LiaM119/portfolio',
    is_featured: false,
    display_order: 2,
    is_published: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    title: 'Supabase Practice Schema',
    summary: 'Small backend model for editable portfolio content.',
    description: 'Learning project for tables, primary keys, foreign keys, public read policies, and many-to-many relationships.',
    image_url: null,
    live_url: null,
    repo_url: 'https://github.com/LiaM119/portfolio',
    is_featured: false,
    display_order: 3,
    is_published: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
]

function requireSupabaseData<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message)
  }

  if (data === null) {
    throw new Error('Supabase returned no data')
  }

  return data
}

function joinProjectsWithTech(projects: Project[], skills: Skill[], projectTech: ProjectTech[]): ProjectWithTech[] {
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

  return projects.map((project) => ({
    ...project,
    tech: techByProjectId.get(project.id) ?? [],
  }))
}

const fallbackHomeData: HomeData = {
  profile: fallbackProfile,
  skills: [],
  certifications: [],
  projects: joinProjectsWithTech(fallbackProjects, [], []),
}

function isRecoverableHomeDataError(error: unknown) {
  if (error instanceof TypeError) {
    return true
  }

  const message = error instanceof Error ? error.message.toLowerCase() : ''

  return message.includes('failed to fetch') || message.includes('load failed') || message.includes('network') || message.includes('missing supabase environment variables')
}

async function getRemoteHomeData(): Promise<HomeData> {
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

  return {
    profile,
    skills,
    certifications,
    projects: joinProjectsWithTech(projects, skills, projectTech),
  }
}

export async function getHomeData(): Promise<HomeData> {
  try {
    return await getRemoteHomeData()
  } catch (error) {
    if (!isRecoverableHomeDataError(error)) {
      throw error
    }

    console.warn('Supabase content could not be reached. Rendering bundled portfolio content instead.', error)
    return fallbackHomeData
  }
}

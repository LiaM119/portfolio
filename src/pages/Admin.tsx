import { useEffect, useState, type FormEvent } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import {
  createCertification,
  createSkill,
  deleteCertification,
  deleteSkill,
  getAdminContent,
  saveProfile,
  updateCertification,
  updateSkill,
  type CertificationInput,
  type ProfileInput,
  type SkillInput,
} from '../lib/adminContent'
import { getSupabaseClient } from '../lib/supabase'
import type { Certification, Skill } from '../types/supabase'

type AdminProps = {
  onNavigate: (path: string) => void
}

type LoadStatus = 'loading' | 'ready' | 'error'
type SaveState = { state: 'idle' | 'saving' | 'success' | 'error'; message: string }

const emptyProfile: ProfileInput = {
  full_name: '',
  role_title: '',
  headline: '',
  summary: '',
  location: null,
  email: null,
  linkedin_url: null,
  github_url: null,
  avatar_url: null,
  resume_url: null,
  is_published: true,
}

const emptySkill: SkillInput = {
  name: '',
  category: '',
  level_label: '',
  display_order: 0,
  is_published: true,
}

const emptyCertification: CertificationInput = {
  title: '',
  issuer: '',
  issued_at: null,
  credential_url: null,
  display_order: 0,
  is_published: true,
}

const fieldClass = 'mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-400'
const labelClass = 'text-sm font-medium text-zinc-300'
const panelClass = 'rounded-3xl border border-white/10 bg-white/[0.025] p-5 shadow-2xl shadow-black/20 sm:p-6'
const secondaryButtonClass = 'inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] disabled:cursor-not-allowed disabled:opacity-60'

function toFormString(value: string | null) {
  return value ?? ''
}

function showSaveState(status: SaveState) {
  if (status.state === 'idle') {
    return null
  }

  const colorClass = status.state === 'error' ? 'border-red-400/20 bg-red-950/20 text-red-100' : 'border-emerald-400/20 bg-emerald-950/20 text-emerald-100'

  return <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${colorClass}`}>{status.message}</p>
}

function validateProfile(profile: ProfileInput) {
  if (!profile.full_name.trim() || !profile.role_title.trim() || !profile.headline.trim() || !profile.summary.trim()) {
    return 'Full name, role title, headline, and summary are required.'
  }

  return ''
}

function validateSkill(skill: SkillInput) {
  if (!skill.name.trim() || !skill.category.trim() || !skill.level_label.trim()) {
    return 'Skill name, category, and level are required.'
  }

  if (skill.display_order < 0) {
    return 'Display order cannot be negative.'
  }

  return ''
}

function validateCertification(certification: CertificationInput) {
  if (!certification.title.trim() || !certification.issuer.trim()) {
    return 'Certification title and issuer are required.'
  }

  if (certification.display_order < 0) {
    return 'Display order cannot be negative.'
  }

  return ''
}

export default function Admin({ onNavigate }: AdminProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [authErrorMessage, setAuthErrorMessage] = useState('')
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading')
  const [loadError, setLoadError] = useState('')
  const [profile, setProfile] = useState<ProfileInput>(emptyProfile)
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [profileStatus, setProfileStatus] = useState<SaveState>({ state: 'idle', message: '' })
  const [skillStatus, setSkillStatus] = useState<SaveState>({ state: 'idle', message: '' })
  const [certificationStatus, setCertificationStatus] = useState<SaveState>({ state: 'idle', message: '' })
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)
  const [skillForm, setSkillForm] = useState<SkillInput>(emptySkill)
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null)
  const [certificationForm, setCertificationForm] = useState<CertificationInput>(emptyCertification)

  useEffect(() => {
    let isCurrent = true

    async function loadContent() {
      try {
        const data = await getAdminContent()

        if (!isCurrent) {
          return
        }

        if (data.profile) {
          setProfile({
            full_name: data.profile.full_name,
            role_title: data.profile.role_title,
            headline: data.profile.headline,
            summary: data.profile.summary,
            location: data.profile.location,
            email: data.profile.email,
            linkedin_url: data.profile.linkedin_url,
            github_url: data.profile.github_url,
            avatar_url: data.profile.avatar_url,
            resume_url: data.profile.resume_url,
            is_published: data.profile.is_published,
          })
        }

        setSkills(data.skills)
        setCertifications(data.certifications)
        setLoadStatus('ready')
      } catch (error) {
        if (isCurrent) {
          setLoadError(error instanceof Error ? error.message : 'Could not load admin content')
          setLoadStatus('error')
        }
      }
    }

    loadContent()

    return () => {
      isCurrent = false
    }
  }, [])

  async function handleLogout() {
    setIsSigningOut(true)
    setAuthErrorMessage('')

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        setAuthErrorMessage('We could not sign you out. Please try again.')
        return
      }

      onNavigate('/login')
    } catch {
      setAuthErrorMessage('Connection problem while signing out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateProfile(profile)
    if (validationError) {
      setProfileStatus({ state: 'error', message: validationError })
      return
    }

    setProfileStatus({ state: 'saving', message: 'Saving profile...' })

    try {
      const savedProfile = await saveProfile(profile)
      setProfile({
        full_name: savedProfile.full_name,
        role_title: savedProfile.role_title,
        headline: savedProfile.headline,
        summary: savedProfile.summary,
        location: savedProfile.location,
        email: savedProfile.email,
        linkedin_url: savedProfile.linkedin_url,
        github_url: savedProfile.github_url,
        avatar_url: savedProfile.avatar_url,
        resume_url: savedProfile.resume_url,
        is_published: savedProfile.is_published,
      })
      setProfileStatus({ state: 'success', message: 'Profile saved. Public home will show it when published.' })
    } catch (error) {
      setProfileStatus({ state: 'error', message: error instanceof Error ? error.message : 'Could not save profile' })
    }
  }

  async function handleSkillSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateSkill(skillForm)
    if (validationError) {
      setSkillStatus({ state: 'error', message: validationError })
      return
    }

    setSkillStatus({ state: 'saving', message: editingSkillId ? 'Updating skill...' : 'Creating skill...' })

    try {
      const savedSkill = editingSkillId ? await updateSkill(editingSkillId, skillForm) : await createSkill(skillForm)
      setSkills((current) => {
        const nextSkills = editingSkillId ? current.map((item) => (item.id === savedSkill.id ? savedSkill : item)) : [...current, savedSkill]
        return nextSkills.toSorted((a, b) => a.display_order - b.display_order)
      })
      setEditingSkillId(null)
      setSkillForm(emptySkill)
      setSkillStatus({ state: 'success', message: 'Skill saved.' })
    } catch (error) {
      setSkillStatus({ state: 'error', message: error instanceof Error ? error.message : 'Could not save skill' })
    }
  }

  async function handleDeleteSkill(id: string) {
    setSkillStatus({ state: 'saving', message: 'Deleting skill...' })

    try {
      await deleteSkill(id)
      setSkills((current) => current.filter((item) => item.id !== id))
      if (editingSkillId === id) {
        setEditingSkillId(null)
        setSkillForm(emptySkill)
      }
      setSkillStatus({ state: 'success', message: 'Skill deleted.' })
    } catch (error) {
      setSkillStatus({ state: 'error', message: error instanceof Error ? error.message : 'Could not delete skill' })
    }
  }

  async function handleCertificationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateCertification(certificationForm)
    if (validationError) {
      setCertificationStatus({ state: 'error', message: validationError })
      return
    }

    setCertificationStatus({ state: 'saving', message: editingCertificationId ? 'Updating certification...' : 'Creating certification...' })

    try {
      const savedCertification = editingCertificationId ? await updateCertification(editingCertificationId, certificationForm) : await createCertification(certificationForm)
      setCertifications((current) => {
        const nextCertifications = editingCertificationId ? current.map((item) => (item.id === savedCertification.id ? savedCertification : item)) : [...current, savedCertification]
        return nextCertifications.toSorted((a, b) => a.display_order - b.display_order)
      })
      setEditingCertificationId(null)
      setCertificationForm(emptyCertification)
      setCertificationStatus({ state: 'success', message: 'Certification saved.' })
    } catch (error) {
      setCertificationStatus({ state: 'error', message: error instanceof Error ? error.message : 'Could not save certification' })
    }
  }

  async function handleDeleteCertification(id: string) {
    setCertificationStatus({ state: 'saving', message: 'Deleting certification...' })

    try {
      await deleteCertification(id)
      setCertifications((current) => current.filter((item) => item.id !== id))
      if (editingCertificationId === id) {
        setEditingCertificationId(null)
        setCertificationForm(emptyCertification)
      }
      setCertificationStatus({ state: 'success', message: 'Certification deleted.' })
    } catch (error) {
      setCertificationStatus({ state: 'error', message: error instanceof Error ? error.message : 'Could not delete certification' })
    }
  }

  function startSkillEdit(skill: Skill) {
    setEditingSkillId(skill.id)
    setSkillForm({
      name: skill.name,
      category: skill.category,
      level_label: skill.level_label,
      display_order: skill.display_order,
      is_published: skill.is_published,
    })
    setSkillStatus({ state: 'idle', message: '' })
  }

  function startCertificationEdit(certification: Certification) {
    setEditingCertificationId(certification.id)
    setCertificationForm({
      title: certification.title,
      issuer: certification.issuer,
      issued_at: certification.issued_at,
      credential_url: certification.credential_url,
      display_order: certification.display_order,
      is_published: certification.is_published,
    })
    setCertificationStatus({ state: 'idle', message: '' })
  }

  return (
    <AdminLayout errorMessage={authErrorMessage} isSigningOut={isSigningOut} onLogout={handleLogout}>
      {loadStatus === 'loading' && <p className={`${panelClass} text-sm text-zinc-300`}>Loading editable content...</p>}

      {loadStatus === 'error' && <p className={`${panelClass} text-sm text-red-100`}>Could not load content: {loadError}</p>}

      {loadStatus === 'ready' && (
        <>
          <section className={panelClass} aria-labelledby="profile-editor-title">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Profile</p>
                <h2 id="profile-editor-title" className="mt-2 text-2xl font-semibold text-zinc-100">Main public identity</h2>
              </div>
              <p className="text-sm text-zinc-400">Required fields are marked by the browser validation.</p>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>
                  Full name
                  <input className={fieldClass} value={profile.full_name} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} required />
                </label>
                <label className={labelClass}>
                  Role title
                  <input className={fieldClass} value={profile.role_title} onChange={(event) => setProfile({ ...profile, role_title: event.target.value })} required />
                </label>
              </div>

              <label className={labelClass}>
                Headline
                <input className={fieldClass} value={profile.headline} onChange={(event) => setProfile({ ...profile, headline: event.target.value })} required />
              </label>

              <label className={labelClass}>
                Summary
                <textarea className={`${fieldClass} min-h-32`} value={profile.summary} onChange={(event) => setProfile({ ...profile, summary: event.target.value })} required />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>
                  Location
                  <input className={fieldClass} value={toFormString(profile.location)} onChange={(event) => setProfile({ ...profile, location: event.target.value })} />
                </label>
                <label className={labelClass}>
                  Email
                  <input className={fieldClass} type="email" value={toFormString(profile.email)} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
                </label>
                <label className={labelClass}>
                  LinkedIn URL
                  <input className={fieldClass} type="url" value={toFormString(profile.linkedin_url)} onChange={(event) => setProfile({ ...profile, linkedin_url: event.target.value })} />
                </label>
                <label className={labelClass}>
                  GitHub URL
                  <input className={fieldClass} type="url" value={toFormString(profile.github_url)} onChange={(event) => setProfile({ ...profile, github_url: event.target.value })} />
                </label>
                <label className={labelClass}>
                  Avatar URL
                  <input className={fieldClass} type="url" value={toFormString(profile.avatar_url)} onChange={(event) => setProfile({ ...profile, avatar_url: event.target.value })} />
                </label>
                <label className={labelClass}>
                  Resume URL
                  <input className={fieldClass} type="url" value={toFormString(profile.resume_url)} onChange={(event) => setProfile({ ...profile, resume_url: event.target.value })} />
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input type="checkbox" checked={profile.is_published} onChange={(event) => setProfile({ ...profile, is_published: event.target.checked })} />
                Published on public home
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button className="min-h-11 rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] disabled:cursor-not-allowed disabled:opacity-60" disabled={profileStatus.state === 'saving'}>
                  {profileStatus.state === 'saving' ? 'Saving...' : 'Save profile'}
                </button>
                {showSaveState(profileStatus)}
              </div>
            </form>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <CollectionEditor title="Skills" description="Skills appear in the hero stack and skills section." status={skillStatus}>
              <form className="grid gap-4" onSubmit={handleSkillSubmit}>
                <label className={labelClass}>
                  Name
                  <input className={fieldClass} value={skillForm.name} onChange={(event) => setSkillForm({ ...skillForm, name: event.target.value })} required />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Category
                    <input className={fieldClass} value={skillForm.category} onChange={(event) => setSkillForm({ ...skillForm, category: event.target.value })} required />
                  </label>
                  <label className={labelClass}>
                    Level label
                    <input className={fieldClass} value={skillForm.level_label} onChange={(event) => setSkillForm({ ...skillForm, level_label: event.target.value })} required />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Display order
                    <input className={fieldClass} type="number" min="0" value={skillForm.display_order} onChange={(event) => setSkillForm({ ...skillForm, display_order: event.target.valueAsNumber })} required />
                  </label>
                  <label className="flex items-end gap-3 pb-2 text-sm text-zinc-300">
                    <input type="checkbox" checked={skillForm.is_published} onChange={(event) => setSkillForm({ ...skillForm, is_published: event.target.checked })} />
                    Published
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="min-h-11 rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] disabled:cursor-not-allowed disabled:opacity-60" disabled={skillStatus.state === 'saving'}>
                    {editingSkillId ? 'Update skill' : 'Add skill'}
                  </button>
                  {editingSkillId && (
                    <button type="button" className={secondaryButtonClass} onClick={() => { setEditingSkillId(null); setSkillForm(emptySkill) }}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>

              <EditableList emptyMessage="No skills yet. Add the first one above.">
                {skills.map((skill) => (
                  <li key={skill.id} className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-zinc-100">{skill.name}</h4>
                        <p className="mt-1 text-sm text-zinc-400">{skill.category} - {skill.level_label} - order {skill.display_order}</p>
                        {!skill.is_published && <p className="mt-2 text-xs uppercase tracking-[0.16em] text-amber-300">Draft</p>}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className={secondaryButtonClass} onClick={() => startSkillEdit(skill)}>Edit</button>
                        <button type="button" className={secondaryButtonClass} onClick={() => handleDeleteSkill(skill.id)} disabled={skillStatus.state === 'saving'}>Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </EditableList>
            </CollectionEditor>

            <CollectionEditor title="Certifications" description="Certifications appear in the public certifications section." status={certificationStatus}>
              <form className="grid gap-4" onSubmit={handleCertificationSubmit}>
                <label className={labelClass}>
                  Title
                  <input className={fieldClass} value={certificationForm.title} onChange={(event) => setCertificationForm({ ...certificationForm, title: event.target.value })} required />
                </label>
                <label className={labelClass}>
                  Issuer
                  <input className={fieldClass} value={certificationForm.issuer} onChange={(event) => setCertificationForm({ ...certificationForm, issuer: event.target.value })} required />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Issued date
                    <input className={fieldClass} type="date" value={toFormString(certificationForm.issued_at)} onChange={(event) => setCertificationForm({ ...certificationForm, issued_at: event.target.value })} />
                  </label>
                  <label className={labelClass}>
                    Display order
                    <input className={fieldClass} type="number" min="0" value={certificationForm.display_order} onChange={(event) => setCertificationForm({ ...certificationForm, display_order: event.target.valueAsNumber })} required />
                  </label>
                </div>
                <label className={labelClass}>
                  Credential URL
                  <input className={fieldClass} type="url" value={toFormString(certificationForm.credential_url)} onChange={(event) => setCertificationForm({ ...certificationForm, credential_url: event.target.value })} />
                </label>
                <label className="flex items-center gap-3 text-sm text-zinc-300">
                  <input type="checkbox" checked={certificationForm.is_published} onChange={(event) => setCertificationForm({ ...certificationForm, is_published: event.target.checked })} />
                  Published
                </label>
                <div className="flex flex-wrap gap-3">
                  <button className="min-h-11 rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] disabled:cursor-not-allowed disabled:opacity-60" disabled={certificationStatus.state === 'saving'}>
                    {editingCertificationId ? 'Update certification' : 'Add certification'}
                  </button>
                  {editingCertificationId && (
                    <button type="button" className={secondaryButtonClass} onClick={() => { setEditingCertificationId(null); setCertificationForm(emptyCertification) }}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>

              <EditableList emptyMessage="No certifications yet. Add the first one above.">
                {certifications.map((certification) => (
                  <li key={certification.id} className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-zinc-100">{certification.title}</h4>
                        <p className="mt-1 text-sm text-zinc-400">{certification.issuer} - order {certification.display_order}</p>
                        {!certification.is_published && <p className="mt-2 text-xs uppercase tracking-[0.16em] text-amber-300">Draft</p>}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className={secondaryButtonClass} onClick={() => startCertificationEdit(certification)}>Edit</button>
                        <button type="button" className={secondaryButtonClass} onClick={() => handleDeleteCertification(certification.id)} disabled={certificationStatus.state === 'saving'}>Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </EditableList>
            </CollectionEditor>
          </section>
        </>
      )}
    </AdminLayout>
  )
}

function CollectionEditor({ title, description, status, children }: { title: string; description: string; status: SaveState; children: React.ReactNode }) {
  return (
    <section className={`${panelClass} flex flex-col gap-5`} aria-labelledby={`${title.toLowerCase()}-editor-title`}>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Collection</p>
        <h2 id={`${title.toLowerCase()}-editor-title`} className="mt-2 text-2xl font-semibold text-zinc-100">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      </div>

      {showSaveState(status)}
      {children}
    </section>
  )
}

function EditableList({ emptyMessage, children }: { emptyMessage: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children

  if (Array.isArray(items) && items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-zinc-400">{emptyMessage}</p>
  }

  return <ul className="grid gap-3">{children}</ul>
}

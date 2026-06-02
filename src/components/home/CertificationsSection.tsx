import type { Certification } from '../../types/supabase'

type CertificationsSectionProps = {
  certifications: Certification[]
}

function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <section id="certificaciones" className="py-10 sm:py-14" aria-labelledby="certificaciones-title">
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 sm:text-sm">Certificaciones</p>
      <h2 id="certificaciones-title" className="sr-only">
        Certificaciones
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {certifications.map((item) => (
          <article key={item.id} className="flex min-h-36 flex-col rounded-xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <h3 className="text-lg font-medium leading-snug text-zinc-100 sm:text-xl lg:text-2xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base lg:text-lg">Certificado de aprobacion de {item.title}.</p>
            <p className="mt-auto pt-5 text-sm text-zinc-500">{item.issuer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CertificationsSection

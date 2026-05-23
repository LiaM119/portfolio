const certifications = [
  'Java Spring Framework',
  'Java Spring Security',
  'Java Spring Data JPA',
  'Java Spring',
  'Autenticacion con Angular',
  'Maquetacion Angular',
]

function CertificationsSection() {
  return (
    <section id="certificaciones" className="py-14" aria-labelledby="certificaciones-title">
      <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">Certificaciones</p>
      <h2 id="certificaciones-title" className="sr-only">
        Certificaciones
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {certifications.map((item) => (
          <article key={item} className="rounded-xl border border-white/10 bg-white/[0.025] p-6">
            <h3 className="text-3xl font-medium text-zinc-100">{item}</h3>
            <p className="mt-3 text-lg text-zinc-300">Certificado de aprobacion de {item}.</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CertificationsSection

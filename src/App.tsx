import './App.css'

function App() {
  return (
    <main className="portfolio-home">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Hola, soy</p>
        <h1 id="hero-title">Liam Nahuel Romero</h1>
        <p className="role">Desarrollador Web Junior (Frontend / Backend / Full Stack)</p>
        <p className="hero-summary">
          Construyo aplicaciones web con React + Vite y Java con Spring Boot, integrando APIs
          REST con autenticacion JWT y bases de datos relacionales como MySQL y H2.
        </p>
      </section>

      <section className="content-card" aria-labelledby="sobre-mi-title">
        <h2 id="sobre-mi-title">Sobre mi</h2>
        <p>
          Soy un desarrollador web junior enfocado en crear soluciones claras, mantenibles y
          orientadas a resultados. Me interesa participar en proyectos donde pueda aportar valor
          desde el frontend y el backend, seguir mejorando mis habilidades y crecer dentro de un
          equipo de desarrollo.
        </p>
      </section>

      <section className="content-card" aria-labelledby="skills-title">
        <h2 id="skills-title">Skills</h2>
        <ul className="skills-list">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>React (Vite)</li>
          <li>Java + Spring Boot</li>
          <li>MySQL / H2</li>
          <li>REST APIs</li>
          <li>Git / GitHub</li>
        </ul>
      </section>

      <section className="content-card" aria-labelledby="proyectos-title">
        <h2 id="proyectos-title">Proyectos</h2>
        <div className="empty-projects" role="status" aria-live="polite">
          <p>Todavia no hay proyectos publicados.</p>
          <p>Proximamente voy a agregar mis trabajos aca.</p>
        </div>
      </section>

      <section className="content-card" aria-labelledby="contacto-title">
        <h2 id="contacto-title">Contacto</h2>
        <ul className="contact-list">
          <li>
            <a href="https://github.com/LiaM119" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/liamromero" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="mailto:liamnahuelromero.t@gmail.com">Email</a>
          </li>
        </ul>
      </section>
    </main>
  )
}

export default App

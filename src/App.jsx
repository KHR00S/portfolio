import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

/* ---------------------------------- data ---------------------------------- */

const SKILLS = [
  { title: 'Frontend Tools', items: 'React, JavaScript, TypeScript, Tailwind CSS, Framer Motion, Vite' },
  { title: 'Backend Tools', items: 'Python, TensorFlow, Streamlit, Node.js, MySQL, Firebase' },
  { title: 'UI Libraries', items: 'shadcn/ui, Radix UI, Material UI, Chart.js, Plotly' },
]

const SONGS = [
  { title: 'Blinding Lights', artist: 'The Weeknd', hue: 'from-red-500/70 to-orange-600/60' },
  { title: 'As It Was', artist: 'Harry Styles', hue: 'from-sky-400/70 to-indigo-600/60' },
  { title: 'Glimpse of Us', artist: 'Joji', hue: 'from-zinc-400/70 to-zinc-700/60' },
  { title: 'Monokrom', artist: 'Tulus', hue: 'from-amber-400/70 to-yellow-700/60' },
  { title: 'About You', artist: 'The 1975', hue: 'from-fuchsia-500/70 to-purple-700/60' },
  { title: 'Secukupnya', artist: 'Hindia', hue: 'from-teal-400/70 to-emerald-700/60' },
  { title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', hue: 'from-rose-500/70 to-red-800/60' },
  { title: 'Sunsetz', artist: 'Cigarettes After Sex', hue: 'from-slate-400/70 to-slate-700/60' },
  { title: 'Evaluasi', artist: 'Hindia', hue: 'from-lime-400/70 to-green-700/60' },
  { title: 'Nightcall', artist: 'Kavinsky', hue: 'from-violet-500/70 to-blue-800/60' },
]

const PROJECTS = [
  {
    name: 'Upwelling Prediction Dashboard',
    desc: 'Machine-learning dashboard forecasting upwelling events in Lake Laut Tawar — the research behind my Scopus Q2 publication in Theoretical and Applied Climatology.',
    tags: ['PYTHON', 'STREAMLIT', 'TENSORFLOW'],
    github: 'https://github.com/KHR00S',
    link: 'https://link.springer.com/article/10.1007/s00704-025-05717-3',
    hue: 'from-cyan-500/40 to-blue-800/40',
  },
  {
    name: 'Lake Maninjau Forecasting',
    desc: 'Multivariate time-series forecasting of upwelling with VAR & SVM models, visualized through an interactive analytics dashboard. Published in JITK (SINTA 2).',
    tags: ['PYTHON', 'SCIKIT-LEARN', 'PLOTLY'],
    github: 'https://github.com/KHR00S',
    link: 'https://ejournal.nusamandiri.ac.id/index.php/jitk/article/view/6665',
    hue: 'from-emerald-500/40 to-teal-800/40',
  },
  {
    name: 'GoDentist Disease Detection',
    desc: 'Deep-learning model detecting dental diseases from images at 98% accuracy — built during Bangkit Academy led by Google, Tokopedia, Gojek & Traveloka.',
    tags: ['TENSORFLOW', 'KERAS', 'FLASK'],
    github: 'https://github.com/KHR00S',
    link: 'https://github.com/KHR00S',
    hue: 'from-rose-500/40 to-pink-800/40',
  },
  {
    name: 'Personal Portfolio',
    desc: 'The site you are looking at — a dark editorial portfolio with scroll-triggered motion, marquees and a custom cursor. Designed to feel premium and fast.',
    tags: ['REACT', 'TAILWIND CSS', 'FRAMER MOTION'],
    github: 'https://github.com/KHR00S/portfolio',
    link: 'https://khr00s.github.io/portfolio/',
    hue: 'from-amber-500/40 to-orange-800/40',
  },
  {
    name: 'AI Research Chatbot',
    desc: 'A conversational assistant that answers questions over research papers and datasets, built with retrieval-augmented generation and a lightweight web UI.',
    tags: ['PYTHON', 'NLP', 'STREAMLIT'],
    github: 'https://github.com/KHR00S',
    link: 'https://github.com/KHR00S',
    hue: 'from-violet-500/40 to-purple-800/40',
  },
  {
    name: 'PLTS On-Grid 1.8 MWp',
    desc: 'Design & simulation of a 1.8 MWp on-grid solar power plant — array sizing, yield simulation and single-line diagrams for a utility-scale installation.',
    tags: ['PVSYST', 'ETAP', 'AUTOCAD'],
    github: 'https://github.com/KHR00S',
    link: 'https://github.com/KHR00S',
    hue: 'from-yellow-500/40 to-amber-800/40',
  },
]

const TESTIMONIALS = [
  { quote: 'Fakhrus turned our messy sensor data into a forecasting dashboard the whole team actually uses. Fast, precise, and calm under deadline pressure.', name: 'RESEARCH SUPERVISOR', role: 'Environmental Engineering Lab · USK' },
  { quote: 'One of the most reliable engineers in the cohort. His ML model hit 98% accuracy and he still found time to help everyone else debug theirs.', name: 'BANGKIT MENTOR', role: 'Machine Learning Path · Google Bangkit' },
  { quote: 'He reads a single-line diagram as fluently as he reads Python. Rare to find someone comfortable on the plant floor and in a Jupyter notebook.', name: 'SITE ENGINEER', role: 'PT Perta Arun Gas' },
  { quote: 'Gave him the hardest commissioning checklist we had. He finished early, documented everything, and the HMI has run clean since.', name: 'PROJECT LEAD', role: 'HMI Commissioning · Kumatsu Gata Group' },
  { quote: 'Our research reports went from good to award-winning under his direction. First place was not an accident.', name: 'CLUB PRESIDENT', role: 'KSPM USK Investment Club' },
  { quote: 'Quietly ships. Every network cutover he assisted on went smoother than planned, and clients noticed.', name: 'SENIOR ENGINEER', role: 'PT Mastersystem Infotama' },
]

const CAL_SLOTS = ['09:00', '10:30', '13:00', '15:30', '19:00', '20:30']

/* ------------------------------- primitives ------------------------------- */

function Reveal({ children, className = '', delay = 0, y = 36 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function Label({ children, className = '' }) {
  return (
    <div className={`text-[11px] font-medium uppercase tracking-[0.3em] text-warm ${className}`}>
      {children}
    </div>
  )
}

function CursorDot() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const dot = ref.current
    if (!dot) return
    const move = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      const t = e.target.closest('a, button')
      dot.classList.toggle('grow', !!t)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [reduce])
  if (reduce) return null
  return <div ref={ref} className="cursor-dot" aria-hidden="true" />
}

/* --------------------------------- sections -------------------------------- */

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-7 md:px-10">
      <div className="blob left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      {/* top bar */}
      <motion.div
        className="relative z-10 flex items-center justify-between"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <a
          href="mailto:fakhroosyakir@gmail.com?subject=Book%20a%20call"
          className="rounded-full border border-cream/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.25em] transition-all duration-300 hover:scale-105 hover:border-cream hover:bg-cream hover:text-ink"
        >
          Book a Call
        </a>
        <nav className="flex items-center gap-7 text-[13px]">
          <a href="#projects" className="link-line">Studio</a>
          <a href="https://www.linkedin.com/in/fakhrus-syakir-65bb72205" target="_blank" rel="noopener" className="link-line">LinkedIn</a>
        </nav>
      </motion.div>

      {/* center name */}
      <div className="relative z-10 text-center">
        <h1 className="display relative inline-block text-[21vw] leading-[0.85] md:text-[17vw]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          >
            Fakhrus
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          >
            Syakir
          </motion.span>
          <span className="absolute left-1/2 top-1/2 z-10 block -translate-x-1/2 -translate-y-1/2">
            <motion.span
              className="block h-[13vw] w-[13vw] max-h-36 max-w-36 min-h-20 min-w-20 overflow-hidden rounded-2xl border border-cream/20 shadow-2xl md:rounded-3xl"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            >
              <img
                src={`${import.meta.env.BASE_URL}me-cutout.png`}
                alt="Fakhrus Syakir"
                className="h-full w-full bg-surface-2 object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
            </motion.span>
          </span>
        </h1>
      </div>

      {/* bottom row */}
      <motion.div
        className="relative z-10 flex flex-col justify-between gap-6 text-[13px] leading-relaxed text-warm md:flex-row md:items-end"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
      >
        <p className="max-w-xs">
          I currently work as a Junior Network Engineer at{' '}
          <a href="https://www.mastersystem.co.id" target="_blank" rel="noopener" className="link-line text-cream">Mastersystem</a>
          , currently available for work.
        </p>
        <p className="max-w-xs md:text-right">
          Focused on interfaces and experiences, working remotely from Jakarta, Indonesia.
        </p>
      </motion.div>
    </section>
  )
}

function Statement() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-40">
      <h2 className="display text-[11.5vw] md:text-[8.5vw]">
        {['I build startups,', 'accelerate growth,', 'create empires.'].map((line, i) => (
          <Reveal key={line} delay={i * 0.08}>
            <span className="block">{line}</span>
          </Reveal>
        ))}
      </h2>

      <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-2 md:gap-10">
        <Reveal className="space-y-5 text-[15px] leading-relaxed text-warm md:max-w-md">
          <p>
            I specialize in crafting high-converting landing pages and data products for SaaS, Web3
            and AI startups — pairing clean engineering with interfaces people actually enjoy using.
          </p>
          <p>
            Away from the keyboard I'm probably gaming, watching anime, or digging through new music
            to fuel the next build session.
          </p>
          <p className="text-cream">
            Currently open to freelance and full-time opportunities — let's make something great.
          </p>
        </Reveal>

        <div className="space-y-10">
          {SKILLS.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08}>
              <h3 className="text-lg font-bold text-cream">{g.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-warm">{g.items}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function MusicStrip() {
  return (
    <section className="py-10 md:py-16">
      <Reveal>
        <div className="marquee">
          <div className="marquee-track py-2">
            {[...SONGS, ...SONGS].map((s, i) => (
              <div
                key={i}
                className="w-40 shrink-0 rounded-2xl border border-line bg-surface p-3 transition-transform duration-300 hover:scale-105 md:w-44"
                aria-hidden={i >= SONGS.length}
              >
                <div className={`flex aspect-square items-end rounded-xl bg-gradient-to-br p-3 ${s.hue}`}>
                  <span className="display text-2xl leading-none text-cream/90">{s.title.slice(0, 1)}</span>
                </div>
                <div className="mt-3 truncate text-[13px] font-semibold text-cream">{s.title}</div>
                <div className="truncate text-[11px] text-warm">{s.artist}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-[13px] text-warm">
          A few songs I can recommend if you're looking for some fresh tunes :)
        </p>
      </Reveal>
    </section>
  )
}

function Laptop({ project }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-t-xl border border-b-0 border-line bg-surface-2 p-2 pb-0">
        <div className={`flex aspect-[16/10] items-center justify-center rounded-t-lg bg-gradient-to-br ${project.hue}`}>
          <span className="display px-6 text-center text-3xl text-cream/90">{project.name}</span>
        </div>
      </div>
      <div className="h-3 rounded-b-xl bg-gradient-to-b from-surface-2 to-ink shadow-2xl" />
      <div className="mx-auto h-1 w-1/3 rounded-b-lg bg-surface-2" />
    </div>
  )
}

function Projects() {
  return (
    <section id="projects" className="px-6 py-28 md:px-10 md:py-36">
      <Reveal className="text-center">
        <h2 className="display text-[16vw] md:text-[11vw]">Myprojects</h2>
        <Label className="mt-4">A selection of things I've designed &amp; built</Label>
      </Reveal>

      <div className="mt-16 space-y-8 md:mt-24">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name}>
            <article className="relative grid items-center gap-10 rounded-[2rem] border border-line bg-surface p-8 md:grid-cols-2 md:gap-14 md:p-14">
              <div className={i % 2 ? 'md:order-2' : ''}>
                <h3 className="display text-4xl md:text-5xl">{p.name}</h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-warm">{p.desc}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-warm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className={i % 2 ? 'md:order-1' : ''}>
                <Laptop project={p} />
              </div>
              <div className="absolute right-6 top-6 flex gap-2.5 md:right-8 md:top-8">
                <a
                  href={p.github} target="_blank" rel="noopener" aria-label={`${p.name} on GitHub`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-cream/80 transition-all duration-300 hover:scale-110 hover:bg-cream hover:text-ink"
                >
                  <GithubIcon size={18} />
                </a>
                <a
                  href={p.link} target="_blank" rel="noopener" aria-label={`Open ${p.name}`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-cream/80 transition-all duration-300 hover:scale-110 hover:bg-cream hover:text-ink"
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Calendar() {
  const [month, setMonth] = useState(6) // 0-indexed; 6 = July 2026
  const [day, setDay] = useState(null)
  const [slot, setSlot] = useState(null)
  const year = 2026
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const name = new Date(year, month, 1).toLocaleString('en', { month: 'long' })

  return (
    <div className="mx-auto mt-14 max-w-xl rounded-[2rem] border border-line bg-surface p-6 md:p-9">
      <div className="flex items-center justify-between">
        <button
          type="button" onClick={() => { setMonth((m) => Math.max(0, m - 1)); setDay(null); setSlot(null) }}
          className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors hover:bg-cream hover:text-ink"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-sm font-semibold tracking-[0.2em] uppercase">{name} {year}</div>
        <button
          type="button" onClick={() => { setMonth((m) => Math.min(11, m + 1)); setDay(null); setSlot(null) }}
          className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors hover:bg-cream hover:text-ink"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-widest text-warm">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: first }).map((_, i) => <div key={'e' + i} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1
          const active = day === d
          return (
            <button
              key={d} type="button" onClick={() => { setDay(d); setSlot(null) }}
              className={`aspect-square rounded-lg text-[13px] transition-colors ${active ? 'bg-cream font-bold text-ink' : 'text-cream/80 hover:bg-surface-2'}`}
            >
              {d}
            </button>
          )
        })}
      </div>

      {day && (
        <div className="mt-6 border-t border-line pt-6">
          <Label>Available slots — {name} {day}</Label>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {CAL_SLOTS.map((s) => (
              <button
                key={s} type="button" onClick={() => setSlot(s)}
                className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${slot === s ? 'border-cream bg-cream font-semibold text-ink' : 'border-line hover:border-cream'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {slot && (
            <a
              href={`mailto:fakhroosyakir@gmail.com?subject=Call%20booking%20—%20${name}%20${day}%2C%20${slot}%20WIB`}
              className="mt-6 block rounded-full bg-cream py-3.5 text-center text-[13px] font-bold uppercase tracking-[0.2em] text-ink transition-transform hover:scale-[1.02]"
            >
              Confirm {name} {day} · {slot} WIB
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function PartnerCTA() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-36">
      <Reveal className="text-center">
        <h2 className="display text-[12vw] md:text-[7.5vw]">Partner with us.<br />Launch fast.</h2>
        <p className="mx-auto mt-8 max-w-lg text-[15px] leading-relaxed text-warm">
          We're an AI-powered studio that designs, builds and ships production-ready products in weeks, not months.
        </p>
        <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-cream">
          Limited offer — first 3 bookings this month get a free strategy sprint.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <Calendar />
      </Reveal>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-36">
      <Reveal className="text-center">
        <h2 className="display text-[15vw] md:text-[10vw]">Testimonials</h2>
        <Label className="mt-4">Kind words from people I've worked with</Label>
      </Reveal>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-24">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 0.08}>
            <figure className="flex h-full flex-col rounded-3xl border border-line bg-surface p-8">
              <div className="display text-3xl text-cream/25" aria-hidden="true">//</div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-cream/85">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7">
                <div className="text-[13px] font-bold tracking-[0.12em]">{t.name}</div>
                <div className="mt-1 text-[12px] text-warm">{t.role}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="px-6 pb-10 pt-24 md:px-10 md:pt-36">
      <Reveal>
        <h2 className="display text-center text-[19vw] leading-none md:text-[16.5vw]">Let's talk</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-col justify-between gap-12 md:mt-24 md:flex-row">
          <div className="max-w-md">
            <p className="text-[15px] leading-relaxed text-warm">
              Got a question, proposal, project, or want to work together on something?
            </p>
            <div className="mt-6 flex flex-col gap-3 text-[15px]">
              <a href="mailto:fakhroosyakir@gmail.com" className="link-line w-fit text-cream">Send me an email</a>
              <a href="mailto:fakhroosyakir@gmail.com?subject=Book%20a%20call" className="link-line w-fit text-cream">Book a call</a>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-[15px] md:items-end">
            <a href="https://www.linkedin.com/in/fakhrus-syakir-65bb72205" target="_blank" rel="noopener" className="link-line w-fit">LinkedIn</a>
            <a href="https://github.com/KHR00S" target="_blank" rel="noopener" className="link-line w-fit">GitHub</a>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 border-t border-line pt-6 md:mt-24">
        <div className="flex flex-col justify-between gap-3 text-[12px] text-warm md:flex-row">
          <span>Copyright {new Date().getFullYear()}</span>
          <span>
            Need help with a website? DM me —{' '}
            <a href="mailto:fakhroosyakir@gmail.com" className="link-line text-cream">Fakhrus</a>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------- app ----------------------------------- */

export default function App() {
  return (
    <>
      <CursorDot />
      <Hero />
      <Statement />
      <MusicStrip />
      <Projects />
      <PartnerCTA />
      <Testimonials />
      <Footer />
    </>
  )
}

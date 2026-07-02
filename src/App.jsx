import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Lenis from 'lenis'

/* easing dna lifted from the reference: gsap power3/expo easeOut for reveals,
   power3.inOut for overlay moves */
const EASE = [0.215, 0.61, 0.355, 1] // power3.out
const EXPO = [0.19, 1, 0.22, 1] // expo.out
const P3IO = [0.645, 0.045, 0.355, 1] // power3.inOut
const PRELOAD_MS = 2300

function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

/* ---------------------------------- data ---------------------------------- */
/* Everything below reflects the CV — no invented clients, quotes or claims. */

const SKILLS = [
  { title: 'Networking', items: 'Routing & Switching, LAN/WAN, Network Security, Enterprise Infrastructure, Troubleshooting' },
  { title: 'Machine Learning & Data', items: 'Python, TensorFlow, RStudio, Streamlit, Time-Series Forecasting' },
  { title: 'Engineering Tools', items: 'ETAP, PVsyst, CX-One, AutoCAD, HMI & PLC Systems' },
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
    name: 'Upwelling Prediction — Lake Laut Tawar',
    desc: 'Machine learning integrated with time-series analysis to predict upwelling events. Published in Theoretical and Applied Climatology (Springer, Scopus Q2).',
    tags: ['PYTHON', 'TENSORFLOW', 'TIME SERIES'],
    github: 'https://github.com/KHR00S',
    link: 'https://link.springer.com/article/10.1007/s00704-025-05717-3',
    hue: 'from-cyan-500/40 to-blue-800/40',
  },
  {
    name: 'Lake Maninjau Forecasting',
    desc: 'Upwelling forecasting with VAR & SVM models plus an interactive dashboard for visualization. Published in JITK (SINTA 2).',
    tags: ['PYTHON', 'SVM', 'DASHBOARD'],
    github: 'https://github.com/KHR00S',
    link: 'https://ejournal.nusamandiri.ac.id/index.php/jitk/article/view/6665',
    hue: 'from-emerald-500/40 to-teal-800/40',
  },
  {
    name: 'Semi-Supervised Upwelling Study',
    desc: 'A semi-supervised learning approach to forecasting upwelling phenomena in Lake Laut Tawar. Published in Infolitika Journal of Data Science.',
    tags: ['PYTHON', 'SEMI-SUPERVISED', 'FORECASTING'],
    github: 'https://github.com/KHR00S',
    link: 'https://heca-analitika.com/ijds/article/view/211',
    hue: 'from-violet-500/40 to-purple-800/40',
  },
  {
    name: 'GoDentist Disease Detection',
    desc: 'Deep-learning model detecting dental diseases from images at 98% accuracy, with optimized database storage — built at Bangkit Academy led by Google.',
    tags: ['TENSORFLOW', 'KERAS', 'ML'],
    github: 'https://github.com/KHR00S',
    link: 'https://github.com/KHR00S',
    hue: 'from-rose-500/40 to-pink-800/40',
  },
  {
    name: 'PLTS On-Grid 1.8 MWp',
    desc: 'Design & simulation of a 1.8 MWp on-grid solar power plant — array sizing, yield simulation and electrical design for a utility-scale installation.',
    tags: ['PVSYST', 'ETAP', 'AUTOCAD'],
    github: 'https://github.com/KHR00S',
    link: 'https://github.com/KHR00S',
    hue: 'from-yellow-500/40 to-amber-800/40',
  },
  {
    name: 'Personal Portfolio',
    desc: 'The site you are looking at — a dark editorial portfolio with scroll-triggered motion, marquees and a custom cursor.',
    tags: ['REACT', 'TAILWIND CSS', 'FRAMER MOTION'],
    github: 'https://github.com/KHR00S/portfolio',
    link: 'https://khr00s.github.io/portfolio/',
    hue: 'from-amber-500/40 to-orange-800/40',
  },
]

const CAL_SLOTS = ['09:00', '10:30', '13:00', '15:30', '19:00', '20:30']

/* ------------------------------- primitives ------------------------------- */

function Reveal({ children, className = '', delay = 0, y = 40 }) {
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

/* clip/mask-up entrance for big editorial headlines */
function MaskReveal({ children, className = '', delay = 0 }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.1, ease: EXPO, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Label({ children, className = '' }) {
  return (
    <div className={`text-[11px] font-medium uppercase tracking-[0.3em] text-warm ${className}`}>
      {children}
    </div>
  )
}

/* soft white blob cursor with spring lag; grows over interactive elements */
function CursorDot() {
  const reduce = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 450, damping: 30, mass: 0.55 })
  const sy = useSpring(y, { stiffness: 450, damping: 30, mass: 0.55 })
  const ref = useRef(null)

  useEffect(() => {
    if (reduce) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (ref.current) {
        ref.current.classList.toggle('grow', !!e.target.closest('a, button'))
      }
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [reduce, x, y])

  if (reduce) return null
  return <motion.div ref={ref} className="cursor-dot" style={{ x: sx, y: sy }} aria-hidden="true" />
}

/* full-screen intro overlay: text wipes in, holds, overlay slides away */
function Preloader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: P3IO }}
          aria-hidden="true"
        >
          <motion.p
            className="px-6 text-center text-lg font-medium tracking-wide text-cream md:text-2xl"
            initial={{ clipPath: 'inset(0 100% 0 0)', y: 24, opacity: 0.3 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: EXPO, delay: 0.2 }}
          >
            Innovating, Empowering, Delivering.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* avatar card whose tilt subtly follows the cursor */
function Avatar({ delay }) {
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 })
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 })
  const ref = useRef(null)

  useEffect(() => {
    if (reduce) return
    const move = (e) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      ry.set(dx * 22)
      rx.set(-dy * 22)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [reduce, rx, ry])

  return (
    <span className="absolute left-1/2 top-1/2 z-10 block -translate-x-1/2 -translate-y-1/2" style={{ perspective: 600 }}>
      <motion.span
        ref={ref}
        className="block h-[13vw] w-[13vw] max-h-36 max-w-36 min-h-20 min-w-20 overflow-hidden rounded-2xl border border-cream/20 shadow-2xl md:rounded-3xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
        style={{ rotateX: rx, rotateY: ry }}
      >
        <img
          src={`${import.meta.env.BASE_URL}me-cutout.png`}
          alt="Fakhrus Syakir"
          className="h-full w-full bg-surface-2 object-cover"
          style={{ objectPosition: '50% 20%' }}
        />
      </motion.span>
    </span>
  )
}

/* laptop mockup with tilt-on-hover parallax */
function Laptop({ project }) {
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 16 })
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 16 })
  const ref = useRef(null)

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  return (
    <div className="mx-auto w-full max-w-md" style={{ perspective: 900 }}>
      <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: rx, rotateY: ry }}>
        <div className="rounded-t-xl border border-b-0 border-line bg-surface-2 p-2 pb-0">
          <div className={`flex aspect-[16/10] items-center justify-center rounded-t-lg bg-gradient-to-br ${project.hue}`}>
            <span className="display px-6 text-center text-3xl text-cream/90">{project.name}</span>
          </div>
        </div>
        <div className="h-3 rounded-b-xl bg-gradient-to-b from-surface-2 to-ink shadow-2xl" />
        <div className="mx-auto h-1 w-1/3 rounded-b-lg bg-surface-2" />
      </motion.div>
    </div>
  )
}

/* --------------------------------- sections -------------------------------- */

function Hero({ entered }) {
  const d = (t) => (entered ? t : t + PRELOAD_MS / 1000 - 0.3)
  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-7 md:px-10">
      <div className="blob left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      {/* top bar */}
      <motion.div
        className="relative z-20 flex items-center justify-between"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: d(0.1) }}
      >
        <a
          href="mailto:fakhroosyakir@gmail.com?subject=Book%20a%20call"
          className="rounded-full border border-cream/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.25em] transition-all duration-300 hover:scale-105 hover:border-cream hover:bg-cream hover:text-ink"
        >
          Book a Call
        </a>
        <nav className="flex items-center gap-7 text-[13px]">
          <span className="group relative">
            <a href="#projects" className="link-line">Work</a>
            <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-[11px] text-warm opacity-0 transition-all duration-300 group-hover:translate-y-1 group-hover:opacity-100">
              Take a look at my projects!
            </span>
          </span>
          <a href="https://www.linkedin.com/in/fakhrus-syakir-65bb72205" target="_blank" rel="noopener" className="link-line">LinkedIn</a>
        </nav>
      </motion.div>

      {/* center name — each line mask-reveals upward */}
      <div className="relative z-10 text-center">
        <h1 className="display relative inline-block text-[21vw] leading-[0.85] md:text-[17vw]">
          {['Fakhrus', 'Syakir'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: 150 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, ease: EXPO, delay: d(0.1 + i * 0.2) }}
              >
                {line}
              </motion.span>
            </span>
          ))}
          <Avatar delay={d(0.6)} />
        </h1>
      </div>

      {/* bottom row */}
      <motion.div
        className="relative z-10 flex flex-col justify-between gap-6 text-[13px] leading-relaxed text-warm md:flex-row md:items-end"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: d(0.75) }}
      >
        <p className="max-w-xs">
          I currently work as a Junior Network Engineer at{' '}
          <a href="https://www.mastersystem.co.id" target="_blank" rel="noopener" className="link-line text-cream">Mastersystem</a>
          , currently available for work.
        </p>
        <p className="max-w-xs md:text-right">
          Focused on networks and machine learning, based in Jakarta, Indonesia.
        </p>
      </motion.div>
    </section>
  )
}

function Statement() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-40">
      <h2 className="display text-[11.5vw] md:text-[8.5vw]">
        {['I build networks,', 'train models,', 'publish research.'].map((line, i) => (
          <MaskReveal key={line} delay={i * 0.1}>{line}</MaskReveal>
        ))}
      </h2>

      <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-2 md:gap-10">
        <div className="space-y-5 text-[15px] leading-relaxed text-warm md:max-w-md">
          {[
            <>I'm a Junior Network Engineer at <span className="text-cream">PT Mastersystem Infotama</span>, configuring, deploying and supporting enterprise routing, switching and network security.</>,
            <>My foundation is Electrical Engineering (Syiah Kuala University) with hands-on industrial experience — HMI commissioning, relay control systems and cathodic protection at Pertamina-affiliated facilities.</>,
            <>In parallel I'm a Google Bangkit <span className="text-cream">Distinction Graduate</span> in Machine Learning, publishing peer-reviewed research on environmental forecasting — including a Scopus Q2 journal article.</>,
          ].map((p, i) => (
            <Reveal key={i} delay={i * 0.1}><p>{p}</p></Reveal>
          ))}
          <Reveal delay={0.3}>
            <p className="text-cream">Currently open to network engineering, electrical and ML research opportunities.</p>
          </Reveal>
        </div>

        <div className="space-y-10">
          {SKILLS.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.12}>
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
        <Label className="mt-7 text-center">
          A few songs I can recommend if you're looking for some fresh tunes :)
        </Label>
      </Reveal>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="px-6 py-28 md:px-10 md:py-36">
      <div className="text-center">
        <h2 className="display text-[16vw] md:text-[11vw]">
          <MaskReveal>Myprojects</MaskReveal>
        </h2>
        <Reveal delay={0.15}>
          <Label className="mx-auto mt-5 max-w-2xl leading-relaxed">
            From peer-reviewed forecasting models to utility-scale solar — every build here solves a real-world problem.
          </Label>
        </Reveal>
      </div>

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
          className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors duration-300 hover:bg-cream hover:text-ink"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-sm font-semibold tracking-[0.2em] uppercase">{name} {year}</div>
        <button
          type="button" onClick={() => { setMonth((m) => Math.min(11, m + 1)); setDay(null); setSlot(null) }}
          className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors duration-300 hover:bg-cream hover:text-ink"
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
              className={`aspect-square rounded-lg text-[13px] transition-colors duration-200 ${active ? 'bg-cream font-bold text-ink' : 'text-cream/80 hover:bg-surface-2'}`}
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
                className={`rounded-full border px-4 py-2 text-[13px] transition-colors duration-200 ${slot === s ? 'border-cream bg-cream font-semibold text-ink' : 'border-line hover:border-cream'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {slot && (
            <a
              href={`mailto:fakhroosyakir@gmail.com?subject=Call%20booking%20—%20${name}%20${day}%2C%20${slot}%20WIB`}
              className="mt-6 block rounded-full bg-cream py-3.5 text-center text-[13px] font-bold uppercase tracking-[0.2em] text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              Confirm {name} {day} · {slot} WIB
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function BookCall() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-36">
      <div className="text-center">
        <h2 className="display text-[12vw] md:text-[7.5vw]">
          <MaskReveal>Book a call.</MaskReveal>
          <MaskReveal delay={0.1}>Let's talk work.</MaskReveal>
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-[15px] leading-relaxed text-warm">
            Open to network engineering, electrical and machine-learning research opportunities —
            pick a date and a time slot, and it lands straight in my inbox.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <Calendar />
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="px-6 pb-10 pt-24 md:px-10 md:pt-36">
      <h2 className="display text-center text-[19vw] leading-none md:text-[16.5vw]">
        <MaskReveal>Let's talk</MaskReveal>
      </h2>

      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-col justify-between gap-12 md:mt-24 md:flex-row">
          <div className="max-w-lg">
            <p className="text-[13px] font-medium uppercase leading-relaxed tracking-[0.22em] text-warm">
              Got a question, proposal, project, or want to work together on something?
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-[13px] font-semibold uppercase tracking-[0.18em]">
              <a href="mailto:fakhroosyakir@gmail.com" className="link-line text-cream">Send me an email</a>
              <span className="text-warm">or</span>
              <a href="mailto:fakhroosyakir@gmail.com?subject=Book%20a%20call" className="link-line text-cream">Book a call</a>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-[15px] md:items-end">
            <a href="https://www.linkedin.com/in/fakhrus-syakir-65bb72205" target="_blank" rel="noopener" className="link-line w-fit">LinkedIn</a>
            <a href="https://github.com/KHR00S" target="_blank" rel="noopener" className="link-line w-fit">GitHub</a>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 border-t border-line pt-6 md:mt-24">
        <div className="flex flex-col justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-warm md:flex-row">
          <span>Copyright {new Date().getFullYear()}</span>
          <span>
            Need help with a project? DM me —{' '}
            <a href="mailto:fakhroosyakir@gmail.com" className="link-line text-cream">Fakhrus Syakir</a>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------- app ----------------------------------- */

export default function App() {
  const reduce = useReducedMotion()
  const [loading, setLoading] = useState(!reduce)

  /* preloader timing */
  useEffect(() => {
    if (!loading) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setLoading(false)
      document.body.style.overflow = ''
    }, PRELOAD_MS)
    return () => { clearTimeout(t); document.body.style.overflow = '' }
  }, [loading])

  /* momentum smooth-scrolling */
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.12 })
    return () => lenis.destroy()
  }, [reduce])

  return (
    <MotionConfig reducedMotion="user">
      <Preloader show={loading} />
      <CursorDot />
      <Hero entered={reduce} />
      <Statement />
      <MusicStrip />
      <Projects />
      <BookCall />
      <Footer />
    </MotionConfig>
  )
}

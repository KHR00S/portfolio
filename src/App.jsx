import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useScroll, useTransform, useInView, useReducedMotion, animate,
} from 'framer-motion'
import { AWARDS, CERTS, MORE } from './data'

/* ----------------------------- icons (raw SVG) ----------------------------- */
const I = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-8-4.5-8-11.8A4.2 4.2 0 0 1 12 6a4.2 4.2 0 0 1 8 3.2C20 16.5 12 21 12 21z"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="10" cy="13" r="2"/><path d="m9 17-1 4 2-1 2 1-1-4"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 15 9l7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9z"/></svg>',
}
function Ic({ k }) {
  return <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: I[k] }} />
}

const EASE = [0.16, 1, 0.3, 1]
const thumb = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w800`

/* --------------------------- publications data ----------------------------- */
const PUBS = [
  { featured: true, href: 'https://link.springer.com/article/10.1007/s00704-025-05717-3',
    badges: [['scopus', 'Scopus Q2', true], ['intl', 'Springer', false]],
    title: 'Integration of Machine Learning and Time Series Analysis for Upwelling Prediction in Lake Laut Tawar, Indonesia',
    venue: 'Theoretical and Applied Climatology — A study based on climate forecasting', date: '15 Aug 2025' },
  { href: 'https://ejournal.nusamandiri.ac.id/index.php/jitk/article/view/6665',
    badges: [['sinta', 'SINTA 2', false]],
    title: 'Forecasting Upwelling in Lake Maninjau Using VAR, SVM & Dashboard Visualization',
    venue: 'Jurnal Ilmu Pengetahuan dan Teknologi Komputer (JITK)', date: '02 Dec 2025' },
  { href: 'https://heca-analitika.com/ijds/article/view/211',
    badges: [['intl', 'International', false]],
    title: 'Forecasting Upwelling Phenomena in Lake Laut Tawar: A Semi-Supervised Learning Approach',
    venue: 'Infolitika Journal of Data Science (IJDS)', date: '19 Nov 2024' },
]

const EXPERIENCE = [
  { now: true, when: '2026 – Present', role: 'Junior Network Engineer', org: 'PT Mastersystem Infotama · Jakarta',
    points: ['Configure, deploy, and support enterprise network infrastructure (routing & switching).', 'Assist with implementation, monitoring, and troubleshooting of LAN/WAN and network security devices.', 'Support client network operations and maintenance as part of the engineering team.'] },
  { when: 'January 2026 – March 2026', role: 'Commissioning Team — HMI Installation', org: 'PT. Kumatsu Gata Group · LPG Compressor K-6405 (PT Perta Arun Gas)',
    points: ['Installed and configured HMI panels for compressor control systems.', 'Supported integration between PLC, field instruments, and the HMI interface.', 'Ran commissioning, system testing, and troubleshooting against engineering drawings.'] },
  { when: 'December 2023 – January 2024', role: 'Electrical Engineering Intern', org: 'PT. Perta Arun Gas · Lhokseumawe, Aceh',
    points: ['Reviewed electrical single-line diagrams.', 'Assisted in troubleshooting and repairing relay control systems on the production line.', 'Supported cathodic protection measurements for water-intake basin structures.'] },
  { when: '2024', role: 'Machine Learning Intern', org: 'GoDentist · Bangkit led by Google',
    points: ['Developed an ML model for dental disease detection achieving 98% accuracy.', 'Optimized database storage, improving data efficiency and management.'] },
  { when: 'May 2023 – June 2025', role: 'Research Manager', org: 'KSPM USK Investment Club',
    points: ['Led the research department, coordinating members and research activities.', 'Produced comprehensive research reports supporting club initiatives.'] },
]

/* ----------------------------- motion helpers ------------------------------ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div className="scroll-prog" style={{ scaleX: sx }} />
}

function AuroraBg() {
  const reduce = useReducedMotion()
  const blob = (style, anim, dur) => (
    <motion.div className="ab" style={style}
      animate={reduce ? {} : anim}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }} />
  )
  return (
    <div className="aurora" aria-hidden="true">
      {blob({ width: 620, height: 620, background: '#3B82F6', top: '-12%', left: '-6%', opacity: 0.42 },
        { x: [0, 140, -40, 0], y: [0, 90, 180, 0], scale: [1, 1.15, 0.95, 1] }, 24)}
      {blob({ width: 540, height: 540, background: '#7C3AED', top: '28%', right: '-10%', opacity: 0.32 },
        { x: [0, -120, 50, 0], y: [0, 130, -70, 0], scale: [1, 0.9, 1.2, 1] }, 28)}
      {blob({ width: 500, height: 500, background: '#22D3EE', bottom: '-14%', left: '32%', opacity: 0.22 },
        { x: [0, 90, -70, 0], y: [0, -90, 50, 0], scale: [1, 1.1, 0.92, 1] }, 32)}
    </div>
  )
}

function CountUp({ to, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [val, setVal] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!inView) return
    if (reduce) { setVal(to); return }
    const c = animate(0, to, { duration: 1.5, ease: EASE, onUpdate: (v) => setVal(v) })
    return () => c.stop()
  }, [inView, to, reduce])
  return <span ref={ref}>{val.toFixed(decimals)}</span>
}

/* reveal-on-scroll wrapper */
function Reveal({ children, delay = 0, className = '', as = 'div', style, ...rest }) {
  const M = motion[as] || motion.div
  return (
    <M className={className} style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      {...rest}>
      {children}
    </M>
  )
}

/* magnetic button using framer-motion springs */
function Magnetic({ as = 'a', className = '', children, ...rest }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })
  const ref = useRef(null)
  const Comp = motion[as] || motion.a
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer:fine)').matches
  return (
    <Comp ref={ref} className={className} style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.045 }} whileTap={{ scale: 0.97 }}
      onMouseMove={(e) => {
        if (!fine || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.2)
        y.set((e.clientY - r.top - r.height / 2) * 0.3)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      {...rest}>
      {children}
    </Comp>
  )
}

/* certificate / award card with stagger entrance */
function VCard({ item, isAward, onOpen, index = 0 }) {
  const [failed, setFailed] = useState(false)
  const clickable = !!item.id
  return (
    <motion.button type="button"
      className={'vcard glass gloss' + (clickable ? '' : ' static')}
      aria-label={clickable ? `${isAward ? 'View award' : 'View certificate'}: ${item.title}` : item.title}
      onClick={() => clickable && onOpen(item)}
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ type: 'spring', stiffness: 130, damping: 18, delay: (index % 4) * 0.07 }}
      whileHover={clickable ? { y: -8, scale: 1.02 } : { y: -4 }}>
      <div className="vthumb">
        {isAward && item.rank && (<span className="ribbon"><Ic k="trophy" />{item.rank}</span>)}
        {clickable && !failed ? (
          <img src={thumb(item.id)} alt={item.title} loading="lazy" onError={() => setFailed(true)} />
        ) : (
          <div className="ph" style={{ display: 'grid' }}><Ic k={isAward ? 'trophy' : 'cert'} /></div>
        )}
        {clickable && (<div className="view-ov"><span><Ic k="eye" /> Preview</span></div>)}
      </div>
      <div className="vbody">
        <span className="vissuer">{item.issuer}</span>
        <span className="vtitle">{item.title}</span>
        {item.date && <span className="vdate">{item.date}</span>}
      </div>
    </motion.button>
  )
}

const NAV = [
  ['About', '#about'], ['Experience', '#experience'], ['Publications', '#publications'],
  ['Awards', '#awards'], ['Certifications', '#certifications'], ['Contact', '#contact'],
]

export default function App() {
  const [theme, setTheme] = useState('light')
  const [modal, setModal] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [showAll, setShowAll] = useState(false)
  const reduce = useReducedMotion()

  /* hero parallax */
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 130])
  const heroFade = useTransform(scrollY, [0, 520], [1, 0])
  const portraitY = useTransform(scrollY, [0, 600], [0, -60])

  useEffect(() => {
    let saved = null
    try { saved = localStorage.getItem('theme') } catch (e) {}
    setTheme(saved || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'))
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('theme', theme) } catch (e) {}
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach(([, href]) => { const el = document.querySelector(href); if (el) spy.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); spy.disconnect() }
  }, [])

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''
    const onKey = (e) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal])

  const totalCerts = CERTS.length + MORE.length
  const float = reduce ? {} : { y: [0, -14, 0] }

  return (
    <>
      <ScrollProgress />
      <AuroraBg />

      {/* NAV */}
      <motion.header className="nav" id="nav"
        initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}>
        <div className={'nav-inner' + (scrolled ? ' scrolled' : '')}>
          <a href="#home" className="brand"><span className="dot" />Fakhrus&nbsp;Syakir</a>
          <nav className="nav-links">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className={active === href.slice(1) ? 'active' : ''}>{label}</a>
            ))}
          </nav>
          <motion.button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode" whileHover={{ scale: 1.1, rotate: 12 }} whileTap={{ scale: 0.9 }}>
            <Ic k={theme === 'dark' ? 'moon' : 'sun'} />
          </motion.button>
        </div>
      </motion.header>

      <main id="home">
        {/* HERO */}
        <section className="hero">
          <div className="grid-bg" />
          <div className="wrap hero-inner">
            <motion.div className="hero-text" style={{ y: heroY, opacity: heroFade }}>
              <Reveal as="span" className="badge glass gloss"><span className="pulse" />Currently @ PT Mastersystem Infotama · Junior Network Engineer</Reveal>
              <Reveal as="span" className="eyebrow" delay={0.05}>Network Engineer · ML Researcher</Reveal>
              <Reveal as="h1" delay={0.1}>Fakhrus Syakir<br /><span className="grad">Networks, power &amp; intelligence</span></Reveal>
              <Reveal as="p" className="role" delay={0.15}>Junior Network Engineer &amp; Machine Learning researcher · Electrical Engineering graduate</Reveal>
              <Reveal as="p" className="lede" delay={0.2}>I build and support enterprise network infrastructure, with an engineering foundation spanning power systems and HMI commissioning — and published machine-learning research on environmental forecasting.</Reveal>
              <Reveal className="cta-row" delay={0.25}>
                <Magnetic className="btn btn-primary" href="#publications"><Ic k="book" /><span>View Research</span></Magnetic>
                <Magnetic className="btn btn-ghost" href="https://drive.google.com/file/d/1YPFNgxAVrZB7kJWr5pa77JsvOrpjjLHU/view" target="_blank" rel="noopener"><Ic k="download" /><span>Download CV</span></Magnetic>
              </Reveal>
              <Reveal className="socials" delay={0.3}>
                {[['linkedin', 'https://www.linkedin.com/in/fakhrus-syakir-65bb72205', 'LinkedIn'], ['mail', 'mailto:fakhroosyakir@gmail.com', 'Email'], ['phone', 'tel:+628116881902', 'Phone']].map(([k, href, label]) => (
                  <motion.a key={k} className="glass gloss" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" aria-label={label}
                    whileHover={{ y: -4, scale: 1.12, rotate: -4 }} whileTap={{ scale: 0.92 }}><Ic k={k} /></motion.a>
                ))}
              </Reveal>
            </motion.div>
            <Reveal className="portrait-wrap" delay={0.15}>
              <motion.div style={{ y: portraitY }}>
                <motion.div animate={float} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'relative' }}>
                  <div className="portrait-glow" />
                  <div className="portrait-frame gloss">
                    <img className="portrait" src={thumb('1w4hF-FEUYgEmC9XkHjY8l_YTK3PpKKix')} alt="Fakhrus Syakir in a suit, outdoors"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = thumb('1n5eqDpuS15Ndy-B88QcQih67C0cippwD') }} />
                  </div>
                </motion.div>
              </motion.div>
              <motion.div className="portrait-chip glass gloss chip-tl"
                animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <span className="num"><CountUp to={3.28} decimals={2} /></span><span className="lbl">GPA<br />B.Eng (EE)</span>
              </motion.div>
              <motion.div className="portrait-chip glass gloss chip-br"
                animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
                <span className="num"><CountUp to={3} /></span><span className="lbl">Journal<br />Publications</span>
              </motion.div>
            </Reveal>
          </div>

          {/* MARQUEE */}
          <div className="wrap"><div className="marquee glass gloss" aria-hidden="true">
            <div className="marquee-track">
              {[...Array(2)].flatMap((_, n) => [
                'Network Engineering', 'Routing & Switching', 'Machine Learning', 'HMI Commissioning',
                'Time Series Forecasting', 'ETAP · PVsyst · CX-One', 'Python · RStudio', 'Power System Analysis',
              ].map((t, i) => (<span className="marquee-item" key={n + '-' + i}><span className="d" />{t}</span>)))}
            </div>
          </div></div>
        </section>

        {/* ABOUT */}
        <section className="block" id="about">
          <div className="wrap">
            <Reveal className="sec-head"><span className="eyebrow">About</span><h2>From the plant floor<br />to the network &amp; the lab</h2></Reveal>
            <div className="about-grid">
              <Reveal>
                <p className="body">I'm a <strong>Junior Network Engineer at PT Mastersystem Infotama</strong>, one of Indonesia's leading IT &amp; network infrastructure integrators. I work on configuring, deploying, and supporting enterprise network systems.</p>
                <p className="body">My foundation is in <strong>Electrical Engineering</strong> (Syiah Kuala University) with hands-on industrial experience — relay control systems, cathodic protection, and HMI commissioning for Pertamina-affiliated facilities.</p>
                <p className="body">In parallel I'm a Google Bangkit <strong>Distinction Graduate</strong> in Machine Learning, applying time-series analysis and ML to environmental forecasting — including a peer-reviewed Scopus Q2 publication.</p>
                <div className="skills-wrap">
                  <div className="skills-title">Core toolbox</div>
                  <div className="tags">
                    {['Routing & Switching', 'Network Infrastructure', 'ETAP', 'PVsyst', 'CX-One', 'Python', 'RStudio', 'Streamlit', 'Time Series', 'TensorFlow'].map((t, i) => (
                      <motion.span className="tag glass gloss" key={t}
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.04 }} whileHover={{ y: -3, scale: 1.06 }}>{t}</motion.span>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal className="facts" delay={0.1}>
                {[['server', 'Current role', 'Junior Network Engineer', 'PT Mastersystem Infotama · 2026–Present'],
                  ['cap', 'Education', 'B.Eng Electrical Engineering', 'Syiah Kuala University · 2021–2025'],
                  ['check', 'Focus', 'Networks · Power · Machine Learning', null],
                  ['mail', 'Contact', 'fakhroosyakir@gmail.com', null]].map(([k, kk, v, sub], i) => (
                  <motion.div className="fact glass gloss" key={kk} whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <span className="ic"><Ic k={k} /></span>
                    <div><div className="k">{kk}</div><div className="v">{v}</div>{sub && <div className="k" style={{ textTransform: 'none' }}>{sub}</div>}</div>
                  </motion.div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="block" id="experience">
          <div className="wrap">
            <Reveal className="sec-head"><span className="eyebrow">Experience</span><h2>A path across networks, plants &amp; labs</h2></Reveal>
            <div className="timeline">
              {EXPERIENCE.map((e, i) => (
                <motion.div className={'tl-item' + (e.now ? ' now' : '')} key={i}
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}>
                  <div className="tl-when">{e.when}{e.now && <span className="tl-now-badge">Now</span>}</div>
                  <div className="tl-role">{e.role}</div>
                  <div className="tl-org">{e.org}</div>
                  <ul className="tl-list">{e.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PUBLICATIONS */}
        <section className="block" id="publications">
          <div className="wrap">
            <Reveal className="sec-head"><span className="eyebrow">Publications</span><h2>Peer-reviewed research</h2><p>Machine learning &amp; time-series methods applied to environmental forecasting in Indonesian lakes.</p></Reveal>
            <div className="pub-wrap">
              {PUBS.filter((p) => p.featured).map((p) => (
                <motion.a className="pub-card pub-featured gloss shine" key={p.href} href={p.href} target="_blank" rel="noopener"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.6, ease: EASE }} whileHover={{ y: -9, scale: 1.01 }}>
                  <span className="fx a" /><span className="fx b" />
                  <div className="pub-quote">“</div>
                  <div className="pub-num">Featured · Journal Article</div>
                  <div className="pub-badges">{p.badges.map(([cls, label, gem]) => <span className={'pill ' + cls} key={label}>{gem && <Ic k="gem" />}{label}</span>)}</div>
                  <h3>{p.title}</h3>
                  <p className="pub-venue">{p.venue}</p>
                  <div className="pub-meta"><span className="pub-date">{p.date}</span><span className="pub-link">Read paper <Ic k="ext" /></span></div>
                </motion.a>
              ))}
              <div className="pub-side">
                {PUBS.filter((p) => !p.featured).map((p, i) => (
                  <motion.a className="pub-card glass gloss shine" key={p.href} href={p.href} target="_blank" rel="noopener"
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }} whileHover={{ y: -7, scale: 1.015 }}>
                    <div className="pub-badges">{p.badges.map(([cls, label]) => <span className={'pill ' + cls} key={label}>{label}</span>)}</div>
                    <h3>{p.title}</h3>
                    <p className="pub-venue">{p.venue}</p>
                    <div className="pub-meta"><span className="pub-date">{p.date}</span><span className="pub-link">Read paper <Ic k="ext" /></span></div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AWARDS */}
        <section className="block" id="awards">
          <div className="wrap">
            <Reveal className="sec-head"><span className="eyebrow">Awards</span><h2>Competition highlights</h2><p>Click any award to view the certificate in full.</p></Reveal>
            <div className="vgrid">
              {AWARDS.map((a, i) => <VCard key={a.id || a.title} item={a} isAward index={i} onOpen={setModal} />)}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section className="block" id="certifications">
          <div className="wrap">
            <Reveal className="sec-head"><span className="eyebrow">Certifications</span><h2>Credentials &amp; competencies</h2><p>A selection of my strongest certificates — click any to preview it in full.</p></Reveal>
            <div className="vgrid">
              {CERTS.map((c, i) => <VCard key={c.id} item={c} index={i} onOpen={setModal} />)}
            </div>
            <AnimatePresence initial={false}>
              {showAll && (
                <motion.div className="vgrid" style={{ marginTop: 20, overflow: 'hidden' }}
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}>
                  {MORE.map((c, i) => <VCard key={c.id} item={c} index={i} onOpen={setModal} />)}
                </motion.div>
              )}
            </AnimatePresence>
            <Reveal style={{ marginTop: 32, textAlign: 'center' }}>
              <Magnetic as="button" className="btn btn-ghost" style={{ display: 'inline-flex' }}
                onClick={() => { const o = !showAll; setShowAll(o); if (!o) document.getElementById('certifications').scrollIntoView({ behavior: 'smooth' }) }}
                aria-expanded={showAll}>
                <motion.span style={{ display: 'inline-flex' }} animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}><Ic k="chevron" /></motion.span>
                <span>{showAll ? 'Show fewer' : `View all ${totalCerts} certificates`}</span>
              </Magnetic>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section className="block" id="contact">
          <div className="wrap">
            <Reveal className="contact-card gloss">
              <span className="cblob x" /><span className="cblob y" />
              <h2>Let's build something reliable</h2>
              <p>Open to network engineering, electrical, and machine-learning research opportunities. Let's connect.</p>
              <div className="cta-row">
                <Magnetic className="btn btn-primary" href="mailto:fakhroosyakir@gmail.com"><Ic k="mail" /><span>Email me</span></Magnetic>
                <Magnetic className="btn btn-ghost" href="https://www.linkedin.com/in/fakhrus-syakir-65bb72205" target="_blank" rel="noopener"><Ic k="linkedin" /><span>Connect on LinkedIn</span></Magnetic>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="brand"><span className="dot" />Fakhrus Syakir</div>
          <div>Junior Network Engineer · Electrical Engineer · ML Researcher — Indonesia</div>
          <div style={{ marginTop: 6 }}>© {new Date().getFullYear()} Fakhrus Syakir. Built with care.</div>
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <div className="modal open" role="dialog" aria-modal="true">
            <motion.div className="modal-scrim" onClick={() => setModal(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
            <motion.div className="modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.28, ease: EASE }}>
              <div className="modal-bar">
                <h3>{modal.title}</h3>
                <div className="actions">
                  <a className="open-ext" href={`https://drive.google.com/file/d/${modal.id}/view`} target="_blank" rel="noopener">Open in Drive <Ic k="ext" /></a>
                  <button className="icon-btn" onClick={() => setModal(null)} aria-label="Close"><Ic k="close" /></button>
                </div>
              </div>
              <iframe title="Certificate preview" src={`https://drive.google.com/file/d/${modal.id}/preview`} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

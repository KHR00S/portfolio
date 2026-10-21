import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { Lake } from './Lake'
import { useTheme } from '../theme'
import { BUILDS, EMAIL, EXPERIENCE, LINKS, PUBLICATIONS, STRATA, type Cover } from '../content'

const EXPO = [0.19, 1, 0.22, 1] as const
export const WRAP = 'mx-auto w-full max-w-[1400px] px-4 md:px-8'

/* ------------------------------ building blocks ----------------------------- */

export function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-rule py-20 md:py-32 ${className}`}>
      <div className={WRAP}>{children}</div>
    </section>
  )
}

export function SectionHead({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-12 grid gap-5 md:mb-16 lg:grid-cols-12 lg:items-end">
      <h2 id={`${id}-title`} className="display text-[clamp(3.25rem,9vw,7.5rem)] lg:col-span-7">
        {title}
      </h2>
      {children ? <div className="max-w-[46ch] text-muted lg:col-span-5 lg:pb-3">{children}</div> : null}
    </div>
  )
}

export function ExternalLink({ href, children, label }: { href: string; children: ReactNode; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="ink-link inline-flex items-center gap-1 font-medium text-fg"
    >
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  )
}

/* ------------------------------------ nav ----------------------------------- */

const NAV = [
  ['Path', '#path'],
  ['Research', '#research'],
  ['Builds', '#builds'],
  ['Credentials', '#credentials'],
  ['Contact', '#contact'],
] as const

function ThemeButton() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      aria-label={`Switch to ${next} theme`}
      className="grid h-11 w-11 place-items-center rounded-full border border-rule text-fg transition-colors hover:border-iso hover:bg-bg-2"
    >
      {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${
        solid ? 'border-b border-rule bg-bg/90 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Main" className={`${WRAP} flex h-16 items-center justify-between gap-4`}>
        <a href="#top" className="display text-[1.75rem] leading-none" aria-label="Fakhrus Syakir, back to top">
          FS
        </a>
        <ul className="hidden items-center gap-7 text-[15px] md:flex">
          {NAV.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="text-muted transition-colors hover:text-fg">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeButton />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-rule md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      {open ? (
        <ul id="mobile-menu" className={`${WRAP} grid gap-1 pb-5 md:hidden`}>
          {NAV.map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={() => setOpen(false)} className="display block py-2 text-4xl">
                {label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  )
}

/* ------------------------------------ hero ---------------------------------- */

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  return (
    <section id="top" ref={ref} aria-labelledby="top-title" className="relative flex min-h-[100svh] flex-col pt-16">
      <div className={`${WRAP} relative z-10 grid gap-8 pt-8 md:pt-14 lg:grid-cols-12 lg:items-end`}>
        <h1 id="top-title" translate="no" className="display text-[clamp(4.5rem,23vw,14.5rem)] lg:col-span-8">
          {['Fakhrus', 'Syakir'].map((word, i) => (
            <span key={word} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EXPO, delay: 0.1 + i * 0.12 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="lg:col-span-4 lg:pb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.45 }}
        >
          <p className="max-w-[36ch] text-lg leading-relaxed text-muted">
            Junior network engineer at PT Mastersystem Infotama in Jakarta. Electrical engineer by training.
            I also build machine-learning models that forecast upwelling in Indonesian lakes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex min-h-11 items-center rounded-full bg-lamp px-6 font-semibold text-on-lamp transition-transform hover:-translate-y-0.5"
            >
              Email me
            </a>
            <a
              href="#research"
              className="inline-flex min-h-11 items-center rounded-full border border-rule px-6 font-medium transition-colors hover:border-iso hover:bg-bg-2"
            >
              Read the research
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative mt-6 min-h-[240px] w-full flex-1 touch-pan-y"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.3 }}
      >
        <Lake pointerTarget={ref} />
        <p className="absolute bottom-4 left-4 max-w-[34ch] rounded-lg bg-bg/80 px-3 py-2 text-sm text-muted backdrop-blur-sm md:left-auto md:right-8">
          <span className="[@media(hover:none)]:hidden">Move across the lake</span>
          <span className="hidden [@media(hover:none)]:inline">Tap the lake</span> to bring deep water up. That
          event, upwelling, is what my research forecasts.
        </p>
      </motion.div>
    </section>
  )
}

/* ----------------------------------- about ---------------------------------- */

export function About() {
  return (
    <Section id="about">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-4">
          <div className="overflow-hidden rounded-[2rem] bg-bg-2">
            <img
              src={`${import.meta.env.BASE_URL}me-cutout.png`}
              alt="Fakhrus Syakir in a dark suit"
              width={471}
              height={422}
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        </figure>
        <div className="lg:col-span-8">
          <h2 id="about-title" className="display text-[clamp(3rem,7.5vw,6rem)]">
            Cables, current and data
          </h2>
          <div className="mt-8 grid gap-5 text-muted md:grid-cols-2 md:gap-8">
            <p>
              At PT Mastersystem Infotama I configure, deploy and support enterprise networks: routing, switching
              and security devices for client sites.
            </p>
            <p>
              I studied electrical engineering at Syiah Kuala University and worked on plant floors in Aceh,
              commissioning HMI panels and repairing relay control systems.
            </p>
            <p>
              Alongside that I research forecasting with machine learning. I graduated from Bangkit with
              distinction and have three peer-reviewed papers, one in a Scopus Q2 journal.
            </p>
            <p className="text-fg">I’m open to network engineering, electrical and machine-learning research roles.</p>
          </div>
        </div>
      </div>

      <ul aria-label="What I work in" className="mt-16 overflow-hidden rounded-[2rem] border border-rule md:mt-24">
        {STRATA.map((s, i) => (
          <li
            key={s.name}
            className="grid gap-3 px-5 py-7 md:grid-cols-12 md:items-baseline md:gap-8 md:px-10 md:py-9"
            style={{ background: `color-mix(in srgb, var(--iso) ${6 + i * 9}%, var(--bg))` }}
          >
            <h3 className="display text-5xl md:col-span-3 md:text-6xl">{s.name}</h3>
            <p className="md:col-span-5">{s.line}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-muted md:col-span-4">
              {s.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* ------------------------------------ path ---------------------------------- */

export function Path() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 80%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <Section id="path">
      <SectionHead id="path" title="Path">
        Newest first, drawn like a single-line diagram. The lit lamp is where I work now.
      </SectionHead>
      <div className="relative lg:ml-[calc(100%/12*4)]">
        <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-rule" />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-3 left-[6.5px] top-3 w-[2px] origin-top bg-iso"
          style={{ scaleY: reduce ? 1 : fill }}
        />
        <ol ref={listRef} className="relative">
          {EXPERIENCE.map((e) => (
            <li
              key={e.role + e.when}
              className="relative grid gap-1 pb-12 pl-10 last:pb-0 md:grid-cols-[10rem_1fr] md:gap-8 md:pl-14"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[0.4rem] h-[15px] w-[15px] ${
                  e.live ? 'lamp-pulse rounded-full bg-lamp' : 'border-2 border-iso bg-bg'
                }`}
              />
              <p className="tnum pt-0.5 text-[15px] text-muted">
                {e.when}
                {e.live ? <span className="sr-only">, current role</span> : null}
              </p>
              <div>
                <h3 className="text-xl font-semibold leading-snug md:text-2xl">{e.role}</h3>
                <p className="text-muted">
                  {e.org}
                  {e.place ? `, ${e.place}` : ''}
                </p>
                {e.points.length ? (
                  <ul className="mt-3 max-w-[62ch] list-disc space-y-1.5 pl-5 text-[15px] text-muted marker:text-iso">
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

/* ---------------------------------- research -------------------------------- */

/* a journal cover linked to its journal or issue page; hides itself if the publisher won't serve it */
function CoverLink({ cover, className }: { cover: Cover; className: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <a href={cover.href} target="_blank" rel="noopener noreferrer" className="block w-fit">
      <img
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-auto rounded-md bg-bg-2 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] transition-transform duration-300 hover:-translate-y-1 ${className}`}
      />
    </a>
  )
}

export function Research() {
  const [featured, ...rest] = PUBLICATIONS
  return (
    <Section id="research">
      <SectionHead id="research" title="Research">
        Three peer-reviewed papers on forecasting upwelling in two Indonesian lakes, Laut Tawar and Maninjau.
      </SectionHead>

      <article className="grid gap-8 border-t-2 border-fg pt-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="inline-flex rounded-full border border-lamp-ink px-3 py-1 text-sm font-semibold text-lamp-ink">
            {featured.badge}
          </p>
          <h3 className="display mt-5 text-[clamp(2.1rem,4.4vw,3.75rem)] leading-[0.95]">{featured.title}</h3>
          <p className="mt-5 text-muted">
            {featured.venue}, <span className="tnum">{featured.date}</span>
          </p>
          <p className="mt-6">
            <ExternalLink href={featured.href} label={`Read on Springer: ${featured.title}`}>
              Read on Springer
            </ExternalLink>
          </p>
        </div>
        <figure className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
          <CoverLink cover={featured.cover} className="w-full max-w-[240px] lg:max-w-[280px]" />
          <figcaption className="mt-3 max-w-[32ch] text-sm text-muted">{featured.cover.caption}</figcaption>
        </figure>
      </article>

      <ul className="mt-12">
        {rest.map((p) => (
          <li
            key={p.href}
            className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-2 border-t border-rule py-7 md:grid-cols-[6rem_1fr_16rem] md:gap-x-8"
          >
            <div className="row-span-2 md:row-span-1">
              <CoverLink cover={p.cover} className="w-full" />
            </div>
            <div>
              <p className="tnum text-[15px] text-muted">{p.date}</p>
              <h3 className="mt-1 text-xl font-semibold leading-snug">
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="ink-link">
                  {p.title}
                </a>
              </h3>
            </div>
            <p className="text-[15px] text-muted md:pt-7">
              {p.venue}
              <span className="mt-1 block">{p.cover.caption}</span>
              <span className="mt-1 block font-semibold text-fg">{p.badge}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* ----------------------------------- builds --------------------------------- */

export function Builds() {
  return (
    <Section id="builds">
      <SectionHead id="builds" title="Builds">
        Code and coursework you can open. Each row links to the repository or the certificate.
      </SectionHead>
      <ul>
        {BUILDS.map((b) => (
          <li key={b.title} className="grid gap-3 border-t border-rule py-8 md:grid-cols-12 md:gap-8">
            <p className="tnum text-[15px] text-muted md:col-span-1 md:pt-1">{b.year}</p>
            <h3 className="display text-[2.1rem] leading-[0.95] md:col-span-4 md:text-[2.6rem]">{b.title}</h3>
            <div className="md:col-span-5">
              <p className="text-muted">{b.desc}</p>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {b.tools.map((t) => (
                  <li key={t} className="rounded-full border border-rule px-3 py-0.5">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <p className="md:col-span-2 md:pt-1 md:text-right">
              <ExternalLink href={b.href} label={`${b.linkLabel}: ${b.title}`}>
                {b.linkLabel}
              </ExternalLink>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* ---------------------------------- contact --------------------------------- */

export function Contact() {
  return (
    <Section id="contact" className="pb-16 md:pb-24">
      <h2 id="contact-title" className="display text-[clamp(3.25rem,9vw,7.5rem)]">
        Say hello
      </h2>
      <p className="mt-6 max-w-[46ch] text-muted">
        Open to network engineering, electrical and machine-learning research roles. Email is the quickest way
        to reach me.
      </p>
      <a
        href={`mailto:${EMAIL}`}
        translate="no"
        className="display mt-8 block text-[clamp(2.1rem,8.4vw,7.5rem)] text-lamp-ink [overflow-wrap:anywhere] hover:underline hover:decoration-2 hover:underline-offset-8"
      >
        {EMAIL}
      </a>
      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-lg">
        {LINKS.map((l) => (
          <li key={l.href}>
            <ExternalLink href={l.href}>{l.label}</ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className={`${WRAP} flex flex-col gap-3 py-8 text-sm text-muted md:flex-row md:justify-between`}>
        <p>© {new Date().getFullYear()} Fakhrus Syakir</p>
        <p className="flex gap-6">
          <a href="https://github.com/KHR00S/portfolio" target="_blank" rel="noopener noreferrer" className="ink-link">
            Source on GitHub
          </a>
          <a href="#top" className="ink-link">
            Back to top
          </a>
        </p>
      </div>
    </footer>
  )
}

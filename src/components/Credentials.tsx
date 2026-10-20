import { useEffect, useRef, useState } from 'react'
import { Award, FileText, X } from 'lucide-react'
import { AWARDS, CERTS, MORE } from '../data'
import { driveThumb, driveView } from '../content'
import { ExternalLink, Section, SectionHead } from './sections'

interface Credential {
  id: string
  issuer: string
  title: string
  date: string
  rank?: string
}

function Thumb({ item, width }: { item: Credential; width: number }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="grid h-full w-full place-items-center text-muted">
        {item.rank ? <Award size={28} aria-hidden="true" /> : <FileText size={28} aria-hidden="true" />}
      </span>
    )
  }
  return (
    <img
      src={driveThumb(item.id, width)}
      alt=""
      width={width}
      height={Math.round(width * 0.75)}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  )
}

/* Drive sometimes refuses thumbnails (throttling, signed-in redirects); say so plainly */
function PreviewImage({ item }: { item: Credential }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <p className="grid min-h-[40svh] place-items-center p-6 text-center text-muted">
        Google Drive didn’t send a preview. The link below opens the original document.
      </p>
    )
  }
  return (
    <img
      src={driveThumb(item.id, 1000)}
      alt={`${item.title}, issued by ${item.issuer}`}
      width={1000}
      height={707}
      onError={() => setFailed(true)}
      className="mx-auto h-auto max-h-[64svh] w-auto max-w-full object-contain"
    />
  )
}

function PreviewDialog({ item, onClose }: { item: Credential | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (item && !d.open) d.showModal()
    if (!item && d.open) d.close()
  }, [item])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={item ? 'preview-title' : undefined}
      aria-label={item ? undefined : 'Certificate preview'}
      className="m-auto max-h-[92svh] w-[min(94vw,980px)] overscroll-contain rounded-[1.5rem] border border-rule bg-bg-2 p-0 text-fg"
    >
      {item ? (
        <div className="flex max-h-[92svh] flex-col gap-4 p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="preview-title" className="text-xl font-semibold leading-snug md:text-2xl">
                {item.title}
              </h2>
              <p className="text-muted">
                {item.issuer}, <span className="tnum">{item.date}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close preview"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rule hover:bg-bg-3"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain rounded-xl bg-bg">
            <PreviewImage key={item.id} item={item} />
          </div>
          <p>
            <ExternalLink href={driveView(item.id)}>Open the original in Google Drive</ExternalLink>
          </p>
        </div>
      ) : null}
    </dialog>
  )
}

export function Credentials() {
  const [preview, setPreview] = useState<Credential | null>(null)
  const [showAll, setShowAll] = useState(false)
  const total = CERTS.length + MORE.length

  return (
    <Section id="credentials">
      <SectionHead id="credentials" title="Credentials">
        {AWARDS.length} awards and {total} certificates. Select any of them to see the original document.
      </SectionHead>

      <h3 className="text-2xl font-semibold">Awards</h3>
      <ul className="mt-6">
        {AWARDS.map((a) => (
          <li key={a.id} className="border-t border-rule">
            <button
              type="button"
              onClick={() => setPreview(a)}
              className="grid w-full gap-2 py-6 text-left transition-colors hover:bg-bg-2 md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
            >
              <span className="display text-4xl md:col-span-3 md:text-5xl">{a.rank}</span>
              <span className="text-lg font-medium leading-snug md:col-span-6">{a.title}</span>
              <span className="text-[15px] text-muted md:col-span-3 md:text-right">
                {a.issuer}, <span className="tnum">{a.date}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-16 text-2xl font-semibold md:mt-20">Certificates</h3>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CERTS.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setPreview(c)}
              className="flex h-full w-full flex-col gap-3 rounded-[1.25rem] border border-rule p-3 text-left transition-colors hover:border-iso hover:bg-bg-2"
            >
              <span className="block aspect-[4/3] w-full overflow-hidden rounded-xl bg-bg-2">
                <Thumb item={c} width={480} />
              </span>
              <span className="px-1 pb-1">
                <span className="block font-medium leading-snug">{c.title}</span>
                <span className="mt-1 block text-sm text-muted">
                  {c.issuer}, <span className="tnum">{c.date}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={showAll}
        aria-controls="more-certificates"
        onClick={() => setShowAll((s) => !s)}
        className="mt-8 inline-flex min-h-11 items-center rounded-full border border-rule px-6 font-medium transition-colors hover:border-iso hover:bg-bg-2"
      >
        {showAll ? 'Show fewer certificates' : `Show ${MORE.length} more certificates`}
      </button>

      {showAll ? (
        <ul id="more-certificates" className="mt-8 grid gap-x-10 md:grid-cols-2">
          {MORE.map((c) => (
            <li key={c.id} className="border-t border-rule">
              <button
                type="button"
                onClick={() => setPreview(c)}
                className="flex min-h-11 w-full flex-col py-3 text-left transition-colors hover:text-lamp-ink"
              >
                <span className="leading-snug">{c.title}</span>
                <span className="text-sm text-muted">
                  {c.issuer}, <span className="tnum">{c.date}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <PreviewDialog item={preview} onClose={() => setPreview(null)} />
    </Section>
  )
}

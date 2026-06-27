/**
 * SCHERMATA 6 – I VOSTRI RICORDI
 * Galleria della famiglia con stato vuoto, loading ed errore.
 *
 * Server Component – recupera i ricordi da Supabase.
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { copy } from '@/lib/copy'
import type { Memory, MemoryType } from '@/types/supabase'
import { SimpleHeader } from '@/components/ui'

// ── Icone per tipo di ricordo ─────────────────────────────────

function MemoryTypeIcon({ type }: { type: MemoryType }) {
  const icons: Record<MemoryType, JSX.Element> = {
    video: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="7" width="18" height="14" rx="2" />
        <path d="M19 11l8-4v14l-8-4" />
      </svg>
    ),
    audio: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V12a5 5 0 0 1 10 0v6" />
        <path d="M9 18H7a2 2 0 0 0 0 4h2v-4zm10 0h2a2 2 0 0 1 0 4h-2v-4z" />
      </svg>
    ),
    photo: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="24" height="18" rx="2" />
        <circle cx="14" cy="14" r="4" />
        <path d="M10 5V3m8 2V3" />
      </svg>
    ),
    document: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9z" />
        <polyline points="15 2 15 9 22 9" />
        <line x1="8" y1="15" x2="20" y2="15" />
        <line x1="8" y1="20" x2="16" y2="20" />
      </svg>
    ),
    text: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="7" x2="24" y2="7" />
        <line x1="4" y1="13" x2="24" y2="13" />
        <line x1="4" y1="19" x2="16" y2="19" />
      </svg>
    ),
  }
  return icons[type] ?? icons.document
}

// ── Voce singola ricordo ──────────────────────────────────────

function MemoryItem({ memory }: { memory: Memory }) {
  const c = copy.gallery
  const typeLabel = c.types[memory.type] ?? memory.type
  const date = memory.year
    ? `${memory.year}`
    : new Date(memory.created_at).toLocaleDateString('it-IT', { year: 'numeric', month: 'long' })

  return (
    <div className="border-b border-casa-border last:border-b-0 py-4 flex items-center gap-4 cursor-pointer hover:bg-casa-cream-deep/50 -mx-2 px-2 rounded-[6px] transition-colors duration-150">
      <div
        className="w-12 h-12 rounded-[8px] flex items-center justify-center flex-shrink-0 text-casa-gold"
        style={{ background: 'rgba(168,128,48,0.1)' }}
      >
        <MemoryTypeIcon type={memory.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[14px] text-casa-dark leading-[1.4] truncate">
          {memory.title}
        </p>
        <p className="font-ui text-[11px] text-casa-light tracking-[0.04em] mt-1">
          {typeLabel} · {date}
          {memory.location ? ` · ${memory.location}` : ''}
        </p>
      </div>
    </div>
  )
}

// ── Placeholder foto per la griglia ──────────────────────────

const PLACEHOLDER_TILES = [
  { gradient: 'linear-gradient(155deg, #C0AA80 0%, #9A8060 100%)', year: '1962 · Napoli'  },
  { gradient: 'linear-gradient(155deg, #B0987A 0%, #8A7458 100%)', year: '1978 · Firenze' },
  { gradient: 'linear-gradient(155deg, #BCAA88 0%, #9A8868 100%)', year: '1990 · Sicilia' },
]

// ── Schermata principale ──────────────────────────────────────

export default async function GalleryPage() {
  const c = copy.gallery
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Recupera ID famiglia
  const { data: membership } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .single()

  // Recupera ricordi
  const { data: memories, error } = membership?.family_id
    ? await supabase
        .from('memories')
        .select('*')
        .eq('family_id', membership.family_id)
        .order('created_at', { ascending: false })
    : { data: [], error: null }

  const hasMemories = memories && memories.length > 0

  return (
    <main className="mx-auto w-full max-w-casa min-h-[100dvh] bg-casa-cream flex flex-col">
      <SimpleHeader back={{ href: '/domus', label: c.back }} />

      <div className="flex-1 overflow-y-auto pb-8">

        {/* Intestazione */}
        <div className="px-10 pt-8 pb-6">
          <h1 className="font-serif text-h2 text-casa-dark">{c.title}</h1>
          <p className="mt-1 font-body text-small text-casa-mid italic">{c.subtitle}</p>
        </div>

        {/* Stato di errore */}
        {error && (
          <div className="px-10 mb-6">
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[6px]">
              <p className="font-body text-small text-red-700">{c.errors.load}</p>
            </div>
          </div>
        )}

        {/* ── STATO VUOTO ── */}
        {!error && !hasMemories && (
          <div className="px-10 flex flex-col items-center text-center pt-8 pb-4">
            <div
              className="w-[70px] h-[70px] rounded-full flex items-center justify-center mb-8 text-casa-gold"
              style={{ background: 'rgba(168,128,48,0.1)' }}
            >
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="24" height="18" rx="2" />
                <circle cx="14" cy="14" r="4" />
                <path d="M10 5V3m8 2V3" />
              </svg>
            </div>
            <h2 className="font-serif text-[20px] font-normal text-casa-dark mb-3">
              {c.empty.title}
            </h2>
            <p className="font-body text-small text-casa-mid italic leading-[1.9] mb-10 max-w-[240px]">
              {c.empty.subtitle}
            </p>
            <Link
              href="/domus/primo-ricordo"
              className="inline-flex items-center justify-center font-body text-[15px] font-medium tracking-wide text-casa-cream bg-casa-gold hover:bg-casa-gold-dark rounded-button px-10 py-[14px] transition-colors duration-200"
            >
              {c.empty.cta}
            </Link>
          </div>
        )}

        {/* ── CON CONTENUTO ── */}
        {!error && hasMemories && (
          <>
            {/* Griglia foto con placeholder visivi */}
            <div className="grid grid-cols-2 gap-2 px-10 mb-6">
              {PLACEHOLDER_TILES.map((tile, i) => (
                <div
                  key={i}
                  className="rounded-[8px] overflow-hidden relative cursor-pointer"
                  style={{ aspectRatio: '0.82', background: tile.gradient }}
                >
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-8"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.42))' }}>
                    <p className="font-ui text-[10px] tracking-[0.07em] uppercase text-white/80">{tile.year}</p>
                  </div>
                </div>
              ))}

              {/* Tile aggiungi */}
              <Link
                href="/domus/primo-ricordo"
                className="border border-dashed border-casa-border rounded-[8px] flex flex-col items-center justify-center gap-2 hover:border-casa-gold transition-colors duration-200"
                style={{ aspectRatio: '0.82' }}
                aria-label={c.add}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4B898" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="font-body text-[12px] text-casa-light tracking-[0.04em]">{c.add}</span>
              </Link>
            </div>

            {/* Lista ricordi */}
            <div className="px-10">
              {memories.map((memory) => (
                <MemoryItem key={memory.id} memory={memory} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

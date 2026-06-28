/**
 * SCHERMATA 6 – GALLERIA RICORDI
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SimpleHeader } from '@/components/ui'

type MembershipData = {
  family_id: string | null
}

type MemoryFile = {
  id: string
  memory_id: string
  file_url: string
  file_type: string | null
  mime_type: string | null
  file_size: number | null
  created_at: string | null
}

type Memory = {
  id: string
  family_id: string
  author_id: string | null
  title: string
  description: string | null
  memory_type: string | null
  visibility: string | null
  date_of_memory: string | null
  created_at: string | null
  memory_files: MemoryFile[]
}

type MemoryCard = {
  memory: Memory
  signedUrl: string | null
}

function formatDate(value: string | null) {
  if (!value) return 'Data non indicata'

  return new Date(value).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getTypeLabel(type: string | null) {
  switch (type) {
    case 'photo':
      return 'Fotografia'
    case 'video':
      return 'Video'
    case 'audio':
      return 'Audio'
    case 'document':
      return 'Documento'
    case 'story':
      return 'Racconto'
    default:
      return 'Ricordo'
  }
}

function MemoryPreview({
  memory,
  fileUrl,
}: {
  memory: Memory
  fileUrl: string | null
}) {
  const firstFile = memory.memory_files?.[0]
  const type = firstFile?.file_type ?? memory.memory_type ?? 'story'

  if (fileUrl && type === 'photo') {
    return (
      <img
        src={fileUrl}
        alt={memory.title}
        className="h-full w-full object-cover"
      />
    )
  }

  if (fileUrl && type === 'video') {
    return (
      <video
        src={fileUrl}
        className="h-full w-full object-cover"
        muted
        playsInline
      />
    )
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-casa-gold-light text-casa-gold">
      <span className="font-serif text-[42px]">
        {type === 'audio' ? '♪' : type === 'document' ? '□' : '✦'}
      </span>
    </div>
  )
}

export default async function GalleryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (membershipError) {
    console.error('Errore recupero membership:', membershipError.message)
  }

  const membership = membershipData as MembershipData | null

  if (!membership?.family_id) {
    return (
      <main className="mx-auto w-full max-w-casa min-h-[100dvh] bg-casa-cream flex flex-col">
        <SimpleHeader back={{ href: '/auth/domus', label: 'Torna alla Domus' }} />

        <section className="flex-1 flex flex-col items-center justify-center px-10 text-center">
          <h1 className="font-serif text-h2 text-casa-dark">
            Nessuna Domus trovata
          </h1>

          <p className="mt-4 font-body text-small text-casa-mid leading-[1.8]">
            Non abbiamo trovato una famiglia collegata a questo account.
          </p>
        </section>
      </main>
    )
  }

  const { data: memoriesData, error: memoriesError } = await supabase
    .from('memories')
    .select(
      `
      id,
      family_id,
      author_id,
      title,
      description,
      memory_type,
      visibility,
      date_of_memory,
      created_at,
      memory_files (
        id,
        memory_id,
        file_url,
        file_type,
        mime_type,
        file_size,
        created_at
      )
    `
    )
    .eq('family_id', membership.family_id)
    .order('created_at', { ascending: false })

  if (memoriesError) {
    console.error('Errore recupero ricordi:', memoriesError.message)
  }

  const memories = (memoriesData ?? []) as Memory[]
  const hasMemories = memories.length > 0

  const memoryCards: MemoryCard[] = await Promise.all(
    memories.map(async (memory) => {
      const firstFile = memory.memory_files?.[0]
      const filePath = firstFile?.file_url ?? null

      if (!filePath) {
        return {
          memory,
          signedUrl: null,
        }
      }

      const { data: signedData, error: signedError } = await supabase.storage
        .from('memories')
        .createSignedUrl(filePath, 60 * 60)

      if (signedError) {
        console.error('Errore signed URL:', signedError.message)
        return {
          memory,
          signedUrl: null,
        }
      }

      return {
        memory,
        signedUrl: signedData?.signedUrl ?? null,
      }
    })
  )

  return (
    <main className="mx-auto w-full max-w-casa min-h-[100dvh] bg-casa-cream flex flex-col">
      <SimpleHeader back={{ href: '/auth/domus', label: 'Torna alla Domus' }} />

      <section className="px-10 pt-8 pb-6">
        <h1 className="font-serif text-h2 text-casa-dark">I vostri ricordi</h1>

        <p className="mt-2 font-body text-small text-casa-mid italic leading-[1.8]">
          Ogni momento custodito nella tua Domus.
        </p>
      </section>

      {memoriesError && (
        <div className="px-10 mb-6">
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[6px]">
            <p className="font-body text-small text-red-700">
              Non è stato possibile caricare i ricordi.
            </p>
          </div>
        </div>
      )}

      {!memoriesError && !hasMemories && (
        <section className="flex-1 flex flex-col items-center justify-center px-10 text-center">
          <div
            className="w-[76px] h-[76px] rounded-full flex items-center justify-center mb-8 text-casa-gold"
            style={{ background: 'rgba(168,128,48,0.1)' }}
          >
            ✦
          </div>

          <h2 className="font-serif text-[22px] text-casa-dark">
            Nessun ricordo ancora custodito
          </h2>

          <p className="mt-4 font-body text-small text-casa-mid italic leading-[1.9] max-w-[260px]">
            Il primo ricordo aspetta solo di entrare nella vostra storia.
          </p>

          <Link
            href="/auth/domus/primo-ricordo"
            className="mt-10 inline-flex items-center justify-center font-body text-[15px] font-medium tracking-wide text-casa-cream bg-casa-gold hover:bg-casa-gold-dark rounded-button px-10 py-[14px] transition-colors duration-200"
          >
            Crea il primo ricordo
          </Link>
        </section>
      )}

      {!memoriesError && hasMemories && (
        <section className="px-10 pb-10">
          <div className="grid grid-cols-2 gap-3 mb-8">
            {memoryCards.map(({ memory, signedUrl }) => (
              <article
                key={memory.id}
                className="rounded-[10px] overflow-hidden bg-white/40 border border-casa-border"
              >
                <div
                  className="relative overflow-hidden bg-casa-gold-light"
                  style={{ aspectRatio: '0.82' }}
                >
                  <MemoryPreview memory={memory} fileUrl={signedUrl} />
                </div>

                <div className="p-3">
                  <p className="font-body text-[14px] text-casa-dark leading-[1.35] truncate">
                    {memory.title}
                  </p>

                  <p className="mt-1 font-ui text-[10px] tracking-[0.06em] uppercase text-casa-light">
                    {getTypeLabel(memory.memory_type)} ·{' '}
                    {formatDate(memory.date_of_memory ?? memory.created_at)}
                  </p>
                </div>
              </article>
            ))}

            <Link
              href="/auth/domus/primo-ricordo"
              className="border border-dashed border-casa-border rounded-[10px] flex flex-col items-center justify-center gap-2 hover:border-casa-gold transition-colors duration-200"
              style={{ aspectRatio: '0.82' }}
            >
              <span className="text-[32px] text-casa-light">+</span>
              <span className="font-body text-[12px] text-casa-light tracking-[0.04em]">
                Aggiungi ricordo
              </span>
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
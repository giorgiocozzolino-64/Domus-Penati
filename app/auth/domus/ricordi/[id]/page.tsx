/**
 * SCHERMATA 7 – DETTAGLIO RICORDO
 */

import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SimpleHeader } from '@/components/ui'

type PageProps = {
  params: Promise<{
    id: string
  }>
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

function formatFileSize(size: number | null) {
  if (!size) return null

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function MemoryMedia({
  memory,
  file,
  signedUrl,
}: {
  memory: Memory
  file: MemoryFile | null
  signedUrl: string | null
}) {
  const type = file?.file_type ?? memory.memory_type ?? 'story'
  const mimeType = file?.mime_type ?? ''

  if (!file || !signedUrl) {
    return (
      <div className="w-full rounded-[14px] bg-casa-gold-light border border-casa-border flex items-center justify-center py-24 text-casa-gold">
        <span className="font-serif text-[48px]">✦</span>
      </div>
    )
  }

  if (type === 'photo') {
    return (
      <img
        src={signedUrl}
        alt={memory.title}
        className="w-full rounded-[14px] object-cover border border-casa-border"
      />
    )
  }

  if (type === 'video') {
    return (
      <video
        src={signedUrl}
        controls
        playsInline
        className="w-full rounded-[14px] border border-casa-border bg-black"
      />
    )
  }

  if (type === 'audio') {
    return (
      <div className="w-full rounded-[14px] bg-white/50 border border-casa-border p-6">
        <p className="font-serif text-[20px] text-casa-dark mb-4">
          Ascolta questo ricordo
        </p>

        <audio src={signedUrl} controls className="w-full" />
      </div>
    )
  }

  if (type === 'document' && mimeType === 'application/pdf') {
    return (
      <div className="w-full rounded-[14px] bg-white/50 border border-casa-border overflow-hidden">
        <iframe
          src={signedUrl}
          title={memory.title}
          className="w-full h-[520px]"
        />

        <div className="p-4 border-t border-casa-border">
          <a
            href={signedUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center font-body text-[14px] font-medium text-casa-cream bg-casa-gold hover:bg-casa-gold-dark rounded-button px-6 py-3 transition-colors duration-200"
          >
            Apri documento
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-[14px] bg-white/50 border border-casa-border p-8 text-center">
      <div
        className="mx-auto w-[76px] h-[76px] rounded-full flex items-center justify-center text-casa-gold mb-6"
        style={{ background: 'rgba(168,128,48,0.1)' }}
      >
        <span className="font-serif text-[36px]">□</span>
      </div>

      <h2 className="font-serif text-[22px] text-casa-dark">
        Documento custodito
      </h2>

      <p className="mt-3 font-body text-small text-casa-mid italic leading-[1.8]">
        Questo file è conservato nella tua Domus. Puoi aprirlo o scaricarlo.
      </p>

      <a
        href={signedUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center justify-center font-body text-[15px] font-medium tracking-wide text-casa-cream bg-casa-gold hover:bg-casa-gold-dark rounded-button px-8 py-[14px] transition-colors duration-200"
      >
        Apri documento
      </a>
    </div>
  )
}

export default async function MemoryDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: memoryData, error: memoryError } = await supabase
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
    .eq('id', id)
    .maybeSingle()

  if (memoryError) {
    console.error('Errore recupero dettaglio ricordo:', memoryError.message)
  }

  const memory = memoryData as Memory | null

  if (!memory) {
    notFound()
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .eq('family_id', memory.family_id)
    .eq('status', 'active')
    .maybeSingle()

  if (membershipError) {
    console.error('Errore verifica membership:', membershipError.message)
  }

  if (!membershipData) {
    redirect('/auth/domus')
  }

  const firstFile = memory.memory_files?.[0] ?? null

  let signedUrl: string | null = null

  if (firstFile?.file_url) {
    const { data: signedData, error: signedError } = await supabase.storage
      .from('memories')
      .createSignedUrl(firstFile.file_url, 60 * 60)

    if (signedError) {
      console.error('Errore signed URL dettaglio:', signedError.message)
    }

    signedUrl = signedData?.signedUrl ?? null
  }

  const fileSize = formatFileSize(firstFile?.file_size ?? null)

  return (
    <main className="mx-auto w-full max-w-casa min-h-[100dvh] bg-casa-cream flex flex-col">
      <SimpleHeader back={{ href: '/auth/domus/ricordi', label: 'Torna ai ricordi' }} />

      <section className="px-6 pt-6 pb-10">
        <MemoryMedia memory={memory} file={firstFile} signedUrl={signedUrl} />

        <div className="px-4 pt-8">
          <p className="font-ui text-[11px] tracking-[0.08em] uppercase text-casa-gold mb-3">
            {getTypeLabel(firstFile?.file_type ?? memory.memory_type)}
          </p>

          <h1 className="font-serif text-[28px] leading-[1.2] text-casa-dark">
            {memory.title}
          </h1>

          <p className="mt-3 font-body text-small text-casa-light">
            {formatDate(memory.date_of_memory ?? memory.created_at)}
            {fileSize ? ` · ${fileSize}` : ''}
          </p>

          {memory.description ? (
            <p className="mt-8 font-body text-[15px] leading-[1.9] text-casa-mid">
              {memory.description}
            </p>
          ) : (
            <p className="mt-8 font-body text-[15px] leading-[1.9] text-casa-mid italic">
              Questo ricordo è custodito nella tua Domus. Presto potrai
              aggiungere descrizioni, persone presenti, luoghi e racconti.
            </p>
          )}

          <div className="mt-8">
            <Link
              href={`/auth/domus/ricordi/${memory.id}/edit`}
              className="inline-flex w-full items-center justify-center font-body text-[15px] font-medium tracking-wide text-casa-cream bg-casa-gold hover:bg-casa-gold-dark rounded-button px-6 py-[14px] transition-colors duration-200"
            >
              Modifica ricordo
            </Link>
          </div>

          <div className="mt-10 border-t border-casa-border pt-6">
            <p className="font-serif text-[18px] text-casa-dark">
              Prossimi dettagli
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-[10px] bg-white/40 border border-casa-border px-4 py-3">
                <p className="font-ui text-[10px] tracking-[0.08em] uppercase text-casa-light">
                  Persone presenti
                </p>
                <p className="mt-1 font-body text-[14px] text-casa-mid italic">
                  Da aggiungere
                </p>
              </div>

              <div className="rounded-[10px] bg-white/40 border border-casa-border px-4 py-3">
                <p className="font-ui text-[10px] tracking-[0.08em] uppercase text-casa-light">
                  Luogo
                </p>
                <p className="mt-1 font-body text-[14px] text-casa-mid italic">
                  Da aggiungere
                </p>
              </div>

              <div className="rounded-[10px] bg-white/40 border border-casa-border px-4 py-3">
                <p className="font-ui text-[10px] tracking-[0.08em] uppercase text-casa-light">
                  Storia collegata
                </p>
                <p className="mt-1 font-body text-[14px] text-casa-mid italic">
                  Da costruire nella timeline familiare
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/auth/domus/ricordi"
              className="inline-flex w-full items-center justify-center font-body text-[15px] font-medium tracking-wide text-casa-gold border border-casa-border hover:bg-casa-gold-light rounded-button px-6 py-[13px] transition-colors duration-200"
            >
              Torna alla galleria
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
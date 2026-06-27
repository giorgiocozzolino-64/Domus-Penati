'use client'

/**
 * SCHERMATA 5 – PRIMO RICORDO
 * "Di chi vuoi conservare il ricordo?"
 *
 * Client Component – gestisce upload file e registrazione video.
 */

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  ErrorMessage,
  PageShell,
  SimpleHeader,
} from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { copy } from '@/lib/copy'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export default function PrimoRicordoPage() {
  const c = copy.firstMemory
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadState('uploading')
    setErrorMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Upload del file su Supabase Storage
      const extension = file.name.split('.').pop()
      const filename = `${user.id}/${Date.now()}.${extension}`

      const { error: storageError } = await supabase.storage
        .from('memories')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (storageError) throw storageError

      // Determina il tipo di ricordo dal MIME type
      const type = file.type.startsWith('video/')    ? 'video'
                 : file.type.startsWith('audio/')    ? 'audio'
                 : file.type.startsWith('image/')    ? 'photo'
                 : 'document'

      // Recupera l'ID famiglia
      const { data: membership } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single()

      if (!membership?.family_id) throw new Error('Famiglia non trovata')

      // Salva il ricordo nel database
      const { error: dbError } = await supabase
        .from('memories')
        .insert({
          family_id:    membership.family_id,
          title:        file.name.replace(/\.[^/.]+$/, ''),
          type,
          storage_path: filename,
          created_by:   user.id,
        })

      if (dbError) throw dbError

      setUploadState('success')
      // Piccolo delay prima del redirect per permettere all'utente di vedere il successo
      setTimeout(() => router.push('/domus/ricordi'), 800)

    } catch (err) {
      console.error('Errore upload:', err)
      setUploadState('error')
      setErrorMessage(c.errors.upload)
    }
  }

  function handleRecordClick() {
    // TODO: implementare registrazione video nativa
    // Per MVP, apre il file picker con filtro video
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'video/*'
      fileInputRef.current.capture = 'user'
      fileInputRef.current.click()
    }
  }

  function handleUploadClick() {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'video/*,audio/*,image/*,.pdf,.doc,.docx,.txt'
      fileInputRef.current.removeAttribute('capture')
      fileInputRef.current.click()
    }
  }

  const isUploading = uploadState === 'uploading'

  return (
    <PageShell>
      <SimpleHeader back={{ href: '/domus', label: c.back }} />

      {/* Input file nascosto */}
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        onChange={handleFileUpload}
        aria-hidden="true"
      />

      {/* Contenuto centrato */}
      <div className="flex-1 flex flex-col items-center justify-center px-11 pb-8 text-center">

        {/* Domanda – il cuore della schermata */}
        <h1 className="font-serif text-[22px] font-normal italic text-casa-dark leading-[1.4] max-w-[280px]">
          {c.title.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>

        <p className="mt-4 mb-14 font-body text-small text-casa-light leading-[1.9] max-w-[220px]">
          {c.subtitle}
        </p>

        {/* Pulsante di registrazione */}
        <button
          type="button"
          onClick={handleRecordClick}
          disabled={isUploading}
          aria-label={c.record.label}
          className={`
            w-[148px] h-[148px] rounded-full flex flex-col items-center justify-center gap-[10px]
            border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casa-gold
            ${isUploading
              ? 'opacity-50 cursor-not-allowed border-casa-border bg-casa-gold-light'
              : 'border-casa-border bg-casa-gold-light hover:bg-casa-gold hover:border-casa-gold cursor-pointer group'
            }
          `}
          style={{ borderWidth: '1.5px' }}
        >
          {isUploading ? (
            <div className="w-8 h-8 border-2 border-casa-gold border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg
                width="42"
                height="42"
                viewBox="0 0 28 28"
                fill="none"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-casa-gold group-hover:text-white transition-colors duration-300"
                stroke="currentColor"
              >
                <rect x="1" y="7" width="18" height="14" rx="2" />
                <path d="M19 11l8-4v14l-8-4" />
              </svg>
              <span className="font-ui text-[11px] tracking-[0.06em] uppercase text-casa-gold group-hover:text-white transition-colors duration-300">
                {c.record.label}
              </span>
            </>
          )}
        </button>

        <p className="mt-2 mb-11 font-ui text-[11px] text-casa-light tracking-[0.04em]">
          {c.record.note}
        </p>

        {/* Divisore */}
        <div className="w-full flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-casa-border" />
          <span className="font-body text-[12px] text-casa-light">{c.or}</span>
          <div className="flex-1 h-px bg-casa-border" />
        </div>

        {/* Upload alternativo */}
        <div className="w-full max-w-[300px]">
          <Button
            variant="quiet"
            fullWidth
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {c.upload}
          </Button>
        </div>

        {/* Errore */}
        {uploadState === 'error' && errorMessage && (
          <div className="mt-6 w-full max-w-[300px]">
            <ErrorMessage message={errorMessage} />
          </div>
        )}
      </div>
    </PageShell>
  )
}

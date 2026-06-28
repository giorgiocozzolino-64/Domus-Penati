import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SimpleHeader } from '@/components/ui'

type PageProps = {
  params: Promise<{
    id: string
  }>
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
}

async function updateMemory(formData: FormData) {
  'use server'

  const supabase = await createClient()

  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const dateOfMemory = String(formData.get('date_of_memory') ?? '')
  const memoryType = String(formData.get('memory_type') ?? 'memory')
  const visibility = String(formData.get('visibility') ?? 'private')

  if (!id || !title) {
    return
  }

   const { error } = await (supabase as any)
  .from('memories')
  .update({
      title,
      description: description || null,
      date_of_memory: dateOfMemory || null,
      memory_type: memoryType || null,
      visibility,
    })
    .eq('id', id)

  if (error) {
    console.error('Errore aggiornamento ricordo:', error.message)
    return
  }

  redirect(`/auth/domus/ricordi/${id}`)
}

export default async function EditMemoryPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: memory, error } = await supabase
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
      created_at
    `
    )
    .eq('id', id)
    .single<Memory>()

  if (error || !memory) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <SimpleHeader />

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-3">
          <Link
            href={`/auth/domus/ricordi/${memory.id}`}
            className="text-sm text-amber-300 hover:text-amber-200"
          >
            ← Torna al ricordo
          </Link>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
              Domus Penati
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-50">
              Modifica ricordo
            </h1>
            <p className="mt-3 text-stone-400">
              Aggiorna le informazioni che trasformano questo file in una
              memoria familiare.
            </p>
          </div>
        </div>

        <form
          action={updateMemory}
          className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl"
        >
          <input type="hidden" name="id" value={memory.id} />

          <div className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-stone-300">
                Titolo
              </span>
              <input
                name="title"
                type="text"
                required
                defaultValue={memory.title}
                className="rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-stone-300">
                Descrizione
              </span>
              <textarea
                name="description"
                rows={6}
                defaultValue={memory.description ?? ''}
                className="rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-stone-300">
                  Data
                </span>
                <input
                  name="date_of_memory"
                  type="date"
                  defaultValue={memory.date_of_memory ?? ''}
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-stone-300">
                  Tipo
                </span>
                <select
                  name="memory_type"
                  defaultValue={memory.memory_type ?? 'memory'}
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"
                >
                  <option value="memory">Ricordo</option>
                  <option value="photo">Foto</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Documento</option>
                  <option value="recipe">Ricetta</option>
                  <option value="letter">Lettera</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-stone-300">
                  Visibilità
                </span>
                <select
                  name="visibility"
                  defaultValue={memory.visibility ?? 'private'}
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-amber-400"
                >
                  <option value="private">Privato</option>
                  <option value="family">Famiglia</option>
                  <option value="public">Pubblico</option>
                </select>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <Link
                href={`/auth/domus/ricordi/${memory.id}`}
                className="rounded-2xl border border-stone-700 px-6 py-3 text-center text-stone-300 hover:border-stone-500 hover:text-stone-100"
              >
                Annulla
              </Link>

              <button
                type="submit"
                className="rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-stone-950 hover:bg-amber-400"
              >
                Salva modifiche
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
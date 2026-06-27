/**
 * SCHERMATA 4 – BENVENUTO NELLA DOMUS
 * La prima volta che l'utente entra nella propria casa.
 *
 * Server Component – recupera i dati della famiglia da Supabase.
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { copy } from '@/lib/copy'

async function getFamilyData(userId: string) {
  const supabase = await createClient()

  const { data: membership } = await supabase
    .from('family_members')
    .select('families(id, name)')
    .eq('user_id', userId)
    .limit(1)
    .single()

  return membership?.families as { id: string; name: string } | null
}

export default async function WelcomePage() {
  const c = copy.welcome
  const supabase = await createClient()

  // Verifica autenticazione
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Recupera dati famiglia
  const family = await getFamilyData(user.id)
  const familyName = family?.name ?? ''

  const greeting = familyName
    ? c.greeting(familyName)
    : c.greetingAlt

  return (
    <main className="mx-auto w-full max-w-casa min-h-[100dvh] bg-casa-cream flex flex-col">
      {/* Contenuto centrato verticalmente */}
      <section className="flex-1 flex flex-col items-center justify-center px-11 pt-16 pb-12 text-center">

        {/* Icona casa – soglia della Domus */}
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-11"
          style={{ background: 'rgba(168,128,48,0.12)' }}
          aria-hidden="true"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 28 28"
            fill="none"
            stroke="#A88030"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12l12-9 12 9" />
            <rect x="6" y="12" width="16" height="13" rx="1" />
            <rect x="11" y="17" width="6" height="8" />
          </svg>
        </div>

        {/* Saluto della casa */}
        <h1 className="font-serif text-title text-casa-dark">
          {greeting}
        </h1>

        {/* Titolo */}
        <p className="mt-2 font-serif text-[18px] text-casa-dark font-normal italic">
          {c.title}
        </p>

        {/* Sottotitolo */}
        <p className="mt-4 font-body text-small text-casa-mid leading-[1.9] max-w-[290px]">
          {c.subtitle.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </p>

        {/* Nota stato vuoto */}
        <p className="mt-8 font-body text-[13px] text-casa-light italic">
          {c.empty.note}
        </p>
      </section>

      {/* Azioni in basso */}
      <div className="px-10 pb-14 flex flex-col gap-3 flex-shrink-0">
        <Link
          href="/domus/primo-ricordo"
          className="flex items-center justify-center w-full font-body text-[15px] font-medium tracking-wide text-casa-cream bg-casa-gold hover:bg-casa-gold-dark rounded-button px-6 py-[14px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casa-gold focus-visible:ring-offset-2"
        >
          {c.cta}
        </Link>

        <Link
          href="/domus/invita"
          className="flex items-center justify-center w-full font-body text-[15px] font-medium tracking-wide text-casa-gold border border-casa-border hover:bg-casa-gold-light rounded-button px-6 py-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casa-gold focus-visible:ring-offset-2"
        >
          {c.secondaryCta}
        </Link>
      </div>
    </main>
  )
}

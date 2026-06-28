/**
 * SCHERMATA 4 – BENVENUTO NELLA DOMUS
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { copy } from '@/lib/copy'

type FamilyData = {
  id: string
  family_name: string
  slug: string | null
}

type MembershipData = {
  family_id: string | null
}

async function getFamilyData(userId: string): Promise<FamilyData | null> {
  const supabase = await createClient()

  const { data: membershipData, error: membershipError } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (membershipError) {
    console.error('Errore recupero membership:', membershipError.message)
    return null
  }

  const membership = membershipData as MembershipData | null

  if (!membership?.family_id) {
    return null
  }

  const { data: familyData, error: familyError } = await supabase
    .from('families')
    .select('id, family_name, slug')
    .eq('id', membership.family_id)
    .maybeSingle()

  if (familyError) {
    console.error('Errore recupero famiglia:', familyError.message)
    return null
  }

  return familyData as FamilyData | null
}

export default async function WelcomePage() {
  const c = copy.welcome
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const family = await getFamilyData(user.id)
  const familyName = family?.family_name ?? ''

  const greeting = familyName ? c.greeting(familyName) : c.greetingAlt

  return (
    <main className="mx-auto w-full max-w-casa min-h-[100dvh] bg-casa-cream flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-11 pt-16 pb-12 text-center">
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

        <h1 className="font-serif text-title text-casa-dark">{greeting}</h1>

        <p className="mt-2 font-serif text-[18px] text-casa-dark font-normal italic">
          {c.title}
        </p>

        <p className="mt-4 font-body text-small text-casa-mid leading-[1.9] max-w-[290px]">
          {c.subtitle.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>

        <p className="mt-8 font-body text-[13px] text-casa-light italic">
          {c.empty.note}
        </p>
      </section>

      <div className="px-10 pb-14 flex flex-col gap-3 flex-shrink-0">
        <Link
          href="/auth/domus/primo-ricordo"
          className="flex items-center justify-center w-full font-body text-[15px] font-medium tracking-wide text-casa-cream bg-casa-gold hover:bg-casa-gold-dark rounded-button px-6 py-[14px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casa-gold focus-visible:ring-offset-2"
        >
          {c.cta}
        </Link>

        <Link
          href="/auth/domus/invita"
          className="flex items-center justify-center w-full font-body text-[15px] font-medium tracking-wide text-casa-gold border border-casa-border hover:bg-casa-gold-light rounded-button px-6 py-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casa-gold focus-visible:ring-offset-2"
        >
          {c.secondaryCta}
        </Link>
      </div>
    </main>
  )
}
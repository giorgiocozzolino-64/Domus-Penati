'use client'

/**
 * SCHERMATA 7 – INVITA UN FAMILIARE
 * "Porta qualcuno che ami nella Domus."
 *
 * Client Component – form di invito con stato di successo.
 */

import { useState, FormEvent } from 'react'
import {
  Button,
  FormField,
  Input,
  Select,
  ErrorMessage,
  SuccessMessage,
  PageShell,
  SimpleHeader,
} from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { copy } from '@/lib/copy'

interface FormState {
  email: string
  role:  string
}

interface FormErrors {
  email?:  string
  role?:   string
  server?: string
}

export default function InvitaPage() {
  const c = copy.invite
  const supabase = createClient()

  const [form, setForm] = useState<FormState>({ email: '', role: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const validationErrors: FormErrors = {}
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      validationErrors.email = c.errors.email
    if (!form.role)
      validationErrors.role = c.errors.role

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Recupera ID famiglia
      const { data: membership } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single()

      if (!membership?.family_id) throw new Error('Famiglia non trovata')

      // Calcola scadenza invito (7 giorni)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      // Mappa il ruolo al tipo database
      const roleMap: Record<string, string> = {
        'Familiare':          'family',
        'Genitore':           'parent',
        'Figlio / Figlia':    'child',
        'Nonno / Nonna':      'grandparent',
        'Fratello / Sorella': 'sibling',
        'Coniuge':            'spouse',
        'Altro':              'family',
      }

      const { error } = await supabase
        .from('invitations')
        .insert({
          family_id:   membership.family_id,
          email:       form.email.toLowerCase().trim(),
          role:        (roleMap[form.role] ?? 'family') as 'family' | 'parent' | 'child' | 'grandparent' | 'sibling' | 'spouse',
          invited_by:  user.id,
          expires_at:  expiresAt.toISOString(),
        })

      if (error) throw error

      // TODO: inviare email di invito via Supabase Edge Function
      //   supabase.functions.invoke('send-invitation-email', { body: { email, familyId } })

      setSent(true)
      setForm({ email: '', role: '' })

    } catch (err) {
      console.error('Errore invito:', err)
      setErrors({ server: c.errors.generic })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <SimpleHeader back={{ href: '/domus', label: c.back }} />

      <div className="flex-1 flex flex-col px-10 pt-10 pb-12 overflow-y-auto">

        {/* Intestazione */}
        <h1 className="font-serif text-h2 text-casa-dark leading-[1.15]">
          {c.title.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>
        <p className="mt-3 mb-12 font-body text-small text-casa-mid italic leading-[1.9]">
          {c.subtitle}
        </p>

        {/* Successo */}
        {sent && (
          <div className="mb-8">
            <SuccessMessage message={c.success} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField label={c.fields.email.label}>
            <Input
              type="email"
              placeholder={c.fields.email.placeholder}
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
              autoCapitalize="none"
              inputMode="email"
            />
          </FormField>

          <FormField label={c.fields.role.label}>
            <Select
              options={c.roles}
              value={form.role}
              onChange={handleChange('role')}
              error={errors.role}
              placeholder={c.fields.role.placeholder}
            />
          </FormField>

          {errors.server && (
            <div className="mb-6">
              <ErrorMessage message={errors.server} />
            </div>
          )}

          <div className="flex-1" />

          <div className="mt-8">
            <Button type="submit" fullWidth loading={loading}>
              {c.cta}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  )
}

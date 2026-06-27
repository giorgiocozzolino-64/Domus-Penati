'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/ui/FormField'

import { registerFamily } from '@/lib/actions/auth'
import {
  validateRegister,
  hasErrors,
  type RegisterValues,
  type RegisterFieldErrors,
} from '@/lib/validations/register'
import { copy } from '@/lib/copy'

const c = copy.register

const INITIAL_VALUES: RegisterValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  familyName: '',
}

export default function RegisterPage() {
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(field: keyof RegisterValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))

      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }

      if (serverError) setServerError(null)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)

    const errors = validateRegister(values)

    if (hasErrors(errors)) {
      setFieldErrors(errors)
      const firstError = Object.keys(errors)[0] as keyof RegisterValues
      document.getElementById(firstError)?.focus()
      return
    }

    setFieldErrors({})

    startTransition(async () => {
      const result = await registerFamily({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        familyName: values.familyName.trim(),
      })

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors as RegisterFieldErrors)
        } else {
          setServerError(result.error ?? c.errors.generic)
        }
        return
      }

      window.location.assign('/domus')
    })
  }

  return (
    <main className="min-h-screen bg-casa-cream text-casa-dark">
      <section className="mx-auto flex min-h-screen w-full max-w-casa flex-col justify-center py-12">
        <div className="px-10 pb-10">
          <p className="font-ui text-label uppercase text-casa-gold mb-6">
            DOMUS PENATI
          </p>

          <h1 className="font-serif text-title mb-3">{c.title}</h1>

          <p className="font-body text-small text-casa-mid">{c.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label={c.title}
          className="flex flex-col flex-1 px-10"
        >
          <div className="grid grid-cols-2 gap-5 mb-8">
            <FormField label={c.fields.firstName.label}>
              <Input
                id="firstName"
                type="text"
                placeholder={c.fields.firstName.placeholder}
                value={values.firstName}
                onChange={handleChange('firstName')}
                error={fieldErrors.firstName}
                autoComplete="given-name"
                autoCapitalize="words"
                disabled={isPending}
              />
            </FormField>

            <FormField label={c.fields.lastName.label}>
              <Input
                id="lastName"
                type="text"
                placeholder={c.fields.lastName.placeholder}
                value={values.lastName}
                onChange={handleChange('lastName')}
                error={fieldErrors.lastName}
                autoComplete="family-name"
                autoCapitalize="words"
                disabled={isPending}
              />
            </FormField>
          </div>

          <FormField label={c.fields.email.label} className="mb-8">
            <Input
              id="email"
              type="email"
              placeholder={c.fields.email.placeholder}
              value={values.email}
              onChange={handleChange('email')}
              error={fieldErrors.email}
              autoComplete="email"
              autoCapitalize="none"
              inputMode="email"
              disabled={isPending}
            />
          </FormField>

          <FormField label={c.fields.password.label} className="mb-8">
            <Input
              id="password"
              type="password"
              placeholder={c.fields.password.placeholder}
              value={values.password}
              onChange={handleChange('password')}
              error={fieldErrors.password}
              autoComplete="new-password"
              disabled={isPending}
            />
          </FormField>

          <div className="border-t border-casa-border mb-8" aria-hidden="true" />

          <FormField label={c.fields.familyName.label} className="mb-10">
            <Input
              id="familyName"
              type="text"
              placeholder={c.fields.familyName.placeholder}
              value={values.familyName}
              onChange={handleChange('familyName')}
              error={fieldErrors.familyName}
              autoCapitalize="words"
              disabled={isPending}
            />
          </FormField>

          {serverError && (
            <p role="alert" className="mb-6 font-body text-[14px] text-red-600">
              {serverError}
            </p>
          )}

          <Button type="submit" fullWidth isLoading={isPending} className="mb-6">
            {c.cta}
          </Button>

          <p className="pb-12 text-center font-body text-[14px] text-casa-light">
            <Link
              href="/login"
              className="border-b border-casa-border pb-px text-casa-mid hover:text-casa-dark hover:border-casa-mid transition-colors duration-200"
            >
              {c.loginLink}
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
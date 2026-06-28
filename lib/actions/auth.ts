'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type RegisterFamilyInput = {
  firstName: string
  lastName: string
  email: string
  password: string
  familyName: string
}

export async function registerFamily(data: RegisterFamilyInput) {
  const supabase = await createClient()
  const db = supabase as any

  const firstName = data.firstName?.trim()
  const lastName = data.lastName?.trim()
  const email = data.email?.trim().toLowerCase()
  const password = data.password
  const familyName = data.familyName?.trim()

  if (!firstName || !lastName || !email || !password || !familyName) {
    return {
      success: false,
      error: 'Compila tutti i campi obbligatori.',
      fieldErrors: null,
    }
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      },
    },
  })

  if (signUpError || !authData.user) {
    return {
      success: false,
      error: `Errore registrazione utente: ${
        signUpError?.message ?? 'utente non creato'
      }`,
      fieldErrors: null,
    }
  }

  const userId = authData.user.id

  const { data: family, error: familyError } = await db
    .from('families')
    .insert({
      name: familyName,
      created_by: userId,
    })
    .select('id, name')
    .single()

  if (familyError || !family?.id) {
    return {
      success: false,
      error: `Errore creazione famiglia: ${
        familyError?.message ?? 'famiglia non creata'
      }`,
      fieldErrors: null,
    }
  }

  const { error: memberError } = await db.from('family_members').insert({
    family_id: family.id,
    user_id: userId,
    role: 'owner',
  })

  if (memberError) {
    return {
      success: false,
      error: `Errore creazione membro famiglia: ${memberError.message}`,
      fieldErrors: null,
    }
  }

  redirect('/auth/domus')
}

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient()

  const email = data.email?.trim().toLowerCase()
  const password = data.password

  if (!email || !password) {
    return {
      success: false,
      error: 'Inserisci email e password.',
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  redirect('/auth/domus')
}
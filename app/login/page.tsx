'use client'

import { FormEvent } from 'react'

export default function LoginPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('CLICK LOGIN OK')
    window.location.assign('/domus')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-casa-night">
      <form
        onSubmit={handleSubmit}
        className="w-[360px] bg-casa-cream p-10 flex flex-col gap-6"
      >
        <h1 className="font-serif text-title text-casa-dark">
          Accedi alla tua Domus
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3"
        />

        <button
          type="submit"
          className="rounded-button bg-casa-gold px-8 py-3 text-casa-cream"
        >
          Accedi
        </button>
      </form>
    </main>
  )
}
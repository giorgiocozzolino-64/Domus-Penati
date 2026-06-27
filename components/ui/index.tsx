'use client'

/**
 * DOMUS PENATI – Componenti UI condivisi
 *
 * Tutti i componenti sono in un solo file per semplicità MVP.
 * Separare in file individuali quando la codebase cresce.
 */

import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  forwardRef,
  ReactNode,
} from 'react'
import Link from 'next/link'

// ─── UTILITÀ ────────────────────────────────────────────────

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}


// ─── BUTTON ─────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'quiet' | 'ghost'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth = false, loading = false, className, children, disabled, ...props }, ref) => {
    const base = [
      'inline-flex items-center justify-center',
      'font-body text-[15px] font-medium tracking-wide',
      'rounded-button transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casa-gold focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'cursor-pointer',
    ]

    const variants = {
      primary: 'px-10 py-[14px] bg-casa-gold text-casa-cream hover:bg-casa-gold-dark active:bg-casa-gold-dark',
      quiet:   'px-10 py-[13px] bg-transparent text-casa-gold border border-casa-border hover:bg-casa-gold-light active:bg-casa-gold-light',
      ghost:   'px-0 py-0 bg-transparent text-casa-mid hover:text-casa-dark',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(...base, variants[variant], fullWidth ? 'w-full px-6' : '', className)}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Un momento...
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'


// ─── INPUT ──────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          'casa-input-line',
          error ? 'border-b-red-400' : 'border-b-casa-border',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 font-ui text-[12px] text-red-500">{error}</p>
      )}
    </div>
  )
)
Input.displayName = 'Input'


// ─── SELECT ─────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  options: readonly string[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          'casa-input-line cursor-pointer',
          error ? 'border-b-red-400' : 'border-b-casa-border',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && (
        <p className="mt-2 font-ui text-[12px] text-red-500">{error}</p>
      )}
    </div>
  )
)
Select.displayName = 'Select'


// ─── FORM FIELD ─────────────────────────────────────────────

interface FormFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn('mb-8', className)}>
      <label className="block mb-[10px] font-ui text-label text-casa-light tracking-widest uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}


// ─── BACK BUTTON ────────────────────────────────────────────

interface BackButtonProps {
  href?: string
  onClick?: () => void
  label?: string
}

export function BackButton({ href, onClick, label = 'Torna indietro' }: BackButtonProps) {
  const cls = 'inline-flex items-center gap-[6px] font-ui text-caption text-casa-light tracking-widest uppercase cursor-pointer hover:text-casa-mid transition-colors duration-200'

  if (href) {
    return (
      <Link href={href} className={cls}>
        <span className="text-[15px]">←</span>
        {label}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      <span className="text-[15px]">←</span>
      {label}
    </button>
  )
}


// ─── ERROR MESSAGE ───────────────────────────────────────────

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-button">
      <p className="font-body text-small text-red-700">{message}</p>
    </div>
  )
}


// ─── SUCCESS MESSAGE ─────────────────────────────────────────

export function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="w-full px-4 py-3 bg-casa-gold-light border border-casa-border rounded-button">
      <p className="font-body text-small text-casa-gold-dark">{message}</p>
    </div>
  )
}


// ─── LOADING STATO ───────────────────────────────────────────

export function PageLoader({ message = 'Un momento...' }: { message?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-casa-border border-t-casa-gold rounded-full animate-spin" />
      <p className="font-body text-small text-casa-light italic">{message}</p>
    </div>
  )
}


// ─── LOGO ────────────────────────────────────────────────────

export function Logo({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-casa-gold rounded-[5px] flex items-center justify-center flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <span className={cn(
        'font-ui text-[13px] font-semibold tracking-[0.12em] uppercase',
        variant === 'light' ? 'text-casa-cream' : 'text-casa-dark'
      )}>
        Domus Penati
      </span>
    </div>
  )
}


// ─── PAGE SHELL ─────────────────────────────────────────────

interface PageShellProps {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('casa-shell', className)}>
      {children}
    </div>
  )
}


// ─── HEADER SEMPLICE (per pagine interne) ────────────────────

interface SimpleHeaderProps {
  back?: { href?: string; onClick?: () => void; label?: string }
  logo?: boolean
}

export function SimpleHeader({ back, logo }: SimpleHeaderProps) {
  return (
    <header className="flex items-center justify-between px-10 pt-12 pb-0 flex-shrink-0">
      {back ? (
        <BackButton href={back.href} onClick={back.onClick} label={back.label} />
      ) : <div />}
      {logo && <Logo />}
    </header>
  )
}

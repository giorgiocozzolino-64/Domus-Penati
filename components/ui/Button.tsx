import * as React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
  isLoading?: boolean
  loading?: boolean
  variant?: 'primary' | 'quiet'
}

export function Button({
  children,
  className,
  fullWidth,
  isLoading,
  loading,
  disabled,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const busy = isLoading || loading

  const base =
    'rounded-button px-8 py-3 transition-colors disabled:opacity-60'

  const styles =
    variant === 'quiet'
      ? 'border border-casa-border text-casa-gold bg-transparent hover:bg-casa-gold-light'
      : 'bg-casa-gold text-casa-cream hover:bg-casa-gold-dark'

  return (
    <button
      {...props}
      disabled={disabled || busy}
      className={`${base} ${styles} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
    >
      {busy ? 'Attendi...' : children}
    </button>
  )
}
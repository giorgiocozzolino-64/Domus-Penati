<button type="submit">
  Accedi
</button>

export function Button({
  children,
  className,
  fullWidth,
  isLoading,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  const busy = isLoading || loading

  return (
    <button
      {...props}
      disabled={disabled || busy}
      className={`${fullWidth ? 'w-full' : ''} rounded-button bg-casa-gold px-8 py-3 text-casa-cream disabled:opacity-60 ${
        className ?? ''
      }`}
    >
      {busy ? 'Attendi...' : children}
    </button>
  )
}
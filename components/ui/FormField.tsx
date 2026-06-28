import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm text-casa-mid">
        {label}
      </span>

      {children}
    </label>
  )
}
export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-casa-mid">{label}</span>
      {children}
    </label>
  )
}
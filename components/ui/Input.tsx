type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  withPasswordToggle?: boolean;
};

export function Input({
  className,
  error,
  withPasswordToggle,
  ...props
}: InputProps) {
  return (
    <div>
      <input
        {...props}
        className={`w-full border-b border-casa-border bg-transparent py-3 outline-none ${className ?? ""}`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
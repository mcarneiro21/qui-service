import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-on_surface_variant font-body">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={[
            'w-full rounded-xl bg-surface_container_low px-4 py-3',
            'text-on_surface font-body placeholder:text-on_surface_variant/50',
            'outline-none transition-colors duration-150',
            'focus:bg-surface_container_highest',
            error ? 'ring-2 ring-primary' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {error && (
          <span className="text-xs text-primary font-body">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

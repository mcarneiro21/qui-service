import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-on_surface_variant font-body">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={3}
          className={[
            'w-full rounded-xl bg-surface_container_low px-4 py-3',
            'text-on_surface font-body placeholder:text-on_surface_variant/50',
            'outline-none transition-colors duration-150 resize-none',
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

Textarea.displayName = 'Textarea'

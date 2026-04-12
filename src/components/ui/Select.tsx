import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-on_surface_variant font-body">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={[
            'w-full rounded-xl bg-surface_container_low px-4 py-3',
            'text-on_surface font-body',
            'outline-none transition-colors duration-150 cursor-pointer',
            'focus:bg-surface_container_highest',
            error ? 'ring-2 ring-primary' : '',
            className,
          ].join(' ')}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-primary font-body">{error}</span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

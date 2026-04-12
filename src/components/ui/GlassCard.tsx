import { HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={[
        'bg-white/80 backdrop-blur-[20px] rounded-2xl',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

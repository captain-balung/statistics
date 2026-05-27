'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const styles: Record<Variant, string> = {
  primary:
    'bg-accent-blue text-white hover:opacity-90 border border-accent-blue',
  secondary:
    'bg-[var(--color-bg-elevated)] text-ink border border-[var(--color-rule)] hover:border-accent-blue',
  danger:
    'bg-accent-red text-white hover:opacity-90 border border-accent-red',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-sm px-3 py-2 text-sm font-medium transition-[opacity,border-color] duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(29,78,137,0.35)] ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

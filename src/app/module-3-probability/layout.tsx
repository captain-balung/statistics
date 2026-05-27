'use client'

import { ModuleHeader } from '@/components/layout/ModuleHeader'
import { usePathname } from 'next/navigation'

const LABS = [
  { href: '/module-3-probability/gamble', label: '賭博模擬' },
  { href: '/module-3-probability/binomial', label: '二項式' },
  { href: '/module-3-probability/lln', label: '大數法則' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen">
      <ModuleHeader moduleTitle="模組 3：機率" labs={LABS.map((l) => ({ ...l, active: pathname === l.href }))} />
      {children}
    </div>
  )
}

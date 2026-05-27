'use client'

import { ModuleHeader } from '@/components/layout/ModuleHeader'
import { usePathname } from 'next/navigation'

const LABS = [
  { href: '/module-4-normal/curve', label: '常態曲線' },
  { href: '/module-4-normal/area', label: '面積機率' },
  { href: '/module-4-normal/clt', label: '中央極限定理' },
  { href: '/module-4-normal/z-pr', label: 'Z/PR 換算' },
]

export default function Module4Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen">
      <ModuleHeader moduleTitle="模組 4：常態分配" labs={LABS.map((l) => ({ ...l, active: pathname === l.href }))} />
      {children}
    </div>
  )
}

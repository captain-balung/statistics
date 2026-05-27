'use client'

import { ModuleHeader } from '@/components/layout/ModuleHeader'
import { usePathname } from 'next/navigation'

const LABS = [
  { href: '/module-7-hypothesis/intro', label: '總覽' },
  { href: '/module-7-hypothesis/sign', label: '符號檢定' },
  { href: '/module-7-hypothesis/z-test', label: 'Z 檢定' },
  { href: '/module-7-hypothesis/t-one', label: '單樣本 t' },
  { href: '/module-7-hypothesis/t-two', label: '獨立樣本 t' },
  { href: '/module-7-hypothesis/t-paired', label: '成對樣本 t' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen">
      <ModuleHeader moduleTitle="模組 7：假設檢定" labs={LABS.map((l) => ({ ...l, active: pathname === l.href }))} />
      {children}
    </div>
  )
}

'use client'

import { ModuleHeader } from '@/components/layout/ModuleHeader'
import { usePathname } from 'next/navigation'

const LABS = [
  { href: '/module-2-correlation/scatter', label: '散佈圖生成' },
  { href: '/module-2-correlation/drag-r', label: '拖曳相關' },
  { href: '/module-2-correlation/sse', label: '回歸誤差' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen">
      <ModuleHeader moduleTitle="模組 2：相關與回歸" labs={LABS.map((l) => ({ ...l, active: pathname === l.href }))} />
      {children}
    </div>
  )
}

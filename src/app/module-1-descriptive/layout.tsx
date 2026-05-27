'use client'

import { ModuleHeader } from '@/components/layout/ModuleHeader'
import { usePathname } from 'next/navigation'

const LABS = [
  { href: '/module-1-descriptive/data-lab', label: '資料點實驗室' },
  { href: '/module-1-descriptive/balance-beam', label: '平均數平衡木' },
  { href: '/module-1-descriptive/spread', label: '標準差伸縮' },
] as const

export default function Module1Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <ModuleHeader
        moduleTitle="模組 1：敘述統計量"
        labs={LABS.map((lab) => ({
          ...lab,
          active: pathname === lab.href,
        }))}
      />
      {children}
    </div>
  )
}

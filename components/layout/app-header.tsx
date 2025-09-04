"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Language } from "@/lib/translations"

interface AppHeaderProps {
  title: string
  language: Language
  onBack?: () => void
  showBack?: boolean
}

export function AppHeader({ title, language, onBack, showBack = true }: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-4">
        {showBack ? (
          <Button variant="ghost" size="sm" onClick={onBack || (() => window.history.back())} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div className="w-9" />
        )}

        <h1 className="font-semibold text-lg text-gray-900 text-center flex-1">{title}</h1>

        <div className="w-9" />
      </div>
    </header>
  )
}

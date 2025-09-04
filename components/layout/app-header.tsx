"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageToggler } from "@/components/ui/language-toggler"

interface AppHeaderProps {
  title: string
  onBack?: () => void
  showBack?: boolean
}

export function AppHeader({ title, onBack, showBack = true }: AppHeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-4">
        {showBack ? (
                  <Button variant="ghost" size="sm" onClick={onBack || (() => window.history.back())} className="p-2 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        ) : (
          <div className="w-9" />
        )}

        <h1 className="font-semibold text-lg text-foreground text-center flex-1">{title}</h1>

        <LanguageToggler />
      </div>
    </header>
  )
}

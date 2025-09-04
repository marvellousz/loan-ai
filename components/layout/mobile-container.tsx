import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileContainerProps {
  children: ReactNode
  className?: string
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return <div className={cn("min-h-screen bg-gray-50 max-w-md mx-auto relative", className)}>{children}</div>
}

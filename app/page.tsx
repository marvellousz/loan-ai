"use client"

import { useEffect, useState } from "react"
import { MockDB, type User } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { t, type Language } from "@/lib/translations"
import { Smartphone, Shield, Zap, Users } from "lucide-react"

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [language, setLanguage] = useState<Language>("hi")

  useEffect(() => {
    const user = MockDB.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setLanguage(user.preferredLanguage)
    }
  }, [])

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    if (currentUser) {
      const updatedUser = { ...currentUser, preferredLanguage: lang }
      MockDB.setCurrentUser(updatedUser)
      setCurrentUser(updatedUser)
    }
  }

  const startApplication = () => {
    window.location.href = "/onboarding"
  }

  const goToAdmin = () => {
    window.location.href = "/admin"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">LoanAI</span>
          </div>

          {/* Language Toggle */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => handleLanguageSelect("hi")}
              className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                language === "hi" ? "bg-card text-primary shadow-sm" : "text-secondary-foreground hover:text-foreground"
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => handleLanguageSelect("en")}
              className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                language === "en" ? "bg-card text-primary shadow-sm" : "text-secondary-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3 text-balance">{t("welcomeTitle", language)}</h1>

          <p className="text-lg text-secondary-foreground mb-8 text-pretty">{t("welcomeSubtitle", language)}</p>

          <Button
            onClick={startApplication}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
          >
            {t("startApplication", language)}
          </Button>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{language === "hi" ? "तुरंत अप्रूवल" : "Instant Approval"}</h3>
                <p className="text-sm text-secondary-foreground">
                  {language === "hi" ? "AI की मदद से 5 मिनट में" : "AI-powered in 5 minutes"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {language === "hi" ? "सुरक्षित प्रक्रिया" : "Secure Process"}
                </h3>
                <p className="text-sm text-secondary-foreground">
                  {language === "hi" ? "आपकी जानकारी पूरी तरह सुरक्षित" : "Your data is completely secure"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{language === "hi" ? "24/7 सहायता" : "24/7 Support"}</h3>
                <p className="text-sm text-secondary-foreground">
                  {language === "hi" ? "हमेशा आपकी मदद के लिए तैयार" : "Always ready to help you"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Access (Development) */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={goToAdmin}
            className="text-sm text-muted-foreground border-border bg-transparent"
          >
            {t("adminDashboard", language)}
          </Button>
        </div>
      </main>
    </div>
  )
}

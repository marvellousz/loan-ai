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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">LoanAI</span>
          </div>

          {/* Language Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleLanguageSelect("hi")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                language === "hi" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => handleLanguageSelect("en")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                language === "en" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
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
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3 text-balance">{t("welcomeTitle", language)}</h1>

          <p className="text-lg text-gray-600 mb-8 text-pretty">{t("welcomeSubtitle", language)}</p>

          <Button
            onClick={startApplication}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl"
          >
            {t("startApplication", language)}
          </Button>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{language === "hi" ? "तुरंत अप्रूवल" : "Instant Approval"}</h3>
                <p className="text-sm text-gray-600">
                  {language === "hi" ? "AI की मदद से 5 मिनट में" : "AI-powered in 5 minutes"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === "hi" ? "सुरक्षित प्रक्रिया" : "Secure Process"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "hi" ? "आपकी जानकारी पूरी तरह सुरक्षित" : "Your data is completely secure"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{language === "hi" ? "24/7 सहायता" : "24/7 Support"}</h3>
                <p className="text-sm text-gray-600">
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
            className="text-sm text-gray-500 border-gray-200 bg-transparent"
          >
            {t("adminDashboard", language)}
          </Button>
        </div>
      </main>
    </div>
  )
}

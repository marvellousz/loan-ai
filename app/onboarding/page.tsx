"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MockDB, type User as MockUser, type LoanApplication } from "@/lib/mock-data"
import { t, type Language } from "@/lib/translations"
import { MobileContainer } from "@/components/layout/mobile-container"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, MessageCircle, Phone, IndianRupee, Target } from "lucide-react"

type OnboardingStep = "welcome" | "chat" | "personal-info" | "loan-details" | "complete"

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>("welcome")
  const [language, setLanguage] = useState<Language>("hi")
  const [isListening, setIsListening] = useState(false)
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null)
  const [application, setApplication] = useState<Partial<LoanApplication>>({})

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    monthlyIncome: "",
    loanAmount: "",
    loanPurpose: "",
    loanTenure: "12",
  })

  useEffect(() => {
    const user = MockDB.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setLanguage(user.preferredLanguage)
      setStep("welcome")
    }
  }, [])

  

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    const user = MockDB.getCurrentUser()
    if (user) {
      const updatedUser = { ...user, preferredLanguage: lang }
      MockDB.setCurrentUser(updatedUser)
    }
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // In a real app, this would start/stop speech recognition
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const proceedToChat = () => {
    setStep("chat")
  }

  const proceedToPersonalInfo = () => {
    setStep("personal-info")
  }

  const proceedToLoanDetails = () => {
    if (!formData.name || !formData.phone || !formData.monthlyIncome) {
      alert(t("pleaseFillAllFields", language))
      return
    }
    setStep("loan-details")
  }

  const completeOnboarding = () => {
    if (!formData.loanAmount || !formData.loanPurpose) {
      alert(t("pleaseFillAllFields", language))
      return
    }

    // Create loan application
    const applicationId = MockDB.generateId()
    const newApplication: LoanApplication = {
      id: applicationId,
      userId: currentUser?.id || "",
      status: "pending",
      language,
      personalInfo: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        occupation: formData.occupation,
        monthlyIncome: Number.parseInt(formData.monthlyIncome),
      },
      documents: [],
      loanDetails: {
        amount: Number.parseInt(formData.loanAmount),
        purpose: formData.loanPurpose,
        tenure: Number.parseInt(formData.loanTenure),
      },
      chatHistory: [
        {
          id: MockDB.generateId(),
          message: t("chatWelcome", language),
          sender: "bot",
          timestamp: new Date(),
          language,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    MockDB.saveApplication(newApplication)

    // Update user with name and phone
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        phone: formData.phone,
      }
      MockDB.setCurrentUser(updatedUser)
    }

    // Redirect to document upload
    window.location.href = `/application/${applicationId}/documents`
  }

  const goBack = () => {
    switch (step) {
      case "chat":
        setStep("welcome")
        break
      case "personal-info":
        setStep("chat")
        break
      case "loan-details":
        setStep("personal-info")
        break
      default:
        window.location.href = "/"
    }
  }

  return (
    <MobileContainer>
      {step !== "language" && (
        <AppHeader
          title={
            step === "welcome"
              ? t("welcomeTitle", language)
              : step === "chat"
                ? t("chatAssistant", language)
                : step === "personal-info"
                  ? t("personalInformation", language)
                  : step === "loan-details"
                    ? t("loanDetails", language)
                    : ""
          }
          onBack={goBack}
        />
      )}

      <div className="p-4 space-y-6">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => handleLanguageSelect("hi")}
              className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                language === "hi" ? "bg-background text-primary shadow-sm" : "text-secondary-foreground hover:text-foreground"
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => handleLanguageSelect("en")}
              className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                language === "en" ? "bg-background text-primary shadow-sm" : "text-secondary-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Welcome Screen */}
        {step === "welcome" && (
          <div className="text-center space-y-8 pt-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-12 h-12 text-primary-foreground" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("welcomeTitle", language)}</h2>
              <p className="text-secondary-foreground text-lg">{t("chatWelcome", language)}</p>
            </div>

            <Button
              onClick={proceedToChat}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl cursor-pointer"
            >
              {language === "hi" ? "चैट शुरू करें" : "Start Chat"}
            </Button>
          </div>
        )}

        {/* Chat Interface */}
        {step === "chat" && (
          <div className="space-y-6">
            <Card className="bg-secondary border-primary">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{t("chatWelcome", language)}</p>
                    <p className="text-secondary-foreground mt-2 text-sm">
                      {t("chatInputHint", language)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Input placeholder={t("typeHere", language)} className="flex-1" />
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleVoice}
                className={`cursor-pointer ${isListening ? "bg-destructive hover:bg-destructive/90" : ""}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>

            <Button onClick={proceedToPersonalInfo} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 cursor-pointer">
              {t("fillInformation", language)}
            </Button>
          </div>
        )}

        {/* Personal Information */}
        {step === "personal-info" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t("fullName", language)}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("enterYourName", language)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t("mobileNumber", language)}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={t("tenDigitNumber", language)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">{t("occupation", language)}</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder={t("yourJob", language)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income" className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  {t("monthlyIncome", language)}
                </Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                  placeholder={t("amountInRupees", language)}
                />
              </div>
            </div>

            <Button onClick={proceedToLoanDetails} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 cursor-pointer">
              {t("next", language)}
            </Button>
          </div>
        )}

        {/* Loan Details */}
        {step === "loan-details" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  {t("loanAmount", language)}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                  placeholder={t("amountInRupees", language)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {t("loanPurpose", language)}
                </Label>
                <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange("loanPurpose", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPurpose", language)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">{t("personal", language)}</SelectItem>
                    <SelectItem value="business">{t("business", language)}</SelectItem>
                    <SelectItem value="education">{t("education", language)}</SelectItem>
                    <SelectItem value="medical">{t("medical", language)}</SelectItem>
                    <SelectItem value="home">{t("home", language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">{t("tenureMonths", language)}</Label>
                <Select value={formData.loanTenure} onValueChange={(value) => handleInputChange("loanTenure", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 {t("months", language)}</SelectItem>
                    <SelectItem value="12">12 {t("months", language)}</SelectItem>
                    <SelectItem value="18">18 {t("months", language)}</SelectItem>
                    <SelectItem value="24">24 {t("months", language)}</SelectItem>
                    <SelectItem value="36">36 {t("months", language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={completeOnboarding} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 cursor-pointer">
              {t("continue", language)}
            </Button>
          </div>
        )}
      </div>
    </MobileContainer>
  )
}

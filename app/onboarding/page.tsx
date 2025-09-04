"use client"

import { useState, useEffect } from "react"
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

type OnboardingStep = "language" | "welcome" | "chat" | "personal-info" | "loan-details" | "complete"

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>("language")
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

    // Create or update user
    const userId = MockDB.generateId()
    const user: MockUser = {
      id: userId,
      phone: "",
      preferredLanguage: lang,
      createdAt: new Date(),
    }

    MockDB.setCurrentUser(user)
    setCurrentUser(user)
    setStep("welcome")
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
      alert(language === "hi" ? "कृपया सभी फील्ड भरें" : "Please fill all fields")
      return
    }
    setStep("loan-details")
  }

  const completeOnboarding = () => {
    if (!formData.loanAmount || !formData.loanPurpose) {
      alert(language === "hi" ? "कृपया सभी फील्ड भरें" : "Please fill all fields")
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
      case "welcome":
        setStep("language")
        break
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
                ? language === "hi"
                  ? "चैट सहायता"
                  : "Chat Assistant"
                : step === "personal-info"
                  ? language === "hi"
                    ? "व्यक्तिगत जानकारी"
                    : "Personal Information"
                  : step === "loan-details"
                    ? language === "hi"
                      ? "लोन विवरण"
                      : "Loan Details"
                    : ""
          }
          language={language}
          onBack={goBack}
        />
      )}

      <div className="p-4 space-y-6">
        {/* Language Selection */}
        {step === "language" && (
          <div className="text-center space-y-8 pt-16">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">{t("selectLanguage", "en")} / भाषा चुनें</h1>
            </div>

            <div className="space-y-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                onClick={() => handleLanguageSelect("hi")}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-semibold text-gray-900 mb-2">हिंदी</div>
                  <div className="text-gray-600">अपनी भाषा में आवेदन करें</div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                onClick={() => handleLanguageSelect("en")}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-semibold text-gray-900 mb-2">English</div>
                  <div className="text-gray-600">Apply in English</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Welcome Screen */}
        {step === "welcome" && (
          <div className="text-center space-y-8 pt-8">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">{t("welcomeTitle", language)}</h2>
              <p className="text-gray-600 text-lg">{t("chatWelcome", language)}</p>
            </div>

            <Button
              onClick={proceedToChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl"
            >
              {language === "hi" ? "चैट शुरू करें" : "Start Chat"}
            </Button>
          </div>
        )}

        {/* Chat Interface */}
        {step === "chat" && (
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{t("chatWelcome", language)}</p>
                    <p className="text-gray-600 mt-2 text-sm">
                      {language === "hi"
                        ? "आप टाइप कर सकते हैं या वॉइस का उपयोग कर सकते हैं"
                        : "You can type or use voice input"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Input placeholder={language === "hi" ? "यहाँ टाइप करें..." : "Type here..."} className="flex-1" />
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleVoice}
                className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>

            <Button onClick={proceedToPersonalInfo} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4">
              {language === "hi" ? "जानकारी भरें" : "Fill Information"}
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
                  {language === "hi" ? "पूरा नाम" : "Full Name"}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={language === "hi" ? "अपना नाम लिखें" : "Enter your name"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {language === "hi" ? "मोबाइल नंबर" : "Mobile Number"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={language === "hi" ? "10 अंकों का नंबर" : "10-digit number"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">{language === "hi" ? "पेशा" : "Occupation"}</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder={language === "hi" ? "आपका काम" : "Your job"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income" className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  {language === "hi" ? "मासिक आय" : "Monthly Income"}
                </Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                  placeholder={language === "hi" ? "₹ में राशि" : "Amount in ₹"}
                />
              </div>
            </div>

            <Button onClick={proceedToLoanDetails} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4">
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
                  {language === "hi" ? "लोन राशि" : "Loan Amount"}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                  placeholder={language === "hi" ? "₹ में राशि" : "Amount in ₹"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {language === "hi" ? "लोन का उद्देश्य" : "Loan Purpose"}
                </Label>
                <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange("loanPurpose", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "hi" ? "उद्देश्य चुनें" : "Select purpose"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">{language === "hi" ? "व्यक्तिगत" : "Personal"}</SelectItem>
                    <SelectItem value="business">{language === "hi" ? "व्यापार" : "Business"}</SelectItem>
                    <SelectItem value="education">{language === "hi" ? "शिक्षा" : "Education"}</SelectItem>
                    <SelectItem value="medical">{language === "hi" ? "चिकित्सा" : "Medical"}</SelectItem>
                    <SelectItem value="home">{language === "hi" ? "घर" : "Home"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">{language === "hi" ? "अवधि (महीने)" : "Tenure (Months)"}</Label>
                <Select value={formData.loanTenure} onValueChange={(value) => handleInputChange("loanTenure", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 {language === "hi" ? "महीने" : "months"}</SelectItem>
                    <SelectItem value="12">12 {language === "hi" ? "महीने" : "months"}</SelectItem>
                    <SelectItem value="18">18 {language === "hi" ? "महीने" : "months"}</SelectItem>
                    <SelectItem value="24">24 {language === "hi" ? "महीने" : "months"}</SelectItem>
                    <SelectItem value="36">36 {language === "hi" ? "महीने" : "months"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={completeOnboarding} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4">
              {language === "hi" ? "आगे बढ़ें" : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </MobileContainer>
  )
}

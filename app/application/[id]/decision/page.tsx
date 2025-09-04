"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MockDB, type LoanApplication, generateAIDecision } from "@/lib/mock-data"
import { t, type Language } from "@/lib/translations"
import { MobileContainer } from "@/components/layout/mobile-container"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  Brain,
  TrendingUp,
  Shield,
  AlertTriangle,
  IndianRupee,
  Clock,
  FileText,
} from "lucide-react"

type DecisionStep = "processing" | "analyzing" | "complete"

export default function AIDecisionPage() {
  const params = useParams()
  const applicationId = params.id as string

  const [application, setApplication] = useState<LoanApplication | null>(null)
  const [currentStep, setCurrentStep] = useState<DecisionStep>("processing")
  const [progress, setProgress] = useState(0)
  const [aiDecision, setAiDecision] = useState<any>(null)
  const [language, setLanguage] = useState<Language>("hi")

  useEffect(() => {
    // Load application data
    const app = MockDB.getApplication(applicationId)
    if (app) {
      setApplication(app)
      setLanguage(app.language)

      if (app.aiDecision) {
        // Decision already exists
        setAiDecision(app.aiDecision)
        setCurrentStep("complete")
        setProgress(100)
      } else {
        // Start AI processing simulation
        processAIDecision(app)
      }
    }
  }, [applicationId])

  const processAIDecision = async (app: LoanApplication) => {
    // Step 1: Processing
    setCurrentStep("processing")
    setProgress(20)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Step 2: Analyzing
    setCurrentStep("analyzing")
    setProgress(60)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Step 3: Generate decision
    const decision = generateAIDecision(app)
    setAiDecision(decision)

    // Update application with decision
    const updatedApp = {
      ...app,
      aiDecision: decision,
      status: decision.approved ? "approved" : ("rejected" as const),
      updatedAt: new Date(),
    }

    MockDB.saveApplication(updatedApp)
    setApplication(updatedApp)

    setProgress(100)
    setCurrentStep("complete")
  }

  const goToHome = () => {
    window.location.href = "/"
  }

  const goToAdmin = () => {
    window.location.href = "/admin"
  }

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    const user = MockDB.getCurrentUser()
    if (user) {
      const updatedUser = { ...user, preferredLanguage: lang }
      MockDB.setCurrentUser(updatedUser)
    }
  }

  const goBack = () => {
    window.location.href = `/application/${applicationId}/documents`
  }

  if (!application) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary-foreground">{t("loading", language)}</p>
          </div>
        </div>
      </MobileContainer>
    )
  }

  return (
    <MobileContainer>
      <AppHeader
        title={language === "hi" ? "AI निर्णय" : "AI Decision"}
        onBack={currentStep === "complete" ? undefined : goBack}
        showBack={currentStep === "complete" ? false : true}
      />

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
        {/* Processing Steps */}
        {currentStep !== "complete" && (
          <Card className="border-2 border-primary bg-secondary">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-primary-foreground animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentStep === "processing"
                      ? language === "hi"
                        ? "आवेदन प्रोसेस हो रहा है..."
                        : "Processing Application..."
                      : language === "hi"
                        ? "AI विश्लेषण चल रहा है..."
                        : "AI Analysis in Progress..."}
                  </h2>

                  <p className="text-secondary-foreground">
                    {currentStep === "processing"
                      ? language === "hi"
                        ? "आपके दस्तावेज जांचे जा रहे हैं"
                        : "Your documents are being verified"
                      : language === "hi"
                        ? "AI आपकी जोखिम प्रोफाइल का विश्लेषण कर रहा है"
                        : "AI is analyzing your risk profile"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-muted-foreground">{progress}%</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-secondary-foreground">
                  <Clock className="w-4 h-4" />
                  {language === "hi" ? "कुछ सेकंड और..." : "Just a few more seconds..."}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Decision Result */}
        {currentStep === "complete" && aiDecision && (
          <div className="space-y-6">
            {/* Decision Header */}
            <Card
              className={`border-2 ${aiDecision.approved ? "border-primary bg-secondary" : "border-destructive bg-destructive/10"}`}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                      aiDecision.approved ? "bg-primary" : "bg-destructive"
                    }`}
                  >
                    {aiDecision.approved ? (
                      <CheckCircle className="w-10 h-10 text-primary-foreground" />
                    ) : (
                      <XCircle className="w-10 h-10 text-destructive-foreground" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {aiDecision.approved ? t("congratulations", language) : t("loanRejected", language)}
                    </h1>

                    <p className={`text-lg ${aiDecision.approved ? "text-primary" : "text-destructive"}`}>
                      {aiDecision.approved ? t("loanApproved", language) : t("loanRejectedMsg", language)}
                    </p>
                  </div>

                  {aiDecision.approved && (
                    <div className="bg-card rounded-lg p-4 border border-primary">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-foreground">{language === "hi" ? "अप्रूव्ड राशि" : "Approved Amount"}</span>
                        <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                          <IndianRupee className="w-6 h-6" />
                          {application.loanDetails.amount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  {language === "hi" ? "AI विश्लेषण रिपोर्ट" : "AI Analysis Report"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Confidence Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-foreground">
                      {language === "hi" ? "विश्वसनीयता स्कोर" : "Confidence Score"}
                    </span>
                    <Badge variant={aiDecision.confidence > 0.8 ? "default" : "secondary"}>
                      {Math.round(aiDecision.confidence * 100)}%
                    </Badge>
                  </div>
                  <Progress value={aiDecision.confidence * 100} className="h-2" />
                </div>

                {/* Risk Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-foreground">
                      {language === "hi" ? "जोखिम स्कोर" : "Risk Score"}
                    </span>
                    <Badge
                      variant={
                        aiDecision.riskScore < 50 ? "default" : aiDecision.riskScore < 70 ? "secondary" : "destructive"
                      }
                    >
                      {aiDecision.riskScore}/100
                    </Badge>
                  </div>
                  <Progress value={aiDecision.riskScore} className="h-2" />
                </div>

                {/* Decision Factors */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {language === "hi" ? "निर्णय के कारक" : "Decision Factors"}
                  </h4>

                  <div className="space-y-2">
                    {aiDecision.reasons.map((reason: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            reason.toLowerCase().includes("high") || reason.toLowerCase().includes("all")
                              ? "bg-primary"
                              : reason.toLowerCase().includes("low") || reason.toLowerCase().includes("insufficient")
                                ? "bg-destructive"
                                : "bg-yellow-500"
                          }`}
                        />
                        <span className="text-sm text-secondary-foreground">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary-foreground" />
                  {language === "hi" ? "आवेदन सारांश" : "Application Summary"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-secondary-foreground">{language === "hi" ? "आवेदक" : "Applicant"}</p>
                    <p className="font-medium">{application.personalInfo.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-secondary-foreground">{language === "hi" ? "मासिक आय" : "Monthly Income"}</p>
                    <p className="font-medium">₹{application.personalInfo.monthlyIncome.toLocaleString("en-IN")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-secondary-foreground">{language === "hi" ? "लोन राशि" : "Loan Amount"}</p>
                    <p className="font-medium">₹{application.loanDetails.amount.toLocaleString("en-IN")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-secondary-foreground">{language === "hi" ? "अवधि" : "Tenure"}</p>
                    <p className="font-medium">
                      {application.loanDetails.tenure} {language === "hi" ? "महीने" : "months"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-foreground">
                      {language === "hi" ? "दस्तावेज सत्यापित" : "Documents Verified"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">
                        {application.documents.filter((doc) => doc.verified).length}/{application.documents.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {aiDecision.approved ? (
                <Button
                  onClick={goToHome}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold cursor-pointer"
                >
                  {language === "hi" ? "होम पर जाएं" : "Go to Home"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Card className="border-yellow-500/50 bg-yellow-500/10">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="space-y-2">
                          <p className="font-medium text-yellow-700">
                            {language === "hi" ? "सुधार के सुझाव" : "Improvement Suggestions"}
                          </p>
                          <ul className="text-sm text-yellow-600 space-y-1">
                            <li>• {language === "hi" ? "आय बढ़ाने की कोशिश करें" : "Try to increase your income"}</li>
                            <li>• {language === "hi" ? "कम राशि के लिए आवेदन करें" : "Apply for a smaller amount"}</li>
                            <li>• {language === "hi" ? "अधिक दस्तावेज जमा करें" : "Submit additional documents"}</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={goToHome} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 cursor-pointer">
                    {language === "hi" ? "होम पर जाएं" : "Go to Home"}
                  </Button>
                </div>
              )}

              <Button variant="outline" onClick={goToAdmin} className="w-full bg-transparent cursor-pointer">
                {language === "hi" ? "एडमिन डैशबोर्ड देखें" : "View Admin Dashboard"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileContainer>
  )
}

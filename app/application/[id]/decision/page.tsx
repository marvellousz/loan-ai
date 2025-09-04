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
  const [language, setLanguage] = useState<Language>("hi")
  const [currentStep, setCurrentStep] = useState<DecisionStep>("processing")
  const [progress, setProgress] = useState(0)
  const [aiDecision, setAiDecision] = useState<any>(null)

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

  const goBack = () => {
    window.location.href = `/application/${applicationId}/documents`
  }

  if (!application) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loading", language)}</p>
          </div>
        </div>
      </MobileContainer>
    )
  }

  return (
    <MobileContainer>
      <AppHeader
        title={language === "hi" ? "AI निर्णय" : "AI Decision"}
        language={language}
        onBack={currentStep === "complete" ? undefined : goBack}
        showBack={currentStep === "complete" ? false : true}
      />

      <div className="p-4 space-y-6">
        {/* Processing Steps */}
        {currentStep !== "complete" && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentStep === "processing"
                      ? language === "hi"
                        ? "आवेदन प्रोसेस हो रहा है..."
                        : "Processing Application..."
                      : language === "hi"
                        ? "AI विश्लेषण चल रहा है..."
                        : "AI Analysis in Progress..."}
                  </h2>

                  <p className="text-gray-600">
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
                  <p className="text-sm text-gray-500">{progress}%</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
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
              className={`border-2 ${aiDecision.approved ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                      aiDecision.approved ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {aiDecision.approved ? (
                      <CheckCircle className="w-10 h-10 text-white" />
                    ) : (
                      <XCircle className="w-10 h-10 text-white" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {aiDecision.approved ? t("congratulations", language) : t("loanRejected", language)}
                    </h1>

                    <p className={`text-lg ${aiDecision.approved ? "text-green-800" : "text-red-800"}`}>
                      {aiDecision.approved ? t("loanApproved", language) : t("loanRejectedMsg", language)}
                    </p>
                  </div>

                  {aiDecision.approved && (
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{language === "hi" ? "अप्रूव्ड राशि" : "Approved Amount"}</span>
                        <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
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
                  <Brain className="w-5 h-5 text-blue-600" />
                  {language === "hi" ? "AI विश्लेषण रिपोर्ट" : "AI Analysis Report"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Confidence Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
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
                    <span className="text-sm font-medium text-gray-700">
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
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {language === "hi" ? "निर्णय के कारक" : "Decision Factors"}
                  </h4>

                  <div className="space-y-2">
                    {aiDecision.reasons.map((reason: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            reason.toLowerCase().includes("high") || reason.toLowerCase().includes("all")
                              ? "bg-green-500"
                              : reason.toLowerCase().includes("low") || reason.toLowerCase().includes("insufficient")
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700">{reason}</span>
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
                  <FileText className="w-5 h-5 text-gray-600" />
                  {language === "hi" ? "आवेदन सारांश" : "Application Summary"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{language === "hi" ? "आवेदक" : "Applicant"}</p>
                    <p className="font-medium">{application.personalInfo.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{language === "hi" ? "मासिक आय" : "Monthly Income"}</p>
                    <p className="font-medium">₹{application.personalInfo.monthlyIncome.toLocaleString("en-IN")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{language === "hi" ? "लोन राशि" : "Loan Amount"}</p>
                    <p className="font-medium">₹{application.loanDetails.amount.toLocaleString("en-IN")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{language === "hi" ? "अवधि" : "Tenure"}</p>
                    <p className="font-medium">
                      {application.loanDetails.tenure} {language === "hi" ? "महीने" : "months"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === "hi" ? "दस्तावेज सत्यापित" : "Documents Verified"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
                >
                  {language === "hi" ? "होम पर जाएं" : "Go to Home"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div className="space-y-2">
                          <p className="font-medium text-orange-800">
                            {language === "hi" ? "सुधार के सुझाव" : "Improvement Suggestions"}
                          </p>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• {language === "hi" ? "आय बढ़ाने की कोशिश करें" : "Try to increase your income"}</li>
                            <li>• {language === "hi" ? "कम राशि के लिए आवेदन करें" : "Apply for a smaller amount"}</li>
                            <li>• {language === "hi" ? "अधिक दस्तावेज जमा करें" : "Submit additional documents"}</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={goToHome} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4">
                    {language === "hi" ? "होम पर जाएं" : "Go to Home"}
                  </Button>
                </div>
              )}

              <Button variant="outline" onClick={goToAdmin} className="w-full bg-transparent">
                {language === "hi" ? "एडमिन डैशबोर्ड देखें" : "View Admin Dashboard"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileContainer>
  )
}

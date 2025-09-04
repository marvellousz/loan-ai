"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { MockDB, type LoanApplication } from "@/lib/mock-data"
import { t, type Language } from "@/lib/translations"
import { MobileContainer } from "@/components/layout/mobile-container"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Camera,
  FileText,
  CreditCard,
  Building2,
  User,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react"

type DocumentType = "aadhar" | "pan" | "salary_slip" | "bank_statement" | "selfie"

interface DocumentRequirement {
  type: DocumentType
  nameHi: string
  nameEn: string
  icon: React.ReactNode
  required: boolean
  uploaded: boolean
  verified: boolean
}

export default function DocumentUploadPage() {
  const params = useParams()
  const applicationId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [application, setApplication] = useState<LoanApplication | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [uploadingDoc, setUploadingDoc] = useState<DocumentType | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null)
  const [language, setLanguage] = useState<Language>("hi")

  const [documents, setDocuments] = useState<DocumentRequirement[]>([
    {
      type: "aadhar",
      nameHi: "आधार कार्ड",
      nameEn: "Aadhar Card",
      icon: <CreditCard className="w-5 h-5" />,
      required: true,
      uploaded: false,
      verified: false,
    },
    {
      type: "pan",
      nameHi: "पैन कार्ड",
      nameEn: "PAN Card",
      icon: <CreditCard className="w-5 h-5" />,
      required: true,
      uploaded: false,
      verified: false,
    },
    {
      type: "salary_slip",
      nameHi: "सैलरी स्लिप",
      nameEn: "Salary Slip",
      icon: <FileText className="w-5 h-5" />,
      required: true,
      uploaded: false,
      verified: false,
    },
    {
      type: "bank_statement",
      nameHi: "बैंक स्टेटमेंट",
      nameEn: "Bank Statement",
      icon: <Building2 className="w-5 h-5" />,
      required: false,
      uploaded: false,
      verified: false,
    },
    {
      type: "selfie",
      nameHi: "सेल्फी",
      nameEn: "Selfie",
      icon: <User className="w-5 h-5" />,
      required: true,
      uploaded: false,
      verified: false,
    },
  ])

  useEffect(() => {
    // Load application data
    const app = MockDB.getApplication(applicationId)
    if (app) {
      setApplication(app)
      setLanguage(app.language)

      // Update document status based on application data
      setDocuments((prev) =>
        prev.map((doc) => {
          const appDoc = app.documents.find((d) => d.type === doc.type)
          return {
            ...doc,
            uploaded: !!appDoc,
            verified: appDoc?.verified || false,
          }
        }),
      )
    }

    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [applicationId])

  const handleDocumentUpload = (docType: DocumentType) => {
    setSelectedDocType(docType)
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedDocType || !application) return

    setUploadingDoc(selectedDocType)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create document entry
    const newDocument = {
      id: MockDB.generateId(),
      type: selectedDocType,
      name: file.name,
      uploadedAt: new Date(),
      verified: Math.random() > 0.3, // 70% chance of auto-verification
    }

    // Update application
    const updatedApplication = {
      ...application,
      documents: [...application.documents.filter((d) => d.type !== selectedDocType), newDocument],
      updatedAt: new Date(),
    }

    MockDB.saveApplication(updatedApplication)
    setApplication(updatedApplication)

    // Update local document state
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.type === selectedDocType ? { ...doc, uploaded: true, verified: newDocument.verified } : doc,
      ),
    )

    setUploadingDoc(null)
    setSelectedDocType(null)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const takePhoto = (docType: DocumentType) => {
    // In a real app, this would open camera
    alert(language === "hi" ? "कैमरा फीचर जल्द ही आएगा" : "Camera feature coming soon")
  }

  const proceedToDecision = () => {
    const requiredDocs = documents.filter((doc) => doc.required)
    const uploadedRequiredDocs = requiredDocs.filter((doc) => doc.uploaded)

    if (uploadedRequiredDocs.length < requiredDocs.length) {
      alert(language === "hi" ? "कृपया सभी आवश्यक दस्तावेज अपलोड करें" : "Please upload all required documents")
      return
    }

    window.location.href = `/application/${applicationId}/decision`
  }

  const goBack = () => {
    window.location.href = "/onboarding"
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

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    const user = MockDB.getCurrentUser()
    if (user) {
      const updatedUser = { ...user, preferredLanguage: lang }
      MockDB.setCurrentUser(updatedUser)
    }
  }

  const uploadedCount = documents.filter((doc) => doc.uploaded).length
  const totalRequired = documents.filter((doc) => doc.required).length
  const progress = (uploadedCount / documents.length) * 100

  return (
    <MobileContainer>
      <AppHeader title={t("uploadDocuments", language)} onBack={goBack} />

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
        {/* Online/Offline Status */}
        <Card className={`border-2 ${isOnline ? "border-primary bg-secondary" : "border-yellow-500/50 bg-yellow-500/10"}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {isOnline ? <Wifi className="w-5 h-5 text-primary" /> : <WifiOff className="w-5 h-5 text-yellow-600" />}
              <div className="flex-1">
                <p className={`font-medium ${isOnline ? "text-primary" : "text-yellow-700"}`}>
                  {isOnline ? (language === "hi" ? "ऑनलाइन" : "Online") : language === "hi" ? "ऑफलाइन" : "Offline"}
                </p>
                <p className={`text-sm ${isOnline ? "text-primary" : "text-yellow-600"}`}>
                  {isOnline
                    ? language === "hi"
                      ? "दस्तावेज अपलोड कर सकते हैं"
                      : "Can upload documents"
                    : language === "hi"
                      ? "ऑनलाइन होने पर अपलोड करें"
                      : "Upload when online"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">{language === "hi" ? "प्रगति" : "Progress"}</h2>
            <span className="text-sm text-secondary-foreground">
              {uploadedCount}/{documents.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-secondary-foreground">
            {language === "hi"
              ? `${totalRequired} आवश्यक दस्तावेज में से ${documents.filter((doc) => doc.required && doc.uploaded).length} अपलोड हो गए`
              : `${documents.filter((doc) => doc.required && doc.uploaded).length} of ${totalRequired} required documents uploaded`}
          </p>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">{language === "hi" ? "दस्तावेज सूची" : "Document List"}</h3>

          {documents.map((doc) => (
            <Card key={doc.type} className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.uploaded
                          ? doc.verified
                            ? "bg-primary/10 text-primary"
                            : "bg-yellow-500/10 text-yellow-500"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {doc.uploaded ? (
                        doc.verified ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )
                      ) : (
                        doc.icon
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{language === "hi" ? doc.nameHi : doc.nameEn}</h4>
                        {doc.required && (
                          <Badge variant="secondary" className="text-xs">
                            {language === "hi" ? "आवश्यक" : "Required"}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-secondary-foreground">
                        {doc.uploaded
                          ? doc.verified
                            ? language === "hi"
                              ? "सत्यापित"
                              : "Verified"
                            : language === "hi"
                              ? "सत्यापन में"
                              : "Under verification"
                          : language === "hi"
                            ? "अपलोड नहीं हुआ"
                            : "Not uploaded"}
                      </p>
                    </div>
                  </div>

                  {!doc.uploaded && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => takePhoto(doc.type)}
                        disabled={!isOnline || uploadingDoc === doc.type}
                        className="cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDocumentUpload(doc.type)}
                        disabled={!isOnline || uploadingDoc === doc.type}
                        className="cursor-pointer"
                      >
                        {uploadingDoc === doc.type ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={proceedToDecision}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 cursor-pointer"
          disabled={documents.filter((doc) => doc.required && doc.uploaded).length < totalRequired}
        >
          {language === "hi" ? "AI निर्णय के लिए आगे बढ़ें" : "Proceed to AI Decision"}
        </Button>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
      </div>
    </MobileContainer>
  )
}

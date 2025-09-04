"use client"

import { useState, useEffect } from "react"
import { MockDB, type LoanApplication } from "@/lib/mock-data"
import { t, type Language } from "@/lib/translations"
import { MobileContainer } from "@/components/layout/mobile-container"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  IndianRupee,
  FileText,
  Eye,
} from "lucide-react"

type FilterStatus = "all" | "pending" | "approved" | "rejected" | "under_review"

export default function AdminDashboard() {
  const [language, setLanguage] = useState<Language>("en")
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null)

  useEffect(() => {
    // Load all applications
    const apps = MockDB.getApplications()
    setApplications(apps)
    setFilteredApplications(apps)
  }, [])

  useEffect(() => {
    // Filter applications based on search and status
    let filtered = applications

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.personalInfo.phone.includes(searchTerm) ||
          app.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }, [applications, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "under_review":
        return <FileText className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const stats = {
    total: applications.length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
    pending: applications.filter((app) => app.status === "pending").length,
    totalAmount: applications
      .filter((app) => app.status === "approved")
      .reduce((sum, app) => sum + app.loanDetails.amount, 0),
  }

  const viewApplication = (app: LoanApplication) => {
    window.location.href = `/application/${app.id}/decision`
  }

  const goBack = () => {
    window.location.href = "/"
  }

  return (
    <MobileContainer>
      <AppHeader title={t("adminDashboard", language)} language={language} onBack={goBack} />

      <div className="p-4 space-y-6">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                language === "hi" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                language === "en" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("totalApplications", language)}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("approvedApplications", language)}</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("pendingReview", language)}</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{language === "hi" ? "कुल राशि" : "Total Amount"}</p>
                  <p className="text-lg font-bold text-blue-600">₹{stats.totalAmount.toLocaleString("en-IN")}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder={language === "hi" ? "नाम, फोन या ID से खोजें" : "Search by name, phone or ID"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={(value: FilterStatus) => setStatusFilter(value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "hi" ? "सभी" : "All"}</SelectItem>
                  <SelectItem value="pending">{language === "hi" ? "लंबित" : "Pending"}</SelectItem>
                  <SelectItem value="approved">{language === "hi" ? "अप्रूव्ड" : "Approved"}</SelectItem>
                  <SelectItem value="rejected">{language === "hi" ? "रिजेक्ट" : "Rejected"}</SelectItem>
                  <SelectItem value="under_review">{language === "hi" ? "समीक्षाधीन" : "Under Review"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === "hi" ? "आवेदन सूची" : "Applications List"}
            </h2>
            <Badge variant="secondary">
              {filteredApplications.length} {language === "hi" ? "परिणाम" : "results"}
            </Badge>
          </div>

          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{language === "hi" ? "कोई आवेदन नहीं मिला" : "No applications found"}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{app.personalInfo.name}</h3>
                            <Badge className={`text-xs ${getStatusColor(app.status)}`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(app.status)}
                                {app.status}
                              </div>
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600">
                            ID: {app.id} • {app.personalInfo.phone}
                          </p>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => viewApplication(app)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">{language === "hi" ? "लोन राशि" : "Loan Amount"}</p>
                          <p className="font-medium">₹{app.loanDetails.amount.toLocaleString("en-IN")}</p>
                        </div>

                        <div>
                          <p className="text-gray-600">{language === "hi" ? "मासिक आय" : "Monthly Income"}</p>
                          <p className="font-medium">₹{app.personalInfo.monthlyIncome.toLocaleString("en-IN")}</p>
                        </div>

                        <div>
                          <p className="text-gray-600">{language === "hi" ? "उद्देश्य" : "Purpose"}</p>
                          <p className="font-medium capitalize">{app.loanDetails.purpose}</p>
                        </div>

                        <div>
                          <p className="text-gray-600">{language === "hi" ? "आवेदन दिनांक" : "Applied On"}</p>
                          <p className="font-medium">{new Date(app.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>

                      {/* AI Decision Summary */}
                      {app.aiDecision && (
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">{language === "hi" ? "AI स्कोर" : "AI Score"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">
                                {language === "hi" ? "जोखिम" : "Risk"}: {app.aiDecision.riskScore}
                              </Badge>
                              <Badge variant="outline">
                                {language === "hi" ? "विश्वास" : "Confidence"}:{" "}
                                {Math.round(app.aiDecision.confidence * 100)}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Documents Status */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {language === "hi" ? "दस्तावेज स्थिति" : "Documents Status"}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                {app.documents.filter((doc) => doc.verified).length}{" "}
                                {language === "hi" ? "सत्यापित" : "verified"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                {app.documents.length} {language === "hi" ? "कुल" : "total"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{language === "hi" ? "त्वरित कार्य" : "Quick Actions"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="w-4 h-4 mr-2" />
              {language === "hi" ? "रिपोर्ट एक्सपोर्ट करें" : "Export Reports"}
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent">
              <TrendingUp className="w-4 h-4 mr-2" />
              {language === "hi" ? "एनालिटिक्स देखें" : "View Analytics"}
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Users className="w-4 h-4 mr-2" />
              {language === "hi" ? "उपयोगकर्ता प्रबंधन" : "User Management"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  )
}

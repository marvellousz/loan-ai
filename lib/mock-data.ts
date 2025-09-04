// Mock database schema and data for loan underwriting app
export interface LoanApplication {
  id: string
  userId: string
  status: "pending" | "approved" | "rejected" | "under_review"
  language: "hi" | "en"
  personalInfo: {
    name: string
    phone: string
    email?: string
    address: string
    occupation: string
    monthlyIncome: number
  }
  documents: {
    id: string
    type: "aadhar" | "pan" | "salary_slip" | "bank_statement" | "selfie"
    name: string
    uploadedAt: Date
    verified: boolean
  }[]
  loanDetails: {
    amount: number
    purpose: string
    tenure: number // in months
  }
  aiDecision?: {
    approved: boolean
    confidence: number
    reasons: string[]
    riskScore: number
    createdAt: Date
  }
  chatHistory: {
    id: string
    message: string
    sender: "user" | "bot"
    timestamp: Date
    language: "hi" | "en"
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  phone: string
  name?: string
  preferredLanguage: "hi" | "en"
  createdAt: Date
}

// Mock data storage
const STORAGE_KEYS = {
  APPLICATIONS: "loan_applications",
  USERS: "users",
  CURRENT_USER: "current_user",
} as const

// Mock database operations
export class MockDB {
  static getApplications(): LoanApplication[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS)
    return data ? JSON.parse(data) : []
  }

  static saveApplication(application: LoanApplication): void {
    if (typeof window === "undefined") return
    const applications = this.getApplications()
    const existingIndex = applications.findIndex((app) => app.id === application.id)

    if (existingIndex >= 0) {
      applications[existingIndex] = { ...application, updatedAt: new Date() }
    } else {
      applications.push(application)
    }

    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications))
  }

  static getApplication(id: string): LoanApplication | null {
    const applications = this.getApplications()
    return applications.find((app) => app.id === id) || null
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return data ? JSON.parse(data) : null
  }

  static setCurrentUser(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  }

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

// Sample AI decision logic
export const generateAIDecision = (application: LoanApplication) => {
  const { personalInfo, documents, loanDetails } = application

  let riskScore = 50 // Base risk score
  const reasons: string[] = []

  // Income-based scoring
  if (personalInfo.monthlyIncome >= 50000) {
    riskScore -= 15
    reasons.push("High monthly income")
  } else if (personalInfo.monthlyIncome >= 25000) {
    riskScore -= 5
    reasons.push("Moderate monthly income")
  } else {
    riskScore += 10
    reasons.push("Low monthly income")
  }

  // Document verification
  const verifiedDocs = documents.filter((doc) => doc.verified).length
  if (verifiedDocs >= 4) {
    riskScore -= 10
    reasons.push("All documents verified")
  } else if (verifiedDocs >= 2) {
    riskScore -= 5
    reasons.push("Most documents verified")
  } else {
    riskScore += 15
    reasons.push("Insufficient document verification")
  }

  // Loan amount vs income ratio
  const loanToIncomeRatio = loanDetails.amount / (personalInfo.monthlyIncome * 12)
  if (loanToIncomeRatio > 5) {
    riskScore += 20
    reasons.push("High loan-to-income ratio")
  } else if (loanToIncomeRatio > 3) {
    riskScore += 10
    reasons.push("Moderate loan-to-income ratio")
  } else {
    riskScore -= 5
    reasons.push("Conservative loan amount")
  }

  const approved = riskScore < 60
  const confidence = Math.max(0.6, Math.min(0.95, (100 - Math.abs(riskScore - 50)) / 100))

  return {
    approved,
    confidence,
    reasons: approved ? reasons.filter((r) => !r.includes("Low") && !r.includes("High loan")) : reasons,
    riskScore,
    createdAt: new Date(),
  }
}

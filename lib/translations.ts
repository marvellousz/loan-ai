// Translation system for Hindi/English support
export type Language = "hi" | "en"

export const translations = {
  // Navigation & Common
  back: { hi: "वापस", en: "Back" },
  next: { hi: "आगे", en: "Next" },
  submit: { hi: "जमा करें", en: "Submit" },
  loading: { hi: "लोड हो रहा है...", en: "Loading..." },

  // Language Selection
  selectLanguage: { hi: "भाषा चुनें", en: "Select Language" },
  hindi: { hi: "हिंदी", en: "Hindi" },
  english: { hi: "अंग्रेजी", en: "English" },

  // Onboarding
  welcomeTitle: { hi: "तुरंत लोन पाएं", en: "Get Instant Loan" },
  welcomeSubtitle: { hi: "AI की मदद से 5 मिनट में लोन अप्रूवल", en: "AI-powered loan approval in 5 minutes" },
  startApplication: { hi: "आवेदन शुरू करें", en: "Start Application" },

  // Chat Interface
  chatWelcome: { hi: "नमस्ते! मैं आपकी लोन एप्लिकेशन में मदद करूंगा।", en: "Hello! I'll help you with your loan application." },
  askName: { hi: "आपका नाम क्या है?", en: "What is your name?" },
  askPhone: { hi: "आपका मोबाइल नंबर क्या है?", en: "What is your mobile number?" },
  askIncome: { hi: "आपकी मासिक आय कितनी है?", en: "What is your monthly income?" },
  askLoanAmount: { hi: "आपको कितना लोन चाहिए?", en: "How much loan do you need?" },

  // Document Upload
  uploadDocuments: { hi: "दस्तावेज अपलोड करें", en: "Upload Documents" },
  aadharCard: { hi: "आधार कार्ड", en: "Aadhar Card" },
  panCard: { hi: "पैन कार्ड", en: "PAN Card" },
  salarySlip: { hi: "सैलरी स्लिप", en: "Salary Slip" },
  bankStatement: { hi: "बैंक स्टेटमेंट", en: "Bank Statement" },
  selfie: { hi: "सेल्फी", en: "Selfie" },

  // AI Decision
  processingApplication: { hi: "आवेदन प्रोसेस हो रहा है...", en: "Processing application..." },
  congratulations: { hi: "बधाई हो!", en: "Congratulations!" },
  loanApproved: { hi: "आपका लोन अप्रूव हो गया है", en: "Your loan has been approved" },
  loanRejected: { hi: "खुशी की बात नहीं", en: "Unfortunately" },
  loanRejectedMsg: { hi: "आपका लोन अप्रूव नहीं हुआ है", en: "Your loan application was not approved" },

  // Admin Dashboard
  adminDashboard: { hi: "एडमिन डैशबोर्ड", en: "Admin Dashboard" },
  totalApplications: { hi: "कुल आवेदन", en: "Total Applications" },
  approvedApplications: { hi: "अप्रूव्ड आवेदन", en: "Approved Applications" },
  pendingReview: { hi: "समीक्षाधीन", en: "Pending Review" },
} as const

export const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang] || translations[key]["en"]
}

// Translation system for Hindi/English support
export type Language = "hi" | "en"

export const translations = {
  // Navigation & Common
  back: { hi: "वापस", en: "Back" },
  next: { hi: "आगे", en: "Next" },
  submit: { hi: "जमा करें", en: "Submit" },
  loading: { hi: "लोड हो रहा है...", en: "Loading..." },
  continue: { hi: "आगे बढ़ें", en: "Continue" },
  months: { hi: "महीने", en: "months" },
  pleaseFillAllFields: { hi: "कृपया सभी फील्ड भरें", en: "Please fill all fields" },

  // Language Selection (now removed from onboarding flow, but kept for potential future use or other parts of app)
  selectLanguage: { hi: "भाषा चुनें", en: "Select Language" },
  hindi: { hi: "हिंदी", en: "Hindi" },
  english: { hi: "अंग्रेजी", en: "English" },

  // Onboarding
  welcomeTitle: { hi: "तुरंत लोन पाएं", en: "Get Instant Loan" },
  welcomeSubtitle: { hi: "AI की मदद से 5 मिनट में लोन अप्रूवल", en: "AI-powered loan approval in 5 minutes" },
  startApplication: { hi: "आवेदन शुरू करें", en: "Start Application" },
  fillInformation: { hi: "जानकारी भरें", en: "Fill Information" },
  personalInformation: { hi: "व्यक्तिगत जानकारी", en: "Personal Information" },
  loanDetails: { hi: "लोन विवरण", en: "Loan Details" },
  fullName: { hi: "पूरा नाम", en: "Full Name" },
  enterYourName: { hi: "अपना नाम लिखें", en: "Enter your name" },
  mobileNumber: { hi: "मोबाइल नंबर", en: "Mobile Number" },
  tenDigitNumber: { hi: "10 अंकों का नंबर", en: "10-digit number" },
  occupation: { hi: "पेशा", en: "Occupation" },
  yourJob: { hi: "आपका काम", en: "Your job" },
  amountInRupees: { hi: "₹ में राशि", en: "Amount in ₹" },
  loanAmount: { hi: "लोन राशि", en: "Loan Amount" },
  loanPurpose: { hi: "लोन का उद्देश्य", en: "Loan Purpose" },
  selectPurpose: { hi: "उद्देश्य चुनें", en: "Select purpose" },
  personal: { hi: "व्यक्तिगत", en: "Personal" },
  business: { hi: "व्यापार", en: "Business" },
  education: { hi: "शिक्षा", en: "Education" },
  medical: { hi: "चिकित्सा", en: "Medical" },
  home: { hi: "घर", en: "Home" },
  tenureMonths: { hi: "अवधि (महीने)", en: "Tenure (Months)" },


  // Chat Interface
  chatAssistant: { hi: "चैट सहायता", en: "Chat Assistant" },
  chatWelcome: { hi: "नमस्ते! मैं आपकी लोन एप्लिकेशन में मदद करूंगा।", en: "Hello! I'll help you with your loan application." },
  chatInputHint: { hi: "आप टाइप कर सकते हैं या वॉइस का उपयोग कर सकते हैं", en: "You can type or use voice input" },
  typeHere: { hi: "यहाँ टाइप करें...", en: "Type here..." },
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

  // Additional missing translations
  monthlyIncome: { hi: "मासिक आय", en: "Monthly Income" },
  aadhar: { hi: "आधार", en: "Aadhar" },
  pan: { hi: "पैन", en: "PAN" },
  photo: { hi: "फोटो", en: "Photo" },
  uploadBtn: { hi: "अपलोड करें", en: "Upload" },
  uploadFast: { hi: "तेजी से अपलोड करें", en: "Upload quickly" },
  voiceSpeak: { hi: "बोलें", en: "Speak" },
  quickAmount: { hi: "त्वरित राशि", en: "Quick Amount" },
  tip: { hi: "सुझाव", en: "Tip" },
  basicInfo: { hi: "बुनियादी जानकारी", en: "Basic Information" },
  name: { hi: "नाम", en: "Name" },
  village: { hi: "गाँव", en: "Village" },
  amount: { hi: "राशि", en: "Amount" },
  purpose: { hi: "उद्देश्य", en: "Purpose" },
  assistant: { hi: "सहायक", en: "Assistant" },
  chatbotMsg: { hi: "मैं आपकी लोन एप्लिकेशन में मदद करूंगा", en: "I'll help you with your loan application" },
  titleChat: { hi: "चैट", en: "Chat" },
  titleUpload: { hi: "अपलोड", en: "Upload" },
  ariaSelectHindi: { hi: "हिंदी चुनें", en: "Select Hindi" },
  ariaSelectEnglish: { hi: "अंग्रेजी चुनें", en: "Select English" },
  choose: { hi: "चुनें", en: "Choose" },
  offlineNote: { hi: "ऑफलाइन नोट", en: "Offline Note" },
  greetHeading: { hi: "नमस्ते", en: "Hello" },
  greetSub: { hi: "आपका स्वागत है", en: "Welcome" },
} as const

export const t = (key: keyof typeof translations, lang: Language): string => {
  if (!translations[key]) {
    console.warn(`Translation key "${key}" not found`)
    return key
  }
  return translations[key][lang] || translations[key]["en"] || key
}

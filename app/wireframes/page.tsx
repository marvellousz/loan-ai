"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Languages, MessageCircle, Mic, Upload, FileText, ImageIcon, CheckCircle2, XCircle, Info } from "lucide-react"

type Lang = "hi" | "en"

const translations = {
  hi: {
    headerTitle: "स्लाइड 8: यूज़र फ्लो वायरफ्रेम्स",
    headerSub: "मोबाइल-फ़र्स्ट मॉकअप्स: भाषा → चैटबॉट ऑनबोर्डिंग → KYC/वैकल्पिक डेटा → AI निर्णय और स्पष्टीकरण।",

    // Section captions
    capLanguage: "1. भाषा चयन",
    capChat: "2. चैट/वॉइस ऑनबोर्डिंग",
    capUpload: "3. KYC / वैकल्पिक डेटा अपलोड",
    capDecision: "4. AI निर्णय + स्पष्टीकरण",

    // Phone titles
    titleLanguage: "भाषा चुनें",
    titleChat: "चैट • ऑनबोर्डिंग",
    titleUpload: "KYC / वैकल्पिक डेटा",
    titleDecision: "AI निर्णय",

    // Language selector
    greetHeading: "नमस्ते! अपनी भाषा चुनें",
    greetSub: "Hello! Please choose your preferred language.",
    hindi: "हिंदी",
    english: "English",
    choose: "चुनें",
    ariaSelectHindi: "हिंदी चुनें",
    ariaSelectEnglish: "English चुनें",
    offlineNote: "ऐप ऑफ़लाइन में भी काम करता है। Online होते ही डेटा सुरक्षित रूप से सिंक होगा।",

    // Chatbot onboarding
    assistant: "सहायक",
    chatbotMsg: "क्या आप लोन लेना चाहते हैं? राशि और उद्देश्य बताएं। मैं आसान भाषा में मदद करूँगा।",
    voiceSpeak: "वॉइस में बोलें",
    quickAmount: "₹20,000",
    tip: "टिप: आप हिंदी में टाइप कर सकते हैं या बोल सकते हैं।",
    basicInfo: "मूल जानकारी",
    name: "नाम",
    village: "गाँव/ज़िला",
    amount: "राशि",
    purpose: "उद्देश्य",

    // Upload data
    uploadFast: "तेज़ी से निर्णय के लिए KYC और वैकल्पिक डेटा जोड़ें।",
    aadhaar: "आधार",
    pan: "PAN",
    photo: "फ़ोटो लें / अपलोड करें",
    uploadBtn: "अपलोड करें (ऑफ़लाइन सेव, बाद में सिंक)",
    altData: "वैकल्पिक डेटा",
    smsPatterns: "SMS पैटर्न",
    bills: "रीचार्ज/यूटिलिटी बिल",

    // Decision
    approved: "₹20,000 स्वीकृत",
    termRate: "अवधि: 6 माह • ब्याज: 14.5%",
    whyApproved: "क्यों स्वीकृत?",
    reason1: "रीचार्ज और बिल भुगतान समय पर",
    reason2: "कम उधारी संकेत • स्थिर आय पैटर्न",
    reason3: "KYC सत्यापित",
    emiTitle: "किस्त अनुमान",
    emiAmount: "₹3,590 / माह",
    later: "बाद में",
    accept: "स्वीकार करें",
    ifRejected: "अस्वीकृत होने पर",
    showReasons: "स्पष्ट कारण कार्ड और सुधार सुझाव दिखें:",
    improve1: "“कृपया पिछले 3 महीनों के बिल समय पर भरें”",
    improve2: "“PAN सत्यापन पूरा करें”",
  },
  en: {
    headerTitle: "Slide 8: User Flow Wireframes",
    headerSub: "Mobile-first mockups: Language → Chatbot Onboarding → KYC/Alt Data → AI Decision and Explanation.",

    // Section captions
    capLanguage: "1. Language Selector",
    capChat: "2. Chat/Voice Onboarding",
    capUpload: "3. Upload KYC / Alt-Data",
    capDecision: "4. AI Decision + Explainability",

    // Phone titles
    titleLanguage: "Select Language",
    titleChat: "Chat • Onboarding",
    titleUpload: "KYC / Alternative Data",
    titleDecision: "AI Decision",

    // Language selector
    greetHeading: "Hello! Please choose your preferred language.",
    greetSub: "नमस्ते! अपनी भाषा चुनें",
    hindi: "Hindi",
    english: "English",
    choose: "Choose",
    ariaSelectHindi: "Select Hindi",
    ariaSelectEnglish: "Select English",
    offlineNote: "Works offline. Your data will sync securely when you’re online.",

    // Chatbot onboarding
    assistant: "Assistant",
    chatbotMsg: "Are you looking for a loan? Tell me the amount and purpose. I’ll help in simple language.",
    voiceSpeak: "Speak with voice",
    quickAmount: "₹20,000",
    tip: "Tip: You can type or speak.",
    basicInfo: "Basic information",
    name: "Name",
    village: "Village/District",
    amount: "Amount",
    purpose: "Purpose",

    // Upload data
    uploadFast: "Add KYC and alternative data for a faster decision.",
    aadhaar: "Aadhaar",
    pan: "PAN",
    photo: "Take/Upload Photo",
    uploadBtn: "Upload (saved offline, sync later)",
    altData: "Alternative Data",
    smsPatterns: "SMS patterns",
    bills: "Recharge/utility bills",

    // Decision
    approved: "₹20,000 Approved",
    termRate: "Term: 6 months • Interest: 14.5%",
    whyApproved: "Why approved?",
    reason1: "On-time recharge and bill payments",
    reason2: "Low borrowing signals • Stable income patterns",
    reason3: "KYC verified",
    emiTitle: "EMI estimate",
    emiAmount: "₹3,590 / month",
    later: "Later",
    accept: "Accept",
    ifRejected: "If rejected",
    showReasons: "Show clear reason cards and improvement suggestions:",
    improve1: `"Please pay bills on time for the next 3 months"`,
    improve2: `"Complete PAN verification"`,
  },
} as const

function useI18n(lang: Lang) {
  type Keys = keyof (typeof translations)["hi"]
  return useMemo(() => {
    return (key: Keys) => translations[lang][key]
  }, [lang])
}

function PhoneFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-xs rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4" aria-hidden>
        <span className="text-xs text-slate-500">9:41</span>
        <div className="h-2 w-20 rounded-full bg-slate-200" />
        <span className="text-xs text-slate-500">4G</span>
      </div>
      <div className="px-4 pb-3 pt-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="border-t border-slate-100 p-4">{children}</div>
    </div>
  )
}

function LanguageSelectorWireframe({
  t,
  lang,
  setLang,
}: {
  t: (k: keyof (typeof translations)["hi"]) => string
  lang: Lang
  setLang: (l: Lang) => void
}) {
  return (
    <PhoneFrame title={t("titleLanguage")}>
      <div className="flex flex-col gap-4">
        <p className="text-balance text-lg font-semibold text-slate-900">{t("greetHeading")}</p>
        <p className="text-sm text-slate-600">{t("greetSub")}</p>

        <button
          className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
          aria-label={t("ariaSelectHindi")}
          onClick={() => setLang("hi")}
        >
          <Languages className="h-5 w-5 text-blue-600" aria-hidden />
          <div className="flex w-full items-center justify-between">
            <span className="font-medium text-slate-900">{t("hindi")}</span>
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">{t("choose")}</span>
          </div>
        </button>

        <button
          className="w-full rounded-lg border border-slate-200 p-3 text-left text-slate-700 hover:bg-slate-50"
          aria-label={t("ariaSelectEnglish")}
          onClick={() => setLang("en")}
        >
          {t("english")}
        </button>

        <div className="mt-2 rounded-md bg-slate-50 p-3 text-xs text-slate-600">{t("offlineNote")}</div>
      </div>
    </PhoneFrame>
  )
}

function ChatbotOnboardingWireframe({
  t,
}: {
  t: (k: keyof (typeof translations)["hi"]) => string
}) {
  return (
    <PhoneFrame title={t("titleChat")}>
      <div className="flex flex-col gap-3">
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
          <div className="mb-1 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-blue-600" aria-hidden />
            <span className="font-medium text-slate-900">{t("assistant")}</span>
          </div>
          <p>{t("chatbotMsg")}</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
            <Mic className="h-4 w-4 text-blue-600" aria-hidden />
            {t("voiceSpeak")}
          </button>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
            {t("quickAmount")}
          </button>
        </div>

        <div className="rounded-md border border-slate-200 p-2 text-xs text-slate-600">{t("tip")}</div>

        <div className="mt-2 rounded-lg border border-dashed border-slate-300 p-3">
          <label className="block text-xs font-medium text-slate-700">{t("basicInfo")}</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-md bg-slate-50 p-2 text-xs text-slate-700">{t("name")}</div>
            <div className="rounded-md bg-slate-50 p-2 text-xs text-slate-700">{t("village")}</div>
            <div className="rounded-md bg-slate-50 p-2 text-xs text-slate-700">{t("amount")}</div>
            <div className="rounded-md bg-slate-50 p-2 text-xs text-slate-700">{t("purpose")}</div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function UploadDataWireframe({
  t,
}: {
  t: (k: keyof (typeof translations)["hi"]) => string
}) {
  return (
    <PhoneFrame title={t("titleUpload")}>
      <div className="flex flex-col gap-3">
        <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-800">{t("uploadFast")}</div>

        <div className="grid grid-cols-2 gap-2">
          <button className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
            <FileText className="h-5 w-5 text-blue-600" aria-hidden />
            <span className="text-xs font-medium text-slate-800">{t("aadhaar")}</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
            <FileText className="h-5 w-5 text-blue-600" aria-hidden />
            <span className="text-xs font-medium text-slate-800">{t("pan")}</span>
          </button>
          <button className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
            <ImageIcon className="h-5 w-5 text-blue-600" aria-hidden />
            <span className="text-sm font-medium text-slate-800">{t("photo")}</span>
          </button>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-md bg-blue-600 p-2 text-sm font-medium text-white">
          <Upload className="h-4 w-4" aria-hidden />
          {t("uploadBtn")}
        </button>

        <div className="rounded-md border border-slate-200 p-2">
          <p className="text-xs text-slate-700">{t("altData")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-600">
            <li>{t("smsPatterns")}</li>
            <li>{t("bills")}</li>
          </ul>
        </div>
      </div>
    </PhoneFrame>
  )
}

function DecisionScreenWireframe({
  t,
}: {
  t: (k: keyof (typeof translations)["hi"]) => string
}) {
  return (
    <PhoneFrame title={t("titleDecision")}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2 rounded-md border border-slate-200 p-3" role="status" aria-live="polite">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" aria-hidden />
          <div>
            <p className="text-lg font-semibold text-slate-900">{t("approved")}</p>
            <p className="text-sm text-slate-600">{t("termRate")}</p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" aria-hidden />
            <p className="text-sm font-medium text-slate-900">{t("whyApproved")}</p>
          </div>
          <ul className="list-disc space-y-1 pl-5 text-xs text-slate-700">
            <li>{t("reason1")}</li>
            <li>{t("reason2")}</li>
            <li>{t("reason3")}</li>
          </ul>
        </div>

        <div className="rounded-md border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-900">{t("emiTitle")}</p>
          <p className="text-sm text-slate-700">{t("emiAmount")}</p>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
            {t("later")}
          </button>
          <button className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">
            {t("accept")}
          </button>
        </div>

        <div className="rounded-md border border-dashed border-slate-300 p-3">
          <div className="mb-2 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" aria-hidden />
            <p className="text-sm font-medium text-slate-900">{t("ifRejected")}</p>
          </div>
          <p className="text-xs text-slate-700">{t("showReasons")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-700">
            <li>{t("improve1")}</li>
            <li>{t("improve2")}</li>
          </ul>
        </div>
      </div>
    </PhoneFrame>
  )
}

export default function WireframesPage() {
  const [lang, setLang] = useState<Lang>("hi")
  const t = useI18n(lang)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 font-sans">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-bold text-slate-900">{t("headerTitle")}</h1>
        <p className="mt-1 text-pretty text-sm text-slate-600">{t("headerSub")}</p>
      </header>

      <section aria-labelledby="wireframes" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center gap-2">
          <LanguageSelectorWireframe t={t} lang={lang} setLang={setLang} />
          <p className="text-center text-sm font-medium text-slate-700">{t("capLanguage")}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ChatbotOnboardingWireframe t={t} />
          <p className="text-center text-sm font-medium text-slate-700">{t("capChat")}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <UploadDataWireframe t={t} />
          <p className="text-center text-sm font-medium text-slate-700">{t("capUpload")}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <DecisionScreenWireframe t={t} />
          <p className="text-center text-sm font-medium text-slate-700">{t("capDecision")}</p>
        </div>
      </section>
    </main>
  )
}

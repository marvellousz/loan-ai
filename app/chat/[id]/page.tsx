"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { MockDB, type LoanApplication } from "@/lib/mock-data"
import { t, type Language } from "@/lib/translations"
import { MobileContainer } from "@/components/layout/mobile-container"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, MicOff, Bot, User } from "lucide-react"

interface ChatMessage {
  id: string
  message: string
  sender: "user" | "bot"
  timestamp: Date
  language: Language
  type?: "text" | "quick_reply" | "status_update"
  options?: string[]
}

export default function ChatPage() {
  const params = useParams()
  const applicationId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [application, setApplication] = useState<LoanApplication | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [botTyping, setBotTyping] = useState(false)
  const [language, setLanguage] = useState<Language>("hi")

  // Predefined bot responses
  const botResponses = {
    hi: {
      welcome: "नमस्ते! मैं आपकी लोन एप्लिकेशन में मदद करने के लिए यहाँ हूँ। आप मुझसे कुछ भी पूछ सकते हैं।",
      status: "आपका आवेदन प्रोसेस हो रहा है। क्या आप स्थिति जानना चाहते हैं?",
      documents: "आपके दस्तावेज सत्यापित हो रहे हैं। कृपया थोड़ा इंतजार करें।",
      help: "मैं आपकी निम्नलिखित में मदद कर सकता हूँ:\n• आवेदन की स्थिति\n• दस्तावेज अपलोड\n• लोन की जानकारी\n• सामान्य प्रश्न",
      thanks: "धन्यवाद! क्या मैं आपकी और कोई मदद कर सकता हूँ?",
      default: "मैं समझ नहीं पाया। कृपया अपना प्रश्न दोबारा पूछें या 'मदद' टाइप करें।",
    },
    en: {
      welcome: "Hello! I'm here to help you with your loan application. Feel free to ask me anything.",
      status: "Your application is being processed. Would you like to know the current status?",
      documents: "Your documents are being verified. Please wait a moment.",
      help: "I can help you with:\n• Application status\n• Document upload\n• Loan information\n• General questions",
      thanks: "Thank you! Is there anything else I can help you with?",
      default: "I didn't understand that. Please rephrase your question or type 'help'.",
    },
  }

  useEffect(() => {
    // Load application data
    const app = MockDB.getApplication(applicationId)
    if (app) {
      setApplication(app)
      setLanguage(app.language)

      // Load existing chat history or create welcome message
      if (app.chatHistory && app.chatHistory.length > 0) {
        setMessages(
          app.chatHistory.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        )
      } else {
        const welcomeMessage: ChatMessage = {
          id: MockDB.generateId(),
          message: botResponses[app.language].welcome,
          sender: "bot",
          timestamp: new Date(),
          language: app.language,
          type: "text",
        }
        setMessages([welcomeMessage])
        saveChatMessage(welcomeMessage)
      }
    }
  }, [applicationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const saveChatMessage = (message: ChatMessage) => {
    if (!application) return

    const updatedApp = {
      ...application,
      chatHistory: [
        ...application.chatHistory,
        {
          id: message.id,
          message: message.message,
          sender: message.sender,
          timestamp: message.timestamp,
          language: message.language,
        },
      ],
      updatedAt: new Date(),
    }

    MockDB.saveApplication(updatedApp)
    setApplication(updatedApp)
  }

  const generateBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()
    const responses = botResponses[language]

    if (msg.includes("status") || msg.includes("स्थिति") || msg.includes("स्टेटस")) {
      if (application?.status === "approved") {
        return language === "hi"
          ? `बधाई हो! आपका लोन अप्रूव हो गया है। राशि: ₹${application.loanDetails.amount.toLocaleString("en-IN")}`
          : `Congratulations! Your loan has been approved. Amount: ₹${application.loanDetails.amount.toLocaleString("en-IN")}`
      } else if (application?.status === "rejected") {
        return language === "hi"
          ? "खुशी की बात नहीं, आपका लोन अप्रूव नहीं हुआ है। कृपया बेहतर दस्तावेज के साथ दोबारा आवेदन करें।"
          : "Unfortunately, your loan was not approved. Please reapply with better documentation."
      } else {
        return responses.status
      }
    }

    if (msg.includes("document") || msg.includes("दस्तावेज") || msg.includes("papers")) {
      const verifiedDocs = application?.documents.filter((doc) => doc.verified).length || 0
      const totalDocs = application?.documents.length || 0
      return language === "hi"
        ? `आपके ${verifiedDocs}/${totalDocs} दस्तावेज सत्यापित हो गए हैं।`
        : `${verifiedDocs}/${totalDocs} of your documents have been verified.`
    }

    if (msg.includes("help") || msg.includes("मदद") || msg.includes("सहायता")) {
      return responses.help
    }

    if (msg.includes("thank") || msg.includes("धन्यवाद") || msg.includes("thanks")) {
      return responses.thanks
    }

    if (msg.includes("amount") || msg.includes("राशि") || msg.includes("loan")) {
      return language === "hi"
        ? `आपने ₹${application?.loanDetails.amount.toLocaleString("en-IN")} का लोन माँगा है ${application?.loanDetails.purpose} के लिए।`
        : `You have applied for ₹${application?.loanDetails.amount.toLocaleString("en-IN")} loan for ${application?.loanDetails.purpose}.`
    }

    return responses.default
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: MockDB.generateId(),
      message: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      language,
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    saveChatMessage(userMessage)
    setInputMessage("")
    setBotTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage)
      const botMessage: ChatMessage = {
        id: MockDB.generateId(),
        message: botResponse,
        sender: "bot",
        timestamp: new Date(),
        language,
        type: "text",
      }

      setMessages((prev) => [...prev, botMessage])
      saveChatMessage(botMessage)
      setBotTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // In a real app, this would start/stop speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        setInputMessage(language === "hi" ? "मेरे आवेदन की स्थिति क्या है?" : "What is my application status?")
      }, 3000)
    }
  }

  const sendQuickReply = (reply: string) => {
    setInputMessage(reply)
    setTimeout(() => sendMessage(), 100)
  }

  const goBack = () => {
    window.location.href = `/application/${applicationId}/decision`
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

  const quickReplies =
    language === "hi"
      ? ["मेरी स्थिति क्या है?", "दस्तावेज कैसे अपलोड करें?", "मदद चाहिए", "धन्यवाद"]
      : ["What's my status?", "How to upload documents?", "Need help", "Thank you"]

  return (
    <MobileContainer className="flex flex-col">
      <AppHeader title={language === "hi" ? "चैट सहायता" : "Chat Support"} onBack={goBack} />

      {/* Language Toggle */}
      <div className="bg-card border-b border-border p-3">
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
      </div>

      {/* Application Status Bar */}
      <div className="bg-card border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                application.status === "approved"
                  ? "bg-primary"
                  : application.status === "rejected"
                    ? "bg-destructive"
                    : application.status === "under_review"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
              }`}
            />
            <span className="text-sm font-medium text-foreground">{application.personalInfo.name}</span>
          </div>

          <Badge variant="outline" className="text-xs">
            {application.status}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start gap-2 max-w-[80%] ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === "user" ? "bg-primary" : "bg-secondary"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.message}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/80" : "text-secondary-foreground"}`}>
                  {message.timestamp.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Bot Typing Indicator */}
        {botTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="p-4 pt-0">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => sendQuickReply(reply)}
              className="whitespace-nowrap text-xs cursor-pointer"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === "hi" ? "यहाँ टाइप करें..." : "Type here..."}
              className="pr-12 resize-none"
              disabled={botTyping}
            />
          </div>

          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={toggleVoice}
            className={`cursor-pointer ${isListening ? "bg-destructive hover:bg-destructive/90" : ""}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || botTyping}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            {language === "hi" ? "सुन रहा हूँ..." : "Listening..."}
          </div>
        )}
      </div>
    </MobileContainer>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle, Zap } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const NIRD_KNOWLEDGE_BASE = {
  pillars: {
    inclusion:
      'Inclusion means equitable access to digital technology, reducing the digital divide. It ensures all students and schools can benefit from technology regardless of their socioeconomic status.',
    responsibility:
      'Responsibility focuses on thoughtful and reflective use of sovereign technologies that respect personal data. It means choosing open-source solutions and protecting privacy.',
    sustainability:
      'Sustainability fights against planned obsolescence by choosing Linux for equipment and controlling costs. It promotes long-term environmental and economic responsibility.',
  },
  keyPoints: {
    linux: 'Linux is the foundation of NIRD - an open-source operating system that reduces costs, extends hardware lifespan, and provides sovereignty over digital infrastructure.',
    refurbishment:
      'Refurbishment projects involve reconditioning old computers with students, combining technical learning with sustainability. This reduces e-waste and provides affordable equipment.',
    governance:
      'NIRD is a grassroots movement started by teachers, not top-down. It requires participation from teachers, schools, students, and local authorities (collectivités).',
    pilots:
      'Pilot schools test and validate the NIRD approach before scaling. Lycée Carnot in Bruay-la-Buissière is the flagship model for the initiative.',
  },
  milestones: {
    mobilization: 'Phase 1: Building awareness and gathering interested teachers and schools',
    experimentation: 'Phase 2: Testing and validating the NIRD approach in pilot institutions',
    integration:
      'Phase 3: Full integration of sustainable practices across schools and communities',
  },
  faqs: {
    windows:
      'Windows 10 end-of-support (2025) is a catalyst for change. Schools face costly license renewals. Linux offers a free, sustainable alternative.',
    cost:
      'Significant savings on licensing. Free open-source software. Refurbished equipment reduces hardware costs. Long-term infrastructure efficiency.',
    pedagogy: 'NIRD opens pedagogical possibilities: students learn about Linux, software development, digital citizenship, and sustainable practices.',
    adoption:
      'NIRD is voluntary and gradual. Schools can start small - a lab, a classroom - then scale based on their capacity and results.',
  },
}

function generateAIResponse(userInput: string): string {
  const input = userInput.toLowerCase()

  // Check for pillars
  if (input.includes('inclusion')) {
    return `🟢 **Inclusion Pillar**\n\n${NIRD_KNOWLEDGE_BASE.pillars.inclusion}\n\nIt's about ensuring no student is left behind due to technological barriers.`
  }
  if (input.includes('responsibility') || input.includes('responsable')) {
    return `🔵 **Responsibility Pillar**\n\n${NIRD_KNOWLEDGE_BASE.pillars.responsibility}\n\nOpen-source tools like Linux give schools control over their data and infrastructure.`
  }
  if (input.includes('sustainability') || input.includes('durable')) {
    return `🟡 **Sustainability Pillar**\n\n${NIRD_KNOWLEDGE_BASE.pillars.sustainability}\n\nBy choosing Linux and refurbishing equipment, schools reduce e-waste and long-term costs.`
  }

  // Check for key topics
  if (input.includes('linux')) {
    return `🐧 **About Linux in NIRD**\n\n${NIRD_KNOWLEDGE_BASE.keyPoints.linux}\n\nLinux is not just a technical choice—it's a strategic foundation for school independence and resilience.`
  }
  if (input.includes('refurbish') || input.includes('reconditionnement')) {
    return `♻️ **Refurbishment Projects**\n\n${NIRD_KNOWLEDGE_BASE.keyPoints.refurbishment}\n\nExample: Lycée Carnot students refurbished 14 PCs for the primary school in Fouquières-lès-Béthune.`
  }
  if (input.includes('pilot') || input.includes('carnot')) {
    return `🚀 **Pilot Schools**\n\n${NIRD_KNOWLEDGE_BASE.keyPoints.pilots}\n\nPilot schools validate the approach and create models that other schools can follow.`
  }

  // Check for phases/milestones
  if (input.includes('phase') || input.includes('milestone') || input.includes('jalon')) {
    return `📍 **NIRD Three Phases**\n\n1️⃣ **Mobilization**: ${NIRD_KNOWLEDGE_BASE.milestones.mobilization}\n\n2️⃣ **Experimentation**: ${NIRD_KNOWLEDGE_BASE.milestones.experimentation}\n\n3️⃣ **Integration**: ${NIRD_KNOWLEDGE_BASE.milestones.integration}`
  }

  // Check for FAQs
  if (input.includes('windows') || input.includes('cost') || input.includes('price')) {
    return `💰 **Cost & Windows End-of-Support**\n\n${NIRD_KNOWLEDGE_BASE.faqs.windows}\n\n${NIRD_KNOWLEDGE_BASE.faqs.cost}`
  }
  if (input.includes('pedagogy') || input.includes('learning') || input.includes('pédagog')) {
    return `📚 **Pedagogical Benefits**\n\n${NIRD_KNOWLEDGE_BASE.faqs.pedagogy}\n\nNIRD combines technical skills with environmental and civic consciousness.`
  }
  if (input.includes('adopt') || input.includes('join') || input.includes('start')) {
    return `🌱 **Getting Started with NIRD**\n\n${NIRD_KNOWLEDGE_BASE.faqs.adoption}\n\n**First Steps**:\n1. Join the Tchap forum: edurl.fr/tchap-laforgeedu-nird\n2. Connect with other teachers\n3. Plan your pilot project\n4. Start with a small lab or classroom`
  }

  // General NIRD overview
  if (
    input.includes('what is nird') ||
    input.includes('nird') ||
    input.includes('qu est ce')
  ) {
    return `🌍 **Welcome to NIRD**\n\nNIRD stands for **Inclusive, Responsible, and Sustainable Digital Technology** in schools.\n\n**Three Pillars:**\n🟢 **Inclusion** - Equitable access to technology\n🔵 **Responsibility** - Sovereign, privacy-respecting tools\n🟡 **Sustainability** - Fighting obsolescence through Linux\n\n**Key Feature**: Gradual adoption of Linux and open-source tools, starting with volunteer teachers and pilot schools.\n\n**Want to know more?** Ask about:\n- Linux and open-source\n- Refurbishment projects\n- How to join\n- Costs and benefits`
  }

  // Default response
  return `I'm here to help you understand **NIRD - Inclusive, Responsible, and Sustainable Digital**!\n\n**I can explain:**\n- The three pillars (Inclusion, Responsibility, Sustainability)\n- Linux and open-source tools\n- Refurbishment projects\n- How schools can adopt NIRD\n- The three phases of implementation\n- Benefits and costs\n\n**Ask me anything about NIRD!** 🚀`
}

export default function NIRDAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `🌍 **Bienvenue! Welcome to the NIRD AI Assistant**\n\nI'm here to help you understand the **NIRD Initiative** - Inclusive, Responsible, and Sustainable Digital Technology in schools.\n\n**What would you like to know?**\n- What is NIRD?\n- The three pillars (Inclusion, Responsibility, Sustainability)\n- Linux and open-source solutions\n- How to join or start a pilot project\n- Refurbishment projects\n- Costs and benefits`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate response
    const response = generateAIResponse(input)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-white font-bold">
            🌱
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">NIRD AI Assistant</h2>
            <p className="text-sm text-slate-500">
              Learn about Inclusive, Responsible & Sustainable Digital
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-900 rounded-lg rounded-bl-none px-4 py-3 flex items-center gap-2 border border-slate-200">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm text-slate-600">Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length < 3 && (
        <div className="px-6 py-3 border-t border-slate-200 bg-white">
          <p className="text-xs text-slate-600 font-medium mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'What is NIRD?',
              'How to join?',
              'Linux benefits',
              'Refurbishment projects',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion)
                  setTimeout(() => handleSend(), 100)
                }}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about NIRD, Linux, refurbishment, or how to get started..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900 placeholder-slate-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600">
            <span className="font-semibold">Real resources:</span> Join the Tchap forum at
            edurl.fr/tchap-laforgeedu-nird to connect with teachers and pilot projects
          </p>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles, AlertCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

interface AnalysisChatProps {
    analysisId: string
    trigger?: React.ReactNode
    mode?: "sheet" | "embedded"
    className?: string
}

export function AnalysisChat({ analysisId, trigger, mode = "sheet", className }: AnalysisChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I've analyzed your website alongside your competitor. I'm ready to help you win this battle. ask me anything!"
        }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            // Prepare context for the API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysisId,
                    messages: messages.concat(userMessage).map(m => ({ role: m.role, content: m.content }))
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Failed to fetch response')

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content
            }

            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error pulling the analysis data. Please try again."
            }])
        } finally {
            setLoading(false)
        }
    }

    const suggestions = [
        "What are my top 3 quick wins?",
        "Why is my competitor winning?",
        "How can I improve my conversion score?",
        "What tech stack are they using?"
    ]

    // Split Chat Content to reusable component
    const ChatContent = () => (
        <div className={`flex flex-col h-full ${mode === 'embedded' ? 'bg-transparent' : ''}`}>
            {!mode && ( /* Header only for sheet if needed or custom */
                <div className="px-4 py-4 border-b bg-muted/50">...</div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <Avatar className="h-8 w-8 mt-1 border shrink-0">
                            {m.role === 'assistant' ? (
                                <div className="h-full w-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                    <Bot className="h-4 w-4" />
                                </div>
                            ) : (
                                <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-700">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                        </Avatar>
                        <div
                            className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                ? 'bg-emerald-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                                }`}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-1 border shrink-0">
                            <div className="h-full w-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                <Bot className="h-4 w-4" />
                            </div>
                        </Avatar>
                        <div className="rounded-2xl px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <div className={`p-4 ${mode === 'sheet' ? 'border-t bg-background' : 'bg-transparent'}`}>
                {messages.length < 3 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none mask-fade-right">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(s)}
                                className="whitespace-nowrap rounded-full border bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1 text-xs text-slate-500 dark:text-slate-400 transition-colors shrink-0"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="flex gap-2 relative"
                >
                    <Input
                        placeholder="Ask strategy questions..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        className={`flex-1 pr-10 ${mode === 'embedded' ? 'bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500' : ''}`}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={loading || !input.trim()}
                        className="absolute right-1 top-1 h-8 w-8 bg-emerald-600 hover:bg-emerald-500"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )

    if (mode === 'embedded') {
        return <div className={`h-full ${className}`}><ChatContent /></div>
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger || (
                    <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white p-0 z-50">
                        <MessageSquare className="h-6 w-6" />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col p-0">
                <SheetHeader className="px-4 py-4 border-b bg-muted/50">
                    <SheetTitle className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        AI Analyst
                    </SheetTitle>
                    <SheetDescription>
                        Ask questions about your competitive analysis.
                    </SheetDescription>
                </SheetHeader>
                <ChatContent />
            </SheetContent>
        </Sheet>
    )
}

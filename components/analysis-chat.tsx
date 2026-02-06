"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles, MessageSquare, X, RefreshCw, Eraser } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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

interface ChatContentProps {
    messages: Message[]
    loading: boolean
    input: string
    setInput: (value: string) => void
    handleSend: () => void
    handleClear: () => void
    scrollRef: React.RefObject<HTMLDivElement | null>
    mode?: "sheet" | "embedded"
}

// Separate component to manage chat layout and state
const ChatContent = ({ messages, loading, input, setInput, handleSend, handleClear, scrollRef, mode = "sheet" }: ChatContentProps) => {
    const suggestions = [
        "What are my top 3 quick wins?",
        "Why is my competitor winning?",
        "How can I improve my conversion score?",
        "Analyze my headline provided in the report"
    ]

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className={`flex flex-col flex-1 min-h-0 w-full relative overflow-hidden ${mode === 'embedded' ? 'bg-transparent' : 'bg-slate-50'}`}>

            {/* Disclaimer Banner */}
            <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-xs text-center text-emerald-800 font-medium shrink-0">
                AI can provide strategic insights, but always verify critical data.
            </div>

            {/* Messages Area - Flexible Grow with Overscroll Containment */}
            <div
                className="flex-1 overflow-y-auto min-h-0 scroll-smooth overscroll-contain"
                onWheel={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
            >
                <div className="px-4 py-6 sm:px-8 sm:py-8 space-y-8 max-w-4xl mx-auto">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-60">
                            <Bot className="w-12 h-12 text-slate-300" />
                            <p className="text-slate-500 font-medium">No messages yet. Start the conversation!</p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex gap-4 sm:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            {/* Avatar with Circular Styling */}
                            <Avatar className={`h-8 w-8 sm:h-10 sm:w-10 mt-1 shrink-0 shadow-sm rounded-full overflow-hidden ${m.role === 'assistant' ? 'ring-2 ring-emerald-50' : 'ring-2 ring-slate-50'}`}>
                                {m.role === 'assistant' ? (
                                    <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white rounded-full">
                                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white rounded-full">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                )}
                            </Avatar>

                            <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                        {m.role === 'user' ? 'You' : 'Analyst'}
                                    </span>
                                </div>
                                <div
                                    className={`relative px-5 py-3.5 sm:px-6 sm:py-4 text-sm sm:text-base leading-7 shadow-sm ${m.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm shadow-slate-200'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm'
                                        }`}
                                >
                                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }: any) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                ol: ({ node, ...props }: any) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                li: ({ node, ...props }: any) => <li className="pl-1" {...props} />,
                                                strong: ({ node, ...props }: any) => <strong className="font-bold text-inherit" {...props} />,
                                                h3: ({ node, ...props }: any) => <h3 className="font-bold text-lg mt-4 mb-2" {...props} />,
                                            }}
                                        >
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mt-1 shrink-0 ring-2 ring-emerald-50 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white rounded-full">
                                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                                </div>
                            </Avatar>
                            <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                                </div>
                                <span className="text-sm font-medium text-slate-400 ml-2">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} className="h-4" />
                </div>
            </div>

            {/* Input Area - Fixed Footer */}
            <div className="border-t border-slate-200 bg-white/90 backdrop-blur-md p-4 sm:p-6 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(s)}
                                    className="snap-start whitespace-nowrap rounded-full border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all active:scale-95 shadow-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-end gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all p-2">
                        {messages.length > 2 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClear}
                                            className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors self-end mb-0.5"
                                        >
                                            <Eraser className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Clear Chat History</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <Textarea
                            placeholder="Ask a follow-up question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            className="min-h-[44px] max-h-[120px] w-full resize-none border-0 bg-transparent py-3 px-2 text-base shadow-none focus-visible:ring-0 placeholder:text-slate-400 scrollbar-thin text-slate-800"
                            rows={1}
                        />

                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl shadow-sm transition-all duration-200 mb-0.5
                                ${!input.trim()
                                    ? 'bg-slate-100 text-slate-400'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 shadow-lg'
                                }`}
                            size="icon"
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </Button>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-slate-400">
                            Press <kbd className="font-mono bg-slate-100 px-1 rounded text-slate-500 border border-slate-200">Enter</kbd> to send, <kbd className="font-mono bg-slate-100 px-1 rounded text-slate-500 border border-slate-200">Shift + Enter</kbd> for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function AnalysisChat({ analysisId, trigger, mode = "sheet", className }: AnalysisChatProps) {
    const defaultMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I've analyzed your website and ready to discuss the findings. What would you like to know?"
    }

    const [messages, setMessages] = useState<Message[]>([defaultMessage])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            // Small delay to allow layout calculation
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }
    }, [messages, loading])

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

    const handleClear = () => {
        setMessages([defaultMessage])
    }

    if (mode === 'embedded') {
        return (
            <div className={`h-full ${className}`}>
                <ChatContent
                    messages={messages}
                    loading={loading}
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    handleClear={handleClear}
                    scrollRef={scrollRef}
                    mode={mode}
                />
            </div>
        )
    }

    // Full Screen Center Modal
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl bg-slate-900 hover:bg-slate-800 text-white p-0 z-50 transition-all duration-300 hover:scale-105 hover:rotate-3 ring-4 ring-white/20">
                        <MessageSquare className="h-7 w-7" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] md:h-[85vh] p-0 gap-0 overflow-hidden bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col focus:outline-none">
                {/* Custom Header */}
                <DialogHeader className="p-4 sm:px-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 bg-white/50 shrink-0 z-20">
                    <DialogTitle className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 tracking-tight">
                                AI Strategy Partner
                            </span>
                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Online & Ready
                            </span>
                        </div>
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleClear} className="text-slate-400 hover:text-slate-600 hidden sm:flex" title="Refresh Chat">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                {/* Main Content */}
                <ChatContent
                    messages={messages}
                    loading={loading}
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    handleClear={handleClear}
                    scrollRef={scrollRef}
                    mode={mode}
                />
            </DialogContent>
        </Dialog>
    )
}

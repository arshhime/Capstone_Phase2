import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Menu, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navigation from '../components/Navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I am Kshitij's Agent. Ask me anything about Data Structures or the training data." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/chat', {
                query: userMessage.content
            });

            const botMessage: Message = { role: 'assistant', content: response.data.answer };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the agent." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
            <Navigation />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-zinc-900 border-r border-zinc-800 hidden md:flex flex-col">
                    <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg">Agent Console</span>
                    </div>

                    <div className="p-4">
                        <button className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium border border-white/5">
                            <Plus className="w-4 h-4" /> New Chat
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4">
                        <div className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Recent</div>
                        {/* Mock History */}
                        <div className="space-y-1">
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-300 truncate">
                                Hash Table Implementation
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-300 truncate">
                                React Hooks Explanation
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500"></div>
                            <div className="text-sm">
                                <div className="font-medium">User</div>
                                <div className="text-zinc-500 text-xs">Premium Plan</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">

                    {/* Mobile Header */}
                    <header className="md:hidden p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6 text-violet-500" />
                            <span className="font-bold">KshitijAgent</span>
                        </div>
                        <Menu className="w-6 h-6" />
                    </header>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
                                            <Bot className="w-4 h-4 text-violet-400" />
                                        </div>
                                    )}

                                    <div
                                        className={`relative max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-violet-600 text-white rounded-br-sm'
                                            : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-200 rounded-bl-sm'
                                            }`}
                                    >
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
                                            <User className="w-4 h-4 text-zinc-300" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-violet-400" />
                                    </div>
                                    <div className="bg-zinc-800/50 border border-zinc-700/50 px-4 py-3 rounded-2xl rounded-bl-sm">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 pb-6 max-w-3xl mx-auto w-full">
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative flex items-center bg-zinc-900 rounded-2xl border border-zinc-700 focus-within:border-zinc-600 shadow-xl">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask something..."
                                    className="w-full bg-transparent px-6 py-4 outline-none text-white placeholder:text-zinc-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="p-2 mr-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-3 text-xs text-zinc-600">
                            Powered by LangGraph & RAG • Kshitij Capstone
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ChatPage;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MCQSection from '../components/MCQSection';
import Navigation from '../components/Navigation';

const PracticePage: React.FC = () => {
    const navigate = useNavigate();
    const [isComplete, setIsComplete] = useState(false);

    const handleComplete = () => {
        setIsComplete(true);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
            <Navigation />
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Console
                        </button>
                        <h1 className="text-4xl font-bold tracking-tight">Practice <span className="text-violet-500">Mode</span></h1>
                        <p className="text-zinc-500 mt-2">Test your knowledge on the concepts you just learned.</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-violet-500" />
                    </div>
                </header>

                <main className="relative z-10">
                    <AnimatePresence mode="wait">
                        {!isComplete ? (
                            <motion.div
                                key="quiz"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-panel rounded-3xl border border-white/5 bg-white/[0.02] shadow-2xl"
                            >
                                <MCQSection onComplete={handleComplete} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel p-12 rounded-3xl border border-white/5 bg-white/[0.02] text-center space-y-8"
                            >
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                                    <Trophy className="w-12 h-12 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">Practice Completed!</h2>
                                    <p className="text-zinc-500 max-w-sm mx-auto">Great job! You've successfully finished this assessment module.</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="px-8 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-bold transition-all shadow-lg"
                                    >
                                        Go to Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate('/chat')}
                                        className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl font-bold transition-all"
                                    >
                                        Discuss with AI
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                <footer className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                        <span className="text-xs font-medium text-zinc-400">Questions are dynamically generated based on your progress</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PracticePage;

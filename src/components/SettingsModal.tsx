import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Type, Keyboard } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme, fontSize, setFontSize, submitKeyBinding, setSubmitKeyBinding } = useUserPreferences();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
                        <h2 className="text-xl font-bold text-white">Editor Settings</h2>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Theme Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                                <Moon className="w-4 h-4" /> Theme
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setTheme('vs-dark')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'vs-dark'
                                            ? 'bg-violet-600/10 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                        }`}
                                >
                                    <div className="w-full h-20 bg-[#1e1e1e] rounded-lg border border-white/10 mb-2"></div>
                                    <span className="text-xs font-bold">Dark (Default)</span>
                                </button>
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'light'
                                            ? 'bg-violet-600/10 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                        }`}
                                >
                                    <div className="w-full h-20 bg-white rounded-lg border border-zinc-200 mb-2"></div>
                                    <span className="text-xs font-bold">Light</span>
                                </button>
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-bold text-zinc-400 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Type className="w-4 h-4" /> Font Size
                                </div>
                                <span className="text-white">{fontSize}px</span>
                            </div>
                            <input
                                type="range"
                                min="12"
                                max="24"
                                step="1"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
                            />
                            <div className="flex justify-between text-xs text-zinc-600 font-mono">
                                <span>12px</span>
                                <span>24px</span>
                            </div>
                        </div>

                        {/* Key Bindings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                                <Keyboard className="w-4 h-4" /> Key Bindings
                            </div>
                            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                <span className="text-sm font-medium text-zinc-300">Submit Solution</span>
                                <select
                                    value={submitKeyBinding}
                                    onChange={(e) => setSubmitKeyBinding(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg px-3 py-1.5 focus:border-violet-500 outline-none"
                                >
                                    <option value="Enter">Enter</option>
                                    <option value="Shift+Enter">Shift + Enter</option>
                                    <option value="Ctrl+Enter">Ctrl + Enter</option>
                                    <option value="Meta+Enter">Cmd + Enter</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg font-bold text-sm transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SettingsModal;

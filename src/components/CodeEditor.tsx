import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Settings, Code2, Terminal, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  onStartCoding: () => void;
  phase: 'reading' | 'mcq' | 'coding' | 'completed';
}

export default function CodeEditor({ onStartCoding, phase }: CodeEditorProps) {
  const [code, setCode] = useState('// Your intelligent logic goes here\n\nfunction solution() {\n  \n}');
  const [language] = useState('javascript');

  const handleRunCode = () => {
    if (phase === 'reading' || phase === 'mcq') {
      onStartCoding();
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 relative overflow-hidden group/editor">
      {/* Editor Control Bar */}
      <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
            <Code2 className="h-4 w-4 text-violet-500" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Main.js</span>
          </div>

          <div className="flex items-center gap-2 h-8 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{language}</span>
            <ChevronDown className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Editor Settings">
            <Settings className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-zinc-800 mx-1"></div>
          <button
            onClick={() => setCode('// Resetting environment...\n\nfunction solution() {\n  \n}')}
            className="flex items-center px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={phase === 'completed'}
            className="flex items-center px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <Play className="h-3.5 w-3.5 mr-2 fill-current" />
            Run Test Cases
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        {(phase === 'reading' || phase === 'mcq') && (
          <div className="absolute inset-0 z-20 bg-zinc-950/60 backdrop-blur-[2px] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/10 text-center shadow-2xl bg-zinc-900/80"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Logic Verification Required</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Complete the problem analysis and logic assessment to unlock the development environment.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-left p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${phase === 'reading' ? 'bg-violet-600 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${phase === 'reading' ? 'text-white' : 'text-zinc-500'}`}>Step 1: Context Analysis</span>
                </div>
                <div className="flex items-center gap-3 text-left p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${phase === 'mcq' ? 'bg-violet-600 animate-pulse' : 'bg-zinc-800'}`}></div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${phase === 'mcq' ? 'text-white' : 'text-zinc-500'}`}>Step 2: Logic Assessment</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="h-full">
          <Editor
            height="100%"
            defaultLanguage={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
            }}
          />
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="h-10 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-4 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Debug Console</span>
          </div>
          <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
            Ready
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-zinc-600 font-medium whitespace-nowrap">UTF-8</div>
        </div>
      </div>
    </div>
  );
}
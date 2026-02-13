import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useProblem } from '../contexts/ProblemContext';
import axios from 'axios';

// Import extracted components
import EditorControlBar from './CodeEditor/EditorControlBar';
import EditorWindow from './CodeEditor/EditorWindow';
import OutputConsole, { TestCaseResult } from './CodeEditor/OutputConsole';

interface CodeEditorProps {
  onStartCoding: () => void;
  phase: 'reading' | 'mcq' | 'coding' | 'completed';
}

export default function CodeEditor({ onStartCoding, phase }: CodeEditorProps) {
  const { currentProblem } = useProblem();
  const [code, setCode] = useState(currentProblem?.template || '');
  const [language, setLanguage] = useState('python');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  // Update code when problem changes
  useEffect(() => {
    if (currentProblem) {
      // Use templates for specific language if available, else fallback to template
      const initialCode = currentProblem.templates?.[language] || currentProblem.template || '';
      setCode(initialCode);
      setResults([]);
      setShowOutput(false);
      setGeneralError(null);
    }
  }, [currentProblem, language]); // Also re-sync when language changes

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
  };

  const handleRunCode = async () => {
    if (phase === 'reading' || phase === 'mcq') {
      onStartCoding();
      return;
    }

    if (!currentProblem) return;

    setIsRunning(true);
    setResults([]);
    setGeneralError(null);
    setShowOutput(true);

    try {
      const testCases = currentProblem.testCases.map((tc: { input: string; output: string }) => ({
        input: tc.input,
        expected_output: tc.output,
      }));

      const response = await axios.post('http://127.0.0.1:8000/execute', {
        code: code,
        language: language, // Using the state language
        method_name: currentProblem.methodName,
        test_cases: testCases,
      });

      setResults(response.data.results);
      if (response.data.error) {
        setGeneralError(response.data.error);
      }
    } catch (err: any) {
      setGeneralError(err.response?.data?.detail || 'Failed to connect to the execution server. Is the backend running?');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (currentProblem) {
      setCode(currentProblem.template);
    }
    setResults([]);
    setShowOutput(false);
    setGeneralError(null);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 relative overflow-hidden group/editor">
      {/* Editor Control Bar */}
      <EditorControlBar
        onRun={handleRunCode}
        onReset={handleReset}
        isRunning={isRunning}
        language={language}
        onLanguageChange={handleLanguageChange}
        phase={phase}
      />

      {/* Editor Area */}
      <div className="relative" style={{ flex: showOutput ? '1 1 60%' : '1 1 100%', minHeight: 0 }}>
        <EditorWindow
          code={code}
          onChange={setCode}
          language={language}
          phase={phase}
          onStartCoding={onStartCoding}
        />
      </div>

      {/* Output Console */}
      <AnimatePresence>
        <OutputConsole
          show={showOutput}
          onClose={() => setShowOutput(false)}
          isRunning={isRunning}
          results={results}
          generalError={generalError}
        />
      </AnimatePresence>

      {/* Terminal Footer (when output is hidden) */}
      {!showOutput && (
        <div className="h-10 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-4 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Console</span>
            </div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
              Ready
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-zinc-600 font-medium whitespace-nowrap">Python 3 • LeetCode Mode</div>
          </div>
        </div>
      )}
    </div>
  );
}
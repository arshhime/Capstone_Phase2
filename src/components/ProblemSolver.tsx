
import { useState, useEffect } from 'react';
import { CheckCircle, Lightbulb, Eye, EyeOff, Brain, ChevronRight, Zap, List, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useProblem } from '../contexts/ProblemContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { useAuth } from '../contexts/AuthContext';
import CodeEditor from './CodeEditor';
import MCQSection from './MCQSection';
import Timer from './Timer';
import OptimalSolution from './OptimalSolution';
import ProblemListModal from './ProblemListModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemSolver() {
  const { currentProblem, problems, selectProblem } = useProblem();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submitKeyBinding } = useUserPreferences();
  const [showProblemList, setShowProblemList] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [phase, setPhase] = useState<'reading' | 'mcq' | 'coding' | 'completed'>('reading');
  const [showOptimalSolution, setShowOptimalSolution] = useState(false);
  const [solutionWorked, setSolutionWorked] = useState<boolean | null>(null);
  const [extraHints, setExtraHints] = useState<string[]>([]);
  const [generatingHint, setGeneratingHint] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const { id } = useParams();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');

  // Sync with URL
  useEffect(() => {
    if (id && (!currentProblem || currentProblem.id !== id)) {
      selectProblem(id);
    }
  }, [id, currentProblem, selectProblem]);

  // Reset state when problem changes
  useEffect(() => {
    setPhase('reading');
    setIsCompleted(false);
    setShowOptimalSolution(false);
    setTimerRunning(false);
    setCurrentHintIndex(0);
    setShowHint(false);
    setSolutionWorked(null);
    setExtraHints([]);
  }, [currentProblem?.id]);

  // Combined hints
  const allHints = [...(currentProblem?.hints || []), ...extraHints];

  const generateAIHint = async () => {
    setGeneratingHint(true);
    try {
      const response = await axios.post('http://localhost:5001/api/ai/hint', {
        problemTitle: currentProblem?.title,
        problemDescription: currentProblem?.description,
        currentCode: currentProblem?.id ? localStorage.getItem(`code-${currentProblem.id}`) : ""
      });

      if (response.data.hint) {
        setExtraHints(prev => [...prev, response.data.hint]);
        setCurrentHintIndex(allHints.length); // Jump to new hint
        setShowHint(true);
      }
    } catch (error) {
      console.error("Failed to generate AI hint", error);
    } finally {
      setGeneratingHint(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (phase === 'coding' && timerRunning) {
      interval = setInterval(() => {
        if (!showHint) {
          setShowHint(true);
        }
      }, 420000); // 7 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, timerRunning, showHint]);

  // Handle key bindings for submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'coding') return;

      const keys = submitKeyBinding.split('+');
      const mainKey = keys[keys.length - 1];
      const hasMeta = keys.includes('Meta') || keys.includes('Cmd'); // Meta is Cmd on Mac
      const hasCtrl = keys.includes('Ctrl');
      const hasShift = keys.includes('Shift');
      const hasAlt = keys.includes('Alt');

      const isMainKey = e.key.toLowerCase() === mainKey.toLowerCase();
      const matchMeta = hasMeta ? e.metaKey : !e.metaKey;
      const matchCtrl = hasCtrl ? e.ctrlKey : !e.ctrlKey;
      const matchShift = hasShift ? e.shiftKey : !e.shiftKey;
      const matchAlt = hasAlt ? e.altKey : !e.altKey;

      if (isMainKey && matchMeta && matchCtrl && matchShift && matchAlt) {
        e.preventDefault();
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, submitKeyBinding]);

  if (!currentProblem) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-500">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-xs">No problem selected</p>
        </div>
      </div>
    );
  }

  const handleStartCoding = () => {
    setPhase('coding');
    setTimerRunning(true);
    setStartTime(Date.now());
  };

  const handleComplete = async () => {
    setIsExecuting(true);
    setExecutionError(null);
    setExecutionError(null);
    try {
      if (!code) {
        setExecutionError("No code found to submit.");
        setIsExecuting(false);
        return;
      }

      // Prepare test cases
      const testCases = currentProblem.testCases.map(tc => ({
        input: tc.input,
        expected_output: tc.output
      }));

      // Call Execution API
      // Call Execution API
      const response = await axios.post('http://127.0.0.1:5002/execute', {
        language: language,
        code: code,
        test_cases: testCases,
        method_name: currentProblem.methodName || 'solution'
      });

      const result = response.data;
      console.log("Execution Result:", result); // DEBUG

      setPhase('completed');
      setTimerRunning(false);
      setShowOptimalSolution(true);

      if (result.success) {
        setSolutionWorked(true);
        setExecutionError(null); // Clear any previous errors
      } else {
        setSolutionWorked(false);

        // Find the first failed test case to show error
        if (result.results && result.results.length > 0) {
          const failedCase = result.results.find((r: any) => !r.passed);
          if (failedCase) {
            console.log("Failed Logic:", failedCase); // DEBUG
            if (failedCase.error) {
              setExecutionError(`Execution Error: ${failedCase.error}`);
            } else {
              setExecutionError(`Test Failed: Input: ${failedCase.input}, Expected: ${failedCase.expected_output}, Got: ${failedCase.actual_output}`);
            }
          } else {
            // Fallback if success is false but no specific failed case found (unlikely)
            setExecutionError("Unknown execution failure. Please check your code.");
          }
        } else {
          setExecutionError(result.error || "Execution failed without results.");
        }
      }

      // Log Interaction
      console.log("Logging Interaction - User:", user, "StartTime:", startTime); // DEBUG

      const timeTakenCalculated = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      const userIdToLog = user ? user.id : 'anonymous'; // Fallback if user context is missing, though unlikely if logged in
      const usernameToLog = user ? (user.username || user.email.split('@')[0]) : 'anonymous';

      if (userIdToLog) {
        await axios.post('http://localhost:5001/api/interactions', {
          userId: userIdToLog,
          username: usernameToLog,
          problemId: currentProblem.id,
          title: currentProblem.title,
          language: language,
          submissionStatus: result.success ? 1 : 0,
          timeTakenSeconds: timeTakenCalculated,
          runtimeMs: result.metric_runtime_ms || 0,
          memoryUsedKB: result.metric_memory_kb || 0
        });
      }

    } catch (err: any) {
      console.error("Execution failed:", err);
      setExecutionError(err.message || "Failed to execute code.");
      setPhase('completed');
      setTimerRunning(false);
      setShowOptimalSolution(true);
      setSolutionWorked(false);

      // Log failed execution due to error (status 0)
      if (user && startTime) {
        const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
        await axios.post('http://localhost:5001/api/interactions', {
          userId: user.id,
          problemId: currentProblem.id,
          language: language,
          submissionStatus: 0,
          timeTakenSeconds: timeTakenSeconds,
          runtimeMs: 0,
          memoryUsedKB: 0
        });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSolutionFeedback = (worked: boolean) => {
    setSolutionWorked(worked);
    if (!worked) {
      setPhase('reading');
      setIsCompleted(false);
      setShowOptimalSolution(false);
      setTimerRunning(false);
    }
  };

  const nextHint = () => {
    if (currentHintIndex < allHints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Console Bar */}
      <div className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 p-3 flex-shrink-0 z-20">
        <div className="max-w-full mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center cursor-pointer hover:bg-violet-600/30 transition-all"
                onClick={() => navigate('/')}
                title="Back to Landing Page"
              >
                <Zap className="h-4 w-4 text-violet-500" />
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={() => setShowProblemList(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all text-sm font-medium border border-zinc-700 hover:border-zinc-600"
                >
                  <List className="w-4 h-4" />
                  Problem List
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 border-l border-zinc-800 pl-8">
              <Timer running={timerRunning} />

              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Status</span>
                  {isCompleted ? (
                    <div className="flex items-center text-emerald-400 text-xs font-bold">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      SUBMITTED
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-2"></div>
                      LIVE
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Phase</span>
                  <div className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/5">
                    {phase}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/5 rounded-xl transition-all font-bold text-xs uppercase tracking-wider"
            >
              <Lightbulb className="h-3.5 w-3.5 mr-2 text-amber-400" />
              Request Hint
            </button>

            {phase === 'coding' && (
              <button
                onClick={handleComplete}
                className="flex items-center px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Solution
              </button>
            )}

            {isExecuting && (
              <div className="flex items-center px-4 py-2 bg-zinc-800 text-zinc-400 border border-white/5 rounded-xl font-bold text-xs uppercase tracking-wider">
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                Assessing...
              </div>
            )}

            {phase === 'completed' && showOptimalSolution && (
              <button
                onClick={() => setShowOptimalSolution(!showOptimalSolution)}
                className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {showOptimalSolution ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showOptimalSolution ? 'Hide' : 'Reveal'} Solution
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hint Banner */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 leading-none">
                    Intelligent Guidance • {currentHintIndex + 1} / {allHints.length}
                  </h3>
                  <p className="text-sm text-zinc-300 font-medium">{allHints[currentHintIndex]}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-6">
                {currentHintIndex < allHints.length - 1 ? (
                  <button
                    onClick={nextHint}
                    className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest flex items-center"
                  >
                    Next Logic Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={generateAIHint}
                    disabled={generatingHint}
                    className="flex items-center gap-2 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border border-violet-500/30"
                  >
                    {generatingHint ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {generatingHint ? "Thinking..." : "Ask AI"}
                  </button>
                )}
                <button
                  onClick={() => setShowHint(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Interaction Engine */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <PanelGroup direction="horizontal">
          <Panel defaultSize={45} minSize={30}>
            <div className="h-full bg-zinc-950/40 backdrop-blur-sm overflow-y-auto border-r border-zinc-800/50">
              <div className="p-8 md:p-10 space-y-10">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-violet-600 rounded-full"></div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">{currentProblem.title}</h1>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className={`px - 2 py - 0.5 rounded - md text - [10px] font - bold uppercase tracking - widest ${currentProblem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      currentProblem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      } `}>
                      {currentProblem.difficulty}
                    </span>
                    {currentProblem.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider py-1">
                        # {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <p className="text-zinc-300 leading-relaxed font-medium whitespace-pre-line bg-zinc-900/40 p-5 rounded-2xl border border-white/5">
                      {currentProblem.description}
                    </p>
                  </div>
                </section>

                <section className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div> Input Structure
                    </h4>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-white/5 font-mono text-xs text-zinc-400">
                      {currentProblem.inputFormat}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></div> Output Structure
                    </h4>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-white/5 font-mono text-xs text-zinc-400">
                      {currentProblem.outputFormat}
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Critical Constraints
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentProblem.constraints.map((constraint, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-white/5 text-xs text-zinc-400 font-medium">
                        <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                        {constraint}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logic Use Cases</h4>
                  <div className="space-y-6">
                    {currentProblem.testCases.map((testCase, index) => (
                      <div key={index} className="glass-panel p-6 rounded-2xl relative group hover:border-violet-500/20 transition-all overflow-hidden bg-zinc-900/40">
                        <div className="absolute top-0 right-0 p-4 text-[10px] font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors uppercase">
                          Case {index + 1}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Input Stream</div>
                            <div className="font-mono text-sm bg-zinc-950 p-3 rounded-xl border border-white/5 text-violet-400">{testCase.input}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Expected Output</div>
                            <div className="font-mono text-sm bg-zinc-950 p-3 rounded-xl border border-white/5 text-emerald-400">{testCase.output}</div>
                          </div>
                          {testCase.explanation && (
                            <div className="text-xs text-zinc-500 italic pt-2 border-t border-zinc-800">
                              <span className="font-bold uppercase tracking-widest mr-2 not-italic text-[10px] text-zinc-600">Context:</span>
                              {testCase.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {phase === 'reading' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12"
                  >
                    <button
                      onClick={() => setPhase('mcq')}
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3"
                    >
                      Initialize Logic Check <Brain className="w-5 h-5" />
                    </button>
                    <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-4 opacity-50">
                      Step 1 of 3 • Knowledge Gathering
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-zinc-900 hover:bg-violet-600/50 transition-all cursor-col-resize z-10 flex items-center justify-center group">
            <div className="w-0.5 h-8 bg-zinc-800 group-hover:bg-white/40 rounded-full"></div>
          </PanelResizeHandle>

          <Panel defaultSize={55} minSize={30}>
            <div className="h-full bg-zinc-950">
              <AnimatePresence mode="wait">
                {showOptimalSolution && phase === 'completed' ? (
                  <motion.div
                    key="optimal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    <OptimalSolution
                      problem={currentProblem}
                      onSolutionFeedback={handleSolutionFeedback}
                      solutionWorked={solutionWorked}
                      executionError={executionError}
                    />
                  </motion.div>

                ) : (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    <CodeEditor
                      onStartCoding={handleStartCoding}
                      phase={phase}
                      language={language}
                      onLanguageChange={setLanguage}
                      code={code}
                      onCodeChange={setCode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <AnimatePresence>
        {phase === 'mcq' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 h-[320px] bg-zinc-900 border-t border-violet-500/30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-40 overflow-hidden rounded-t-[40px]"
          >
            <div className="h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/10 via-zinc-900 to-zinc-900">
              <MCQSection key={currentProblem.id} onComplete={() => {
                setPhase('coding');
                setTimerRunning(true);
                setStartTime(Date.now());
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProblemListModal
        isOpen={showProblemList}
        onClose={() => setShowProblemList(false)}
      />
    </div >
  );
}

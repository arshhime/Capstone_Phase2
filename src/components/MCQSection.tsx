import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Brain, Clock, Zap, ShieldCheck } from 'lucide-react';
import { useProblem } from '../contexts/ProblemContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MCQSectionProps {
  onComplete: () => void;
}

export default function MCQSection({ onComplete }: MCQSectionProps) {
  const { mcqQuestions, currentMCQIndex, nextMCQ } = useProblem();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [answerTime, setAnswerTime] = useState<number | null>(null);

  const currentQuestion = mcqQuestions[currentMCQIndex];

  if (!currentQuestion) {
    return null;
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;

    setAnswerTime(Date.now() - startTime);
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentMCQIndex < mcqQuestions.length - 1) {
      nextMCQ();
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswered(false);
    } else {
      onComplete();
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="h-full flex flex-col p-8 bg-zinc-900/40 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Brain className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Logic Assessment</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Step 2 of 3 • Knowledge Check</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mcqQuestions.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentMCQIndex
                ? 'w-8 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                : index < currentMCQIndex
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-zinc-800'
                }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
        <div className="mb-8">
          <p className="text-zinc-200 text-lg font-medium leading-relaxed mb-8 bg-zinc-950/40 p-6 rounded-2xl border border-white/5">
            {currentQuestion.question}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={!answered ? { scale: 1.02, x: 5 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
                className={`p-5 text-left rounded-2xl border-2 transition-all relative group overflow-hidden ${answered
                  ? selectedAnswer === index
                    ? isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                    : index === currentQuestion.correctAnswer
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-50'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-violet-500/50 hover:bg-zinc-800/80 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${answered && (selectedAnswer === index || index === currentQuestion.correctAnswer)
                    ? 'bg-current/10 border-current/20'
                    : 'bg-zinc-950 border-white/5 group-hover:border-violet-500/30'
                    }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>

                {answered && selectedAnswer === index && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-rose-500" />
                    )}
                  </div>
                )}

                {answered && index === currentQuestion.correctAnswer && selectedAnswer !== index && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                )}

                {/* Hover Glow */}
                {!answered && (
                  <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl mb-8 relative overflow-hidden border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
                }`}
            >
              <div className="flex items-start gap-4 h-full">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCorrect ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                  }`}>
                  {isCorrect ? <Zap className="w-5 h-5 text-emerald-400" /> : <ShieldCheck className="w-5 h-5 text-rose-400" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-widest mb-2 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCorrect ? 'Logic Verified' : 'Logic Correction'}
                  </h4>
                  <p className="text-zinc-300 text-sm font-medium leading-relaxed">{currentQuestion.explanation}</p>
                  {answerTime && (
                    <div className="flex items-center mt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <Clock className="h-3 w-3 mr-2" />
                      Verification Latency: {Math.round(answerTime / 1000)}s
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-end pt-4 border-t border-zinc-800 mt-auto"
          >
            <button
              onClick={handleNext}
              className="group flex items-center px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl transition-all font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
            >
              <span className="mr-3">{currentMCQIndex < mcqQuestions.length - 1 ? 'Next Challenge' : 'Initialize IDE'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
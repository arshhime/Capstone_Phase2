import React, { useState } from 'react';
import { CheckCircle, XCircle, Code2, BookOpen, Lightbulb, RotateCcw, Zap, Target, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  optimalSolution?: string;
}

interface OptimalSolutionProps {
  problem: Problem;
  onSolutionFeedback: (worked: boolean) => void;
  solutionWorked: boolean | null;
}

export default function OptimalSolution({ problem, onSolutionFeedback, solutionWorked }: OptimalSolutionProps) {
  const [language, setLanguage] = useState('python');

  const optimalSolutions = {
    python: `def twoSum(nums, target):
    """
    Optimal Solution using Hash Map
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        # Check if complement exists in hash map
        if complement in num_map:
            return [num_map[complement], i]
        
        # Store current number and its index
        num_map[num] = i
    
    return []  # No solution found`,

    javascript: `function twoSum(nums, target) {
    /**
     * Optimal Solution using Hash Map
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    const numMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists in hash map
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        
        // Store current number and its index
        numMap.set(nums[i], i);
    }
    
    return []; // No solution found
}`,

    java: `class Solution {
    /**
     * Optimal Solution using HashMap
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            // Check if complement exists in hash map
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            
            // Store current number and its index
            numMap.put(nums[i], i);
        }
        
        return new int[]{}; // No solution found
    }
}`,

    cpp: `class Solution {
public:
    /**
     * Optimal Solution using unordered_map
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            // Check if complement exists in hash map
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            
            // Store current number and its index
            numMap[nums[i]] = i;
        }
        
        return {}; // No solution found
    }
};`
  };

  const languages = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' }
  ];

  const approaches = [
    {
      name: 'Brute Force',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Check every pair of numbers to find the target sum.',
      pros: ['Simple to understand', 'No extra space needed'],
      cons: ['Inefficient for large arrays', 'Quadratic time complexity']
    },
    {
      name: 'Hash Map (Optimal)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      description: 'Use a hash map to store complements and find the solution in one pass.',
      pros: ['Linear time complexity', 'Single pass through array'],
      cons: ['Uses extra space for hash map']
    }
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header Station */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Post-Solve Engine</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Performance Analysis & Optimization</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950 p-1.5 rounded-xl border border-white/5">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${language === lang.id
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Module */}
        <AnimatePresence mode="wait">
          {solutionWorked === null ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-violet-600/10 border border-violet-500/20 rounded-2xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Verify Outcome</h4>
                  <p className="text-zinc-400 text-xs font-medium">Did your implementation pass all test cases in production?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onSolutionFeedback(true)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                >
                  Confirm Success
                </button>
                <button
                  onClick={() => onSolutionFeedback(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-rose-600 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/5"
                >
                  Report Failure
                </button>
              </div>
            </motion.div>
          ) : solutionWorked === true ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Objective Completed</h4>
                <p className="text-zinc-400 text-xs font-medium">Advanced algorithmic logic confirmed. Accuracy: 100%.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="failure"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-1">Logic Drift Detected</h4>
                  <p className="text-zinc-400 text-xs font-medium">Anomaly identified in implementation. Study the optimal blueprint below.</p>
                </div>
              </div>
              <button
                onClick={() => onSolutionFeedback(false)}
                className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Initialize Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analysis Workspace */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-8 space-y-12">
        {/* Solution Architectures */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-violet-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-white tracking-tight">Solution Architectures</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {approaches.map((approach, index) => (
              <div key={index} className={`p-6 rounded-3xl border relative transition-all group hover:scale-[1.02] ${approach.name.includes('Optimal')
                  ? 'bg-violet-600/10 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]'
                  : 'bg-zinc-900 border-white/5'
                }`}>
                {approach.name.includes('Optimal') && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-violet-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Recommended Path
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-white text-lg">{approach.name}</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex flex-col items-end">
                      <span className="text-violet-400 font-mono">T: {approach.timeComplexity}</span>
                      <span className="text-fuchsia-400 font-mono">S: {approach.spaceComplexity}</span>
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">{approach.description}</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] block mb-2">Capabilities</span>
                      <ul className="space-y-1.5">
                        {approach.pros.map((pro, i) => (
                          <li key={i} className="text-[11px] text-emerald-400/80 font-medium flex gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] block mb-2">Trade-offs</span>
                      <ul className="space-y-1.5">
                        {approach.cons.map((con, i) => (
                          <li key={i} className="text-[11px] text-rose-400/80 font-medium flex gap-2">
                            <div className="w-1 h-1 rounded-full bg-rose-500 mt-1.5"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blueprint Viewer */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-fuchsia-600 rounded-full"></div>
              <h3 className="text-lg font-bold text-white tracking-tight">Technical Blueprint</h3>
            </div>
            <div className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-1 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Read Only</span>
            </div>
          </div>
          <div className="relative group/code">
            <div className="absolute top-0 right-0 p-4 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
              <button className="p-2 bg-zinc-800 hover:bg-violet-600 text-zinc-400 hover:text-white rounded-lg transition-all border border-white/10">
                <Zap className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-zinc-900 rounded-[32px] p-8 border border-white/5 overflow-hidden shadow-inner">
              <pre className="text-zinc-100 font-mono text-sm leading-relaxed overflow-x-auto scroll-none">
                <code className="block py-4">{optimalSolutions[language as keyof typeof optimalSolutions]}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Intelligence Summary */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-white tracking-tight">Intelligence Summary</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "The hash map approach reduces time complexity from O(n²) to O(n) by trading space for time.",
              "We store each number and its index as we iterate, checking if the complement exists.",
              "This ensures we don't use the same element twice and find the solution in a single pass.",
              "Hash map lookups are O(1) on average, making this the most efficient solution."
            ].map((insight, idx) => (
              <div key={idx} className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 flex gap-4 hover:border-violet-500/20 transition-colors">
                <div className="w-6 h-6 rounded-lg bg-zinc-950 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-violet-500">{idx + 1}</span>
                </div>
                <p className="text-zinc-400 text-xs font-medium leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
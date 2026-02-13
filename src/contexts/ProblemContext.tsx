import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Problem, MCQQuestion, problems } from '../data/problems';
import axios from 'axios';

interface ProblemContextType {
  currentProblem: Problem | null;
  problems: Problem[];
  allProblems: Problem[];
  mcqQuestions: MCQQuestion[];
  currentMCQIndex: number;
  setCurrentProblem: (problem: Problem) => void;
  nextMCQ: () => void;
  resetMCQ: () => void;
  selectProblem: (id: string) => void;
  fetchProblem: (slug: string) => Promise<void>;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [allProblems, setAllProblems] = useState<Problem[]>(problems);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(problems[0]);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);

  const mcqQuestions = useMemo(() => currentProblem?.mcqs || [], [currentProblem]);

  const nextMCQ = () => {
    setCurrentMCQIndex(prev => Math.min(prev + 1, mcqQuestions.length - 1));
  };

  const resetMCQ = () => {
    setCurrentMCQIndex(0);
  };

  const selectProblem = (id: string) => {
    const problem = allProblems.find(p => p.id === id);
    if (problem) {
      setCurrentProblem(problem);
      setCurrentMCQIndex(0);
    }
  };

  const fetchProblem = async (slug: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/problems/fetch', {
        title_slug: slug
      });

      if (response.data.success) {
        setAllProblems(prev => [...prev, response.data.problem]);
        setCurrentProblem(response.data.problem);
        setCurrentMCQIndex(0);
      } else {
        console.error('Failed to fetch problem:', response.data.error);
        alert(`Error: ${response.data.error}`);
      }
    } catch (err: any) {
      console.error('Error fetching problem:', err);
      alert(`Connection Error: ${err.message}. Is the backend running on port 8000?`);
    }
  };

  return (
    <ProblemContext.Provider value={{
      currentProblem,
      problems: allProblems,
      allProblems,
      mcqQuestions,
      currentMCQIndex,
      setCurrentProblem,
      nextMCQ,
      resetMCQ,
      selectProblem,
      fetchProblem
    }}>
      {children}
    </ProblemContext.Provider>
  );
}

export function useProblem() {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error('useProblem must be used within a ProblemProvider');
  }
  return context;
}
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Cpu, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center overflow-hidden relative">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"></div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
          <Bot className="w-8 h-8 text-violet-500" />
          <span className="text-white">Kshitij<span className="text-violet-500">Agent</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Practice
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            AI Agent
          </button>
          <button
            onClick={() => navigate('/login')}
            className="glass-button px-6 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            Next Generation AI Architecture
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6">
            Build Intelligent <br />
            <span className="text-gradient">Agentic Systems</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Deploy autonomous agents powered by LangGraph and RAG.
            Experience strict reasoning and grounded answers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/chat')}
              className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold text-lg transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center gap-2"
            >
              Launch Console <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 glass-button rounded-full text-white font-semibold text-lg">
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl"
        >
          {[
            { icon: Cpu, title: 'LangGraph Core', desc: 'Stateful multi-actor orchestration for complex workflows.' },
            { icon: Zap, title: 'Fast Retrieval', desc: 'Optimized RAG pipeline with sub-millisecond latency.' },
            { icon: Bot, title: 'Agentic Behavior', desc: 'Autonomous reasoning and tool use capabilities.' }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl text-left hover:bg-zinc-800/50 transition-colors">
              <feature.icon className="w-10 h-10 text-violet-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerProps {
  running: boolean;
}

export default function Timer({ running }: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: any;

    if (running) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [running]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/5 shadow-inner backdrop-blur-sm group hover:border-violet-500/20 transition-all">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${running
          ? 'bg-violet-600/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)] animate-pulse'
          : 'bg-zinc-950 text-zinc-600'
        }`}>
        <Clock className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Elapsed Time</div>
        <span className="text-white font-mono text-lg font-bold tracking-tight group-hover:text-violet-300 transition-colors">
          {formatTime(time)}
        </span>
      </div>
      {running && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="ml-2 w-1.5 h-1.5 rounded-full bg-violet-600"
        ></motion.div>
      )}
    </div>
  );
}
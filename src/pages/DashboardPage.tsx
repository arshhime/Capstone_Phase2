import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, TrendingUp, Code2, Zap, ArrowRight, Star, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const stats = [
        { label: 'Problems Solved', value: user?.solvedProblems || 12, icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Accuracy Rate', value: `${user?.accuracy || 85}%`, icon: Target, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Avg. Time', value: '12m 34s', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Streak', value: '7 days', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10' }
    ];

    const recommendedProblems = [
        { id: '1', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'], success: 89, time: '15m' },
        { id: '2', title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List'], success: 92, time: '10m' },
        { id: '3', title: 'Binary Tree Inorder Traversal', difficulty: 'Medium', tags: ['Tree', 'Recursion'], success: 85, time: '20m' }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
            <Navigation />
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10 p-6 md:p-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold tracking-tight"
                        >
                            Developer <span className="text-violet-500">Console</span>
                        </motion.h1>
                        <p className="text-zinc-500 mt-2">Welcome back, {user?.name || 'Kshitij'}. Here's your performance overview.</p>
                    </div>
                </header>

                {/* Main Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] relative group hover:bg-white/[0.04] transition-all"
                        >
                            <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Learning Path */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass-panel rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-violet-500" />
                                    Active Learning Path
                                </h2>
                                <button className="text-sm text-violet-500 font-medium hover:text-violet-400">View Path</button>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 flex flex-col md:flex-row items-center gap-8">
                                <div className="w-32 h-32 rounded-full border-8 border-violet-600/30 border-t-violet-500 flex items-center justify-center relative">
                                    <span className="text-2xl font-bold">68%</span>
                                </div>
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <h3 className="text-2xl font-bold">Data Structures & Algorithms</h3>
                                    <p className="text-zinc-400 max-w-md">You're making great progress on Hash Tables. Up next: Graph Theory foundations.</p>
                                    <button
                                        onClick={() => navigate('/chat')}
                                        className="px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 mx-auto md:mx-0"
                                    >
                                        Continue Learning <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Recommended for You</h2>
                            </div>
                            <div className="grid gap-4">
                                {recommendedProblems.map((prob, i) => (
                                    <motion.div
                                        key={prob.id}
                                        whileHover={{ x: 10 }}
                                        className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-violet-500/50 transition-colors">
                                                <Code2 className="w-5 h-5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{prob.title}</h4>
                                                <div className="flex gap-2 mt-1">
                                                    {prob.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block text-right">
                                                <div className={`text-xs font-bold ${prob.difficulty === 'Easy' ? 'text-green-500' : 'text-yellow-500'}`}>{prob.difficulty}</div>
                                                <div className="text-zinc-500 text-[10px] mt-0.5">{prob.success}% Success</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-violet-600 transition-all">
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Insights & Activity */}
                    <div className="space-y-8">
                        <section className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Skill Distribution
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Arrays', level: 90, color: 'bg-green-500' },
                                    { name: 'Strings', level: 75, color: 'bg-blue-500' },
                                    { name: 'Hash Tables', level: 60, color: 'bg-violet-500' },
                                    { name: 'Sorting', level: 45, color: 'bg-fuchsia-500' }
                                ].map(skill => (
                                    <div key={skill.name} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-zinc-400">{skill.name}</span>
                                            <span>{skill.level}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.level}%` }}
                                                className={`h-full ${skill.color}`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-violet-600 mt-2 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                                        <div>
                                            <p className="text-sm font-medium">Solved "Two Sum" in 14 minutes</p>
                                            <p className="text-xs text-zinc-500 mt-1">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, TrendingUp, Code2, Zap, ArrowRight, Star, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProblem } from '../contexts/ProblemContext';
import Navigation from '../components/Navigation';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { selectProblem, fetchProblem, problems: allProblems } = useProblem();
    const [titleSlug, setTitleSlug] = React.useState('');
    const [isFetching, setIsFetching] = React.useState(false);

    const handleProblemClick = (id: string) => {
        selectProblem(id);
        navigate('/ide');
    };

    const handleFetchProblem = async () => {
        if (!titleSlug.trim()) return;
        setIsFetching(true);
        await fetchProblem(titleSlug);
        setIsFetching(false);
        setTitleSlug('');
        navigate('/ide');
    };

    const stats = [
        { label: 'Problems Solved', value: user?.solvedProblems || 12, icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Accuracy Rate', value: `${user?.accuracy || 85}%`, icon: Target, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Avg. Time', value: '12m 34s', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Streak', value: '7 days', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10' }
    ];

    const recommendedProblems = allProblems.slice(0, 5); // Use first 5 from our dynamic list

    const quickImportSlugs = [
        "two-sum", "palindrome-number", "roman-to-integer", "longest-common-prefix",
        "valid-parentheses", "merge-two-sorted-lists", "remove-duplicates-from-sorted-array",
        "remove-element", "find-the-index-of-the-first-occurrence-in-a-string",
        "search-insert-position", "length-of-last-word", "plus-one", "add-binary",
        "sqrtx", "climbing-stairs", "remove-duplicates-from-sorted-list",
        "merge-sorted-array", "binary-tree-inorder-traversal", "same-tree",
        "symmetric-tree", "maximum-depth-of-binary-tree", "convert-sorted-array-to-binary-search-tree",
        "balanced-binary-tree", "minimum-depth-of-binary-tree", "path-sum"
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
                                        onClick={() => handleProblemClick('1')}
                                        className="px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 mx-auto md:mx-0"
                                    >
                                        Continue Learning <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Import from LeetCode</h2>
                            </div>
                            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    value={titleSlug}
                                    onChange={(e) => setTitleSlug(e.target.value)}
                                    placeholder="Enter LeetCode title slug (e.g., two-sum)"
                                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-mono"
                                />
                                <button
                                    onClick={handleFetchProblem}
                                    disabled={isFetching || !titleSlug}
                                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {isFetching ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <Zap className="w-4 h-4" />
                                    )}
                                    Fetch Problem
                                </button>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Discover Problems (Import from LeetCode)</h2>
                                <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-1 rounded font-bold uppercase tracking-tighter">Auto-Gen Logic</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {quickImportSlugs.map(slug => (
                                    <button
                                        key={slug}
                                        onClick={async () => {
                                            setTitleSlug(slug);
                                            setIsFetching(true);
                                            await fetchProblem(slug);
                                            setIsFetching(false);
                                            setTitleSlug('');
                                            navigate('/ide');
                                        }}
                                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 hover:text-violet-400 transition-all"
                                    >
                                        {slug}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Recommended for You</h2>
                            </div>
                            <div className="grid gap-4">
                                {recommendedProblems.map((prob: any) => (
                                    <motion.div
                                        key={prob.id}
                                        whileHover={{ x: 10 }}
                                        onClick={() => handleProblemClick(prob.id)}
                                        className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-violet-500/50 transition-colors">
                                                <Code2 className="w-5 h-5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{prob.title}</h4>
                                                <div className="flex gap-2 mt-1">
                                                    {(prob.tags || []).map((tag: any) => (
                                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block text-right">
                                                <div className={`text-xs font-bold ${prob.difficulty === 'Easy' ? 'text-green-500' : prob.difficulty === 'Medium' ? 'text-yellow-500' : 'text-rose-500'}`}>{prob.difficulty}</div>
                                                <div className="text-zinc-500 text-[10px] mt-0.5">Community Favorite</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-violet-600 transition-all">
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
                                {(user?.skillDistribution?.length ? user.skillDistribution : [
                                    { name: 'Arrays', level: 90 },
                                    { name: 'Strings', level: 75 },
                                    { name: 'Hash Tables', level: 60 },
                                    { name: 'Sorting', level: 45 }
                                ]).map((skill, index) => {
                                    const colors = ['bg-green-500', 'bg-blue-500', 'bg-violet-500', 'bg-fuchsia-500'];
                                    const color = colors[index % colors.length];
                                    return (
                                        <div key={skill.name} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-zinc-400">{skill.name}</span>
                                                <span>{skill.level}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.level}%` }}
                                                    className={`h-full ${color}`}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {(user?.recentActivity?.length ? user.recentActivity : []).map((activity, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className={`w-2 h-2 rounded-full mt-2 shadow-[0_0_10px_rgba(139,92,246,0.5)] ${activity.status === 'Solved' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.status} "{activity.title}" {activity.timeSpent ? `in ${activity.timeSpent}` : ''}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{new Date(activity.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {!user?.recentActivity?.length && (
                                    <p className="text-zinc-500 text-sm">No recent activity.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

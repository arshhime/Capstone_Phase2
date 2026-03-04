import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, TrendingUp, Code2, Zap, ArrowRight, Star, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProblem } from '../contexts/ProblemContext';
import Navigation from '../components/Navigation';
import RadarChart from '../components/RadarChart';
import OnboardingModal from '../components/OnboardingModal';

interface PredictionResponse {
    success_probability: number;
    recommendation: string;
    confidence: string;
    error?: string;
}

// Define color palettes for skills
const SKILL_COLORS = [
    'rgb(34, 197, 94)',   // Green
    'rgb(59, 130, 246)',  // Blue  
    'rgb(168, 85, 247)',  // Purple
    'rgb(236, 72, 153)',  // Pink
    'rgb(251, 146, 60)',  // Orange
    'rgb(234, 179, 8)',   // Yellow
    'rgb(20, 184, 166)',  // Teal
    'rgb(239, 68, 68)',   // Red
    'rgb(99, 102, 241)',  // Indigo
    'rgb(217, 70, 239)',  // Fuchsia
];


const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { selectProblem, fetchProblem, problems: allProblems } = useProblem();
    const [titleSlug, setTitleSlug] = React.useState('');
    const [isFetching, setIsFetching] = React.useState(false);
    const [userStats, setUserStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [showOnboarding, setShowOnboarding] = React.useState(false);
    const [recommendations, setRecommendations] = React.useState<any[]>([]);
    const [predictions, setPredictions] = React.useState<Record<string, PredictionResponse>>({});

    // Fetch user stats on mount
    React.useEffect(() => {
        const fetchUserStats = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                // Fetch Stats
                const statsResponse = await fetch(`http://localhost:5001/api/users/${user.id}/stats`);
                if (statsResponse.ok) {
                    const data = await statsResponse.json();
                    setUserStats(data);
                }

                // Fetch Recommendations
                const recResponse = await fetch(`http://localhost:5001/api/users/${user.id}/recommendations`);
                if (recResponse.ok) {
                    const recData = await recResponse.json();
                    if (Array.isArray(recData)) {
                        setRecommendations(recData);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, [user?.id]);

    // Fetch AI predictions once recommendations load
    React.useEffect(() => {
        if (recommendations.length === 0) return;
        const userId = user?.id ?? 'default_user';

        const fetchPredictions = async () => {
            const newPredictions: Record<string, PredictionResponse> = {};
            await Promise.all(recommendations.map(async (prob: any) => {
                try {
                    const res = await axios.post('http://localhost:5002/api/predict', {
                        userId,
                        problemId: prob.id
                    });
                    newPredictions[prob.id] = res.data;
                } catch (e) {
                    console.error(`Prediction failed for problem ${prob.id}`, e);
                }
            }));
            setPredictions(prev => ({ ...prev, ...newPredictions }));
        };

        fetchPredictions();
    }, [recommendations, user?.id]);

    React.useEffect(() => {
        if (userStats?.user) {
            const u = userStats.user;
            // Check if new user: 0 interactions AND no preferred companies
            const hasInteractions = u.totalInteractions > 0;
            const hasPreferred = u.preferredCompanies && Object.keys(u.preferredCompanies).length > 0;

            if (!hasInteractions && !hasPreferred) {
                setShowOnboarding(true);
            }
        }
    }, [userStats]);

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        // Refresh stats to reflect new skills/preferences
        // window.location.reload(); // Simple refresh or re-fetch
        // Re-fetching is better but reload ensures full state sync
        window.location.reload();
    };

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

    // Shuffle skills for Radar Chart
    const shuffledSkills = React.useMemo(() => {
        const skills = userStats?.stats?.top10Skills?.length
            ? [...userStats.stats.top10Skills]
            : [
                { name: 'Arrays', level: 0 },
                { name: 'Strings', level: 0 },
                { name: 'Hash Tables', level: 0 },
                { name: 'Sorting', level: 0 },
                { name: 'Trees', level: 0 },
                { name: 'Graphs', level: 0 },
                { name: 'DP', level: 0 },
                { name: 'Greedy', level: 0 },
                { name: 'Backtrack', level: 0 },
                { name: 'Math', level: 0 },
            ];

        // Randomize order (Fisher-Yates)
        for (let i = skills.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [skills[i], skills[j]] = [skills[j], skills[i]];
        }
        return skills;
    }, [userStats?.stats?.top10Skills]);

    const stats = [
        { label: 'Problems Solved', value: userStats?.user?.solvedProblems || user?.solvedProblems || 0, icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Accuracy Rate', value: `${userStats?.user?.accuracy || (user?.accuracy ? Math.round(user.accuracy * 100) : 0)}%`, icon: Target, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Avg. Time', value: userStats?.stats?.avgTime || '0m 0s', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Streak', value: `${userStats?.stats?.streak || 0} days`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10' }
    ];

    const recommendedProblems = recommendations.length > 0 ? recommendations : allProblems.slice(0, 5); // Fallback to context if empty

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
                            {user?.name || 'User'}'s <span className="text-violet-500">Dashboard</span>
                        </motion.h1>
                        <p className="text-zinc-500 mt-2">Welcome back, {user?.name || 'User'}. Here's your performance overview.</p>
                    </div>
                </header>

                {/* Main Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        // Skeleton Stats Cards
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] animate-pulse">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 mb-4"></div>
                                <div className="h-4 bg-zinc-800 rounded w-24 mb-2"></div>
                                <div className="h-8 bg-zinc-800 rounded w-16"></div>
                            </div>
                        ))
                    ) : (
                        stats.map((stat, i) => (
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
                        ))
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Learning Path */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass-panel rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    Skill Distribution
                                </h2>
                            </div>
                            <div className="p-6 bg-zinc-900/40 w-full mx-auto rounded-2xl">
                                <div className="flex flex-row items-center justify-between gap-0 relative">
                                    {/* Chart */}
                                    <div className="flex-1 -ml-12 h-[350px] flex items-center justify-center">
                                        <RadarChart skills={shuffledSkills} colors={SKILL_COLORS} size={450} />
                                    </div>

                                    {/* Legend */}
                                    <div className="flex-shrink-0 w-48 space-y-3 z-10 bg-zinc-950/50 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Skill Breakdown</h4>
                                        {shuffledSkills.map((skill: any, i: number) => {
                                            const color = SKILL_COLORS[i % SKILL_COLORS.length];
                                            return (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] flex-shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}></div>
                                                    <div className="flex items-center gap-2 w-full">
                                                        <span className="text-xs font-bold truncate" style={{ color }}>{skill.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>



                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Top Picks for You</h2>
                            </div>
                            <div className="grid gap-4">
                                {recommendedProblems.map((prob: any) => (
                                    <motion.div
                                        key={prob.id}
                                        whileHover={{ x: 10 }}
                                        onClick={() => handleProblemClick(prob.id)}
                                        className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between group cursor-pointer relative z-0 hover:z-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-violet-500/50 transition-colors">
                                                <Code2 className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold group-hover:text-violet-300 transition-colors flex items-center gap-2">
                                                    {prob.title}
                                                    {predictions[prob.id] && !predictions[prob.id].error && (
                                                        <Target className="w-3.5 h-3.5 text-violet-400 opacity-60 group-hover:opacity-100" />
                                                    )}
                                                </h4>
                                                <div className="flex gap-2 mt-1">
                                                    {(prob.tags || []).slice(0, 3).map((tag: any) => (
                                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block text-right">
                                                <div className={`text-xs font-bold ${prob.difficulty === 'Easy' ? 'text-green-500' :
                                                        prob.difficulty === 'Medium' ? 'text-yellow-500' :
                                                            'text-rose-500'
                                                    }`}>{prob.difficulty}</div>
                                                {predictions[prob.id] && !predictions[prob.id].error ? (
                                                    <div className={`text-[10px] font-bold mt-0.5 ${predictions[prob.id].success_probability >= 70 ? 'text-emerald-400' :
                                                            predictions[prob.id].success_probability >= 40 ? 'text-amber-400' :
                                                                'text-rose-400'
                                                        }`}>{predictions[prob.id].success_probability}% Success</div>
                                                ) : (
                                                    <div className="text-zinc-500 text-[10px] mt-0.5">Personalized Pick</div>
                                                )}
                                            </div>
                                            <div className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-violet-600 transition-all">
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform group-hover:text-white" />
                                            </div>
                                        </div>

                                        {/* AI Prediction Tooltip */}
                                        {predictions[prob.id] && !predictions[prob.id].error && (
                                            <div className="absolute right-0 bottom-full mb-2 w-64 p-4 bg-zinc-950/95 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] pointer-events-none">
                                                <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
                                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1">
                                                        <Target className="w-3 h-3" />
                                                        Success Chance
                                                    </span>
                                                    <span className={`text-sm font-bold ${predictions[prob.id].success_probability >= 70 ? 'text-emerald-400' :
                                                            predictions[prob.id].success_probability >= 40 ? 'text-amber-400' :
                                                                'text-rose-400'
                                                        }`}>{predictions[prob.id].success_probability}%</span>
                                                </div>
                                                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                                                    {predictions[prob.id].recommendation}
                                                </p>
                                                <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-600">
                                                    <Zap className="w-3 h-3 text-violet-500" />
                                                    <span>AI Confidence: <span className="text-zinc-400">{predictions[prob.id].confidence}</span></span>
                                                </div>
                                                <div className="absolute right-6 -bottom-1 w-2 h-2 bg-zinc-800 rotate-45"></div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Insights & Activity */}
                    <div className="space-y-8">
                        <section className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-violet-500" />
                                Rating
                            </h3>
                            <div className="flex flex-col items-center py-4">
                                {(() => {
                                    const rating = Math.floor(userStats?.user?.userRating || user?.userRating || 1200);
                                    // Calculate progress: 0 = 0%, 3000 = 100% (linear scale)
                                    const minRating = 0;
                                    const maxRating = 3000;
                                    const progress = Math.min(100, Math.max(0, ((rating - minRating) / (maxRating - minRating)) * 100));
                                    const circumference = 2 * Math.PI * 50; // radius = 50
                                    const strokeDashoffset = circumference - (progress / 100) * circumference;

                                    return (
                                        <div className="relative w-32 h-32">
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                {/* Background circle */}
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="50"
                                                    stroke="rgba(139, 92, 246, 0.2)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                />
                                                {/* Progress circle */}
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="50"
                                                    stroke="rgb(139, 92, 246)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold">{rating}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </section>

                        <section className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {(userStats?.stats?.last5Activities?.length ? userStats.stats.last5Activities : []).map((activity: any, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className={`w-2 h-2 rounded-full mt-2 shadow-[0_0_10px_rgba(139,92,246,0.5)] ${activity.status === 'Solved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.status} "{activity.title}" in {activity.timeTaken}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{activity.timeAgo}</p>
                                        </div>
                                    </div>
                                ))}
                                {!userStats?.stats?.last5Activities?.length && (
                                    <p className="text-zinc-500 text-sm">No recent activity.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {showOnboarding && user?.id && (
                <OnboardingModal userId={user.id} onComplete={handleOnboardingComplete} />
            )}
        </div>
    );
};

export default Dashboard;

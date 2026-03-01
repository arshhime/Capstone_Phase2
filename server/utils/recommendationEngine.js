import User from '../models/User.js';
import Problem from '../models/Problem.js';
import { spawn } from 'child_process';
import path from 'path';
import Interaction from '../models/Interaction.js';

// Constants for Scoring
const WEIGHTS = {
    RATING: 0.25,
    STRONGEST: 0.15,
    WEAKEST: 0.15,
    COMPANY: 0.20,
    MISSING: 0.15,
    RECENT: 0.10
};

const DIFFICULTY_MAP = {
    'Easy': 1000,
    'Medium': 1500,
    'Hard': 2000
};

let cachedProblems = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function getProblems() {
    const now = Date.now();
    if (!cachedProblems || (now - lastCacheTime > CACHE_TTL)) {
        console.log("Fetching problems for recommendation engine...");
        // Fetch only needed fields to save memory
        cachedProblems = await Problem.find({}, {
            id: 1,
            difficulty: 1,
            tags: 1,
            companies: 1
        }).lean();
        lastCacheTime = now;
        console.log(`Cached ${cachedProblems.length} problems.`);
    }
    return cachedProblems;
}

// Function to call Python script
const calculateRetention = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const interactions = await Interaction.find({ userId }).lean();
            if (!interactions || interactions.length === 0) {
                return resolve({});
            }

            const scriptPath = path.resolve('..', 'skill_decay_model', 'calculate_retention.py');
            const pythonProcess = spawn('python', [scriptPath]);

            let dataString = '';
            let errorString = '';

            pythonProcess.stdout.on('data', (data) => {
                dataString += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorString += data.toString();
            });

            pythonProcess.on('error', (err) => {
                console.error(`[RecEngine] Failed to start python process: ${err}`);
                reject(err);
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python script exited with code ${code}: ${errorString}`);
                    // Fallback: Return empty map if script fails
                    resolve({});
                } else {
                    try {
                        const results = JSON.parse(dataString);
                        resolve(results);
                    } catch (e) {
                        console.error("Failed to parse Python output:", e);
                        resolve({}); // Fallback
                    }
                }
            });

            // Send interactions to Python stdin
            const payload = JSON.stringify({ interactions });
            pythonProcess.stdin.write(payload);
            pythonProcess.stdin.end();

        } catch (error) {
            console.error("Error executing Python script:", error);
            resolve({});
        }
    });
};

export const updateUserRecommendations = async (userId) => {
    try {
        console.log(`[RecEngine] Starting update for ${userId}`);
        const user = await User.findOne({ userId });
        if (!user) {
            console.error(`User ${userId} not found for recommendation update.`);
            return;
        }

        const problems = await getProblems();
        const userRating = user.userRating || 1200;

        // 0. Calculate Retention for Solved Problems
        const retentionMap = await calculateRetention(userId);

        // 1. Prepare User Profile Data

        // Skills (Sorted by level)
        const sortedSkills = [...(user.skillDistribution || [])].sort((a, b) => b.level - a.level);
        const strongestTags = new Set(sortedSkills.slice(0, 3).map(s => s.name));
        const weakestTags = new Set(sortedSkills.filter(s => s.level > 0).slice(-3).map(s => s.name));
        const knownTags = new Set(sortedSkills.map(s => s.name));

        // Preferred Companies (Top 5)
        const companyEntries = user.preferredCompanies ? Array.from(user.preferredCompanies.entries()) : [];
        const topCompanies = new Set(
            companyEntries.sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0].replace(/_/g, '.')) // Revert safe key to match problem data
        );

        // Recent Activity Context
        const recentTags = new Set();
        const recentCompanies = new Set();

        const problemMap = new Map(problems.map(p => [p.id, p]));

        (user.recentActivity || []).slice(0, 5).forEach(activity => {
            const p = problemMap.get(activity.problemId);
            if (p) {
                if (p.tags) p.tags.forEach(t => recentTags.add(t));
                if (p.companies) p.companies.forEach(c => recentCompanies.add(c));
            }
        });

        // 2. Score Every Problem
        const scores = new Map();

        for (const problem of problems) {
            let score = 0;

            // Check if solved
            const isSolved = user.uniqueSolvedIds && user.uniqueSolvedIds.includes(problem.id);

            if (isSolved) {
                // Determine retention score
                // Logic: score = -1 * retention
                // Default retention to 1.0 (fully remembered) if not found in map
                const retention = retentionMap[problem.id] !== undefined ? retentionMap[problem.id] : 1.0;
                score = -1 * retention;
            } else {
                // Standard Recommendation Logic (Positive Scores)

                // A. User Rating Match (0.25)
                const probDiffVal = DIFFICULTY_MAP[problem.difficulty] || 1500;
                const diff = Math.abs(userRating - probDiffVal);
                const ratingScore = Math.max(0, 1 - (diff / 1000));
                score += WEIGHTS.RATING * ratingScore;

                // B. Strongest Skills (0.15)
                const hasStrongest = problem.tags && problem.tags.some(t => strongestTags.has(t));
                if (hasStrongest) score += WEIGHTS.STRONGEST;

                // C. Weakest Skills (0.15)
                const hasWeakest = problem.tags && problem.tags.some(t => weakestTags.has(t));
                if (hasWeakest) score += WEIGHTS.WEAKEST;

                // D. Preferred Companies (0.20)
                const hasCompany = problem.companies && problem.companies.some(c => topCompanies.has(c));
                if (hasCompany) score += WEIGHTS.COMPANY;

                // E. Missing Skills (0.15)
                const hasMissing = problem.tags && problem.tags.some(t => !knownTags.has(t));
                if (hasMissing) score += WEIGHTS.MISSING;

                // F. Recent Activity (0.10)
                const matchesRecent = (
                    (problem.tags && problem.tags.some(t => recentTags.has(t))) ||
                    (problem.companies && problem.companies.some(c => recentCompanies.has(c)))
                );
                if (matchesRecent) score += WEIGHTS.RECENT;
            }

            scores.set(problem.id, parseFloat(score.toFixed(4)));
        }

        // 3. Save to User
        user.recommendationScores = scores;

        // Since Mongoose Maps update tracking can be tricky, explicitly mark modified
        user.markModified('recommendationScores');

        await user.save();
        console.log(`[RecEngine] Updated recommendations for user ${user.username} (UserId: ${userId})`);

    } catch (error) {
        console.error("[RecEngine] Error updating recommendations:", error);
    }
};

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Interaction from './models/Interaction.js';
import axios from "axios";
import { GoogleGenerativeAI } from '@google/generative-ai'; // Added Gemini import

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'your-very-secret-key';
const PORT = process.env.PORT || 5001; // Moved PORT declaration up

// --- Middleware ---
app.use(cors()); // Changed cors configuration
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected')) // Updated success message
  .catch(err => console.error('MongoDB connection error:', err)); // Updated error handling

// --- Gemini Setup --- // Added Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

// --- API Routes ---
app.post('/api/ai/hint', async (req, res) => {
  try {
    const { problemTitle, problemDescription, currentCode } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Updated to 2.5 Flash

    const prompt = `
        You are an expert coding tutor. The user is solving the problem: "${problemTitle}".
        Description: ${problemDescription}
        
        Current Code:
        ${currentCode || "No code written yet."}

        Provide a single, short, helpful hint to guide them towards the optimal solution without giving away the answer directly. Focus on the logic or data structure.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ hint: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate hint" });
  }
});
// ... (previous hint endpoint)

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { query, history } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(query);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

// --- Problem Schema ---
const problemSchema = new mongoose.Schema({
  title: String,
  slug: String,
  difficulty: String,
  frequency: Number,
  acceptanceRate: Number,
  topics: [String],
  companies: [String]
});

import Problem from './models/Problem.js';

// --- API Routes ---
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 16-digit userId
    let userId;
    let isUnique = false;
    while (!isUnique) {
      userId = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      const existingId = await User.findOne({ userId });
      if (!existingId) isUnique = true;
    }

    const username = email.split('@')[0];

    const newUser = new User({
      name,
      email,
      username,
      userId,
      password: hashedPassword,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      recentActivity: [],
      skillDistribution: [
        { name: 'Arrays', level: 0 },
        { name: 'Strings', level: 0 },
        { name: 'DP', level: 0 },
        { name: 'Trees', level: 0 }
      ]
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

    // Return user without password and with id
    const userResponse = newUser.toObject();
    userResponse.id = userResponse.userId;
    delete userResponse._id;
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: 'Server error during sign up.' });
  }

});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Ensure user has userId (migration for old users)
    if (!user.userId) {
      let userId;
      let isUnique = false;
      while (!isUnique) {
        userId = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
        const existingId = await User.findOne({ userId });
        if (!existingId) isUnique = true;
      }
      user.userId = userId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    // Return user without password and with id
    const userResponse = user.toObject();
    userResponse.id = userResponse.userId;
    delete userResponse._id;
    delete userResponse.password;

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

app.post('/api/interactions', async (req, res) => {
  try {
    console.log("Interaction Request Body:", req.body); // DEBUG
    const { userId, username, problemId, title, language, submissionStatus, timeTakenSeconds, runtimeMs, memoryUsedKB } = req.body;

    if (!userId || !problemId || !title || !username) {
      console.error("Missing required fields:", { userId, username, problemId, title }); // DEBUG
      return res.status(400).json({ message: "Missing required fields." });
    }

    // --- Advanced User Stats Update ---
    const user = await User.findOne({ userId });
    const problem = await Problem.findOne({ id: problemId }); // Need problem for difficulty/tags

    if (user && problem) {
      // 1. Update Recent Activity (Last 7 days)
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Filter out old activity
      user.recentActivity = user.recentActivity.filter(activity => new Date(activity.timestamp) > oneWeekAgo);

      // Add new activity
      user.recentActivity.push({
        problemId,
        title,
        difficulty: problem.difficulty,
        status: submissionStatus === 1 ? 'Solved' : 'Attempted',
        timestamp: now,
        timeTaken: `${timeTakenSeconds}s`,
        hoursAgo: 0 // This will be calculated on retrieval usually, but we can store 0 for now
      });

      // 2. Update Counts
      user.totalInteractions = (user.totalInteractions || 0) + 1;

      // Ensure unique arrays exist
      if (!user.uniqueAttemptedIds) user.uniqueAttemptedIds = [];
      if (!user.uniqueSolvedIds) user.uniqueSolvedIds = [];

      // Update Solved Problems (Unique Attempted)
      if (!user.uniqueAttemptedIds.includes(problemId)) {
        user.uniqueAttemptedIds.push(problemId);
        user.solvedProblems = user.uniqueAttemptedIds.length;
      }

      // Update Correct Problems (Unique Solved)
      if (submissionStatus === 1 && !user.uniqueSolvedIds.includes(problemId)) {
        user.uniqueSolvedIds.push(problemId);
        user.correctProblems = user.uniqueSolvedIds.length;
      }

      // 3. Update Accuracy
      if (user.totalInteractions > 0) {
        user.accuracy = user.correctProblems / user.totalInteractions;
      }

      // 4. Update Skill Vector
      const difficultyFactor = problem.difficulty === 'Easy' ? 0.3 : (problem.difficulty === 'Medium' ? 0.7 : 1.0);

      if (problem.tags && problem.tags.length > 0) {
        problem.tags.forEach(tag => {
          let skill = user.skillDistribution.find(s => s.name === tag);
          if (!skill) {
            skill = { name: tag, level: 0 };
            user.skillDistribution.push(skill);
          }
          // Enhanced Skill Update:
          // If Solved: Weighted average (20% new) but PREVENT REGRESSION
          // If Failed: Weighted average (5% new)

          if (submissionStatus === 1) {
            const newLevel = (skill.level * 0.80) + (difficultyFactor * 0.20);
            skill.level = Math.max(skill.level, newLevel);
            if (skill.level < difficultyFactor) {
              skill.level += 0.05; // Bonus
            }
          } else {
            skill.level = (skill.level * 0.95) + (difficultyFactor * 0.05);
          }

          // Cap at 1.00
          if (skill.level > 1.0) skill.level = 1.0;
        });
      }

      // 5. Update User Rating (ELO)
      // Scaling: Easy(3/10), Medium(7/6), Hard(10/3)
      let ratingChange = 0;
      if (submissionStatus === 1) {
        // Increment: Easy: 3, Medium: 7, Hard: 10
        ratingChange = problem.difficulty === 'Easy' ? 3 : (problem.difficulty === 'Medium' ? 7 : 10);
      } else {
        // Decrement: Easy: 10, Medium: 6, Hard: 3
        ratingChange = problem.difficulty === 'Easy' ? -10 : (problem.difficulty === 'Medium' ? -6 : -3);
      }
      user.userRating = (user.userRating || 1200) + ratingChange;

      // Clamp rating between 0 and 3000
      user.userRating = Math.max(0, Math.min(3000, user.userRating));

      // 6. Update Experience
      if (user.correctProblems < 100) {
        user.experience = 'Beginner';
      } else if (user.correctProblems <= 600) {
        user.experience = 'Intermediate';
      } else {
        user.experience = 'Advanced';
      }

      await user.save();
    }

    const newInteraction = new Interaction({
      userId,
      username,
      problemId,
      title,
      language,
      submissionStatus, // 1 or 0
      timeTakenSeconds,
      runtimeMs,
      memoryUsedKB
    });

    await newInteraction.save();
    res.status(201).json({ message: "Interaction recorded successfully." });
  } catch (error) {
    console.error("Interaction Error:", error);
    res.status(500).json({ message: "Failed to record interaction." });
  }
});

// Get User Stats for Dashboard
app.get('/api/users/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch all interactions for this user
    const interactions = await Interaction.find({ userId }).sort({ createdAt: -1 });

    // Calculate Average Time (total time / solvedProblems)
    const totalTimeSeconds = interactions.reduce((sum, i) => sum + (i.timeTakenSeconds || 0), 0);
    const avgTimeSeconds = user.solvedProblems > 0 ? Math.round(totalTimeSeconds / user.solvedProblems) : 0;

    // Format avg time as "Xm Ys"
    const avgTimeMinutes = Math.floor(avgTimeSeconds / 60);
    const avgTimeSecondsRemainder = avgTimeSeconds % 60;
    const avgTimeFormatted = `${avgTimeMinutes}m ${avgTimeSecondsRemainder}s`;

    // Calculate Streak from recentActivity (consecutive days with activity)
    let currentStreak = 0;
    if (user.recentActivity && user.recentActivity.length > 0) {
      const sortedActivity = [...user.recentActivity].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let checkDate = new Date(today);
      const activityDates = new Set(
        sortedActivity.map(a => {
          const d = new Date(a.timestamp);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      );

      // Check if there's activity today or yesterday (to allow for streak continuation)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (activityDates.has(today.getTime()) || activityDates.has(yesterday.getTime())) {
        // Start from yesterday if no activity today
        if (!activityDates.has(today.getTime())) {
          checkDate = new Date(yesterday);
        }

        while (activityDates.has(checkDate.getTime())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }

    // Get top 10 skills from skillDistribution
    const top10Skills = (user.skillDistribution || [])
      .sort((a, b) => b.level - a.level)
      .slice(0, 10)
      .map(skill => ({
        name: skill.name,
        level: Math.round(skill.level * 100) // Convert 0-1 to 0-100
      }));

    // Get last 5 activities with time ago and status
    const last5Activities = (user.recentActivity || [])
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map(activity => {
        const now = new Date();
        const activityTime = new Date(activity.timestamp);
        const hoursAgo = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));

        let timeAgo;
        if (hoursAgo < 1) {
          const minutesAgo = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
          timeAgo = `${minutesAgo}m ago`;
        } else if (hoursAgo < 24) {
          timeAgo = `${hoursAgo}h ago`;
        } else {
          const daysAgo = Math.floor(hoursAgo / 24);
          timeAgo = `${daysAgo}d ago`;
        }

        return {
          problemId: activity.problemId,
          title: activity.title,
          difficulty: activity.difficulty,
          status: activity.status, // 'Solved' or 'Attempted'
          timestamp: activity.timestamp,
          timeTaken: activity.timeTaken,
          timeAgo
        };
      });

    res.json({
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        experience: user.experience,
        solvedProblems: user.solvedProblems,
        correctProblems: user.correctProblems,
        accuracy: Math.round(user.accuracy * 100), // Convert to percentage
        userRating: user.userRating,
        totalInteractions: user.totalInteractions
      },
      stats: {
        avgTime: avgTimeFormatted,
        avgTimeSeconds,
        streak: currentStreak,
        top10Skills,
        last5Activities
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/api/leetcode/:slug", async (req, res) => {
  // Deprecated: Fetching from LeetCode directly. 
  // Kept for fallback if needed, but we should use our own DB now.
  try {
    const { slug } = req.params;
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              title
              content
              difficulty
              exampleTestcases
              codeSnippets {
                lang
                langSlug
                code
              }
            }
          }
        `,
        variables: { titleSlug: slug }
      },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    res.json(response.data.data.question);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

app.get("/api/problems", async (req, res) => {
  try {
    const { company, difficulty, topic, search, page = 1, limit = 20 } = req.query;
    let filter = {};

    if (company) filter.companies = { $in: [company] };
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.tags = { $in: [topic] }; // Note: Schema uses 'tags', not 'topics'
    if (search) {
      // Check if search is a number (problem ID)
      const isNumber = /^\d+$/.test(search);
      if (isNumber) {
        // Search by exact ID or IDs that start with the number
        filter.$or = [
          { id: search },
          { id: { $regex: `^${search}`, $options: 'i' } }
        ];
      } else {
        filter.title = { $regex: search, $options: 'i' };
      }
    }

    // Return lightweight objects for list view
    const problems = await Problem.find(filter)
      .select('id title difficulty acceptanceRate percentage tags companies') // Select only needed fields
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Problem.countDocuments(filter);

    res.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findOne({ id: req.params.id });
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

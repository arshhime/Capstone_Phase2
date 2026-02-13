import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'your-very-secret-key';

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

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
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      recentActivity: [
        {
          problemId: '1',
          title: 'Two Sum',
          difficulty: 'Easy',
          status: 'Solved',
          timeSpent: '15m',
          timestamp: new Date(Date.now() - 86400000) // 1 day ago
        }
      ],
      skillDistribution: [
        { name: 'Arrays', level: 90 },
        { name: 'Strings', level: 75 },
        { name: 'Hash Tables', level: 60 },
        { name: 'Sorting', level: 45 }
      ]
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, user: newUser });
  } catch (error) {
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
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

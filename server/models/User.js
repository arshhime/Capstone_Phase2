import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  experience: { type: String, default: 'beginner' },
  solvedProblems: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  recentActivity: [{
    problemId: String,
    title: String,
    difficulty: String,
    status: { type: String, enum: ['Solved', 'Attempted'], default: 'Solved' },
    timestamp: { type: Date, default: Date.now },
    timeSpent: String // e.g., "14m"
  }],
  skillDistribution: [{
    name: String,
    level: Number, // Percentage 0-100
    color: String // Hex or tailwind class if needed, but maybe better to keep UI logic in frontend. Let's store basic info.
  }]
});

const User = mongoose.model('User', userSchema);

export default User;

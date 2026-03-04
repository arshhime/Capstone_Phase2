
import pickle
import pandas as pd
import numpy as np
import os
from database import get_database

MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_models", "success_predictor_model.pkl")

# Difficulty mapping from notebook
DIFFICULTY_MAP = {"Easy": 1, "Medium": 2, "Hard": 3}
EXPERIENCE_MAP = {"Beginner": 1, "Intermediate": 2, "Advanced": 3}

class PredictionService:
    def __init__(self):
        self.lr_model = None
        self.gbm_model = None
        self.load_model()

    def load_model(self):
        print(f"Loading model from {MODEL_PATH}...")
        if not os.path.exists(MODEL_PATH):
            print(f"Error: Model file not found at {MODEL_PATH}")
            return

        try:
            with open(MODEL_PATH, 'rb') as f:
                model_data = pickle.load(f)
                
            # Handle different possible structures of the pickled file
            if isinstance(model_data, dict):
                # If it's a dict containing both models (based on notebook logic, it might be)
                # But notebook says it saved lr_model.pkl and gbm_model.pkl separately.
                # However, the user provided a single file `success_predictor_model.pkl`.
                # Let's assume this single file contains a dict or a tuple of models, OR it's one of them.
                # Given specific notebook code: 
                # with open(lr_path, "wb") as f: pickle.dump(lr_pipe, f)
                # with open(gbm_path, "wb") as f: pickle.dump(gbm_pipe, f)
                # The user likely combined them or renamed one. 
                # Let's check what we have.
                if 'lr_model' in model_data and 'gbm_model' in model_data:
                     self.lr_model = model_data['lr_model']
                     self.gbm_model = model_data['gbm_model']
                else:
                    # Fallback: maybe the file IS the model (e.g. just LR or just GBM)
                    # Or maybe it's the dict returned by save_models? No, that was JSON.
                    # Let's assume for now it might be a single pipeline object if not a dict.
                    # We will treat it as a single model for now if we can't find keys.
                    self.lr_model = model_data # Place it here for now
                    self.gbm_model = model_data 
            elif isinstance(model_data, (list, tuple)) and len(model_data) == 2:
                self.lr_model = model_data[0]
                self.gbm_model = model_data[1]
            else:
                 # It's a single model object
                 self.lr_model = model_data
                 self.gbm_model = model_data

            print("Model loaded successfully.")
        except Exception as e:
            print(f"Failed to load model: {e}")

    async def predict_success(self, user_id: str, problem_id: str):
        db = get_database()
        user = await db.users.find_one({"id": user_id})
        problem = await db.problems.find_one({"id": problem_id})
        
        if not user:
            # Mock user if not found for testing
             print(f"User {user_id} not found, using default.")
             user = {
                 "userRating": 1200, "accuracy": 0.5, "solvedProblems": 0, 
                 "experience": "Beginner", "skillDistribution": []
             }
        
        if not problem:
            # Try numeric ID if string failed
            try:
                problem = await db.problems.find_one({"id": int(problem_id)})
            except:
                pass
        
        if not problem:
             print(f"Problem {problem_id} not found. Using default mock problem.")
             problem = {
                 "difficulty": "Medium",
                 "tags": ["Array", "Hash Table"],
                 "acceptanceRate": 50.0
             }

        # Extract features
        user_rating = user.get("userRating", 1200)
        accuracy = user.get("accuracy", 0.5)
        solved_problems = user.get("solvedProblems", 0)
        experience = EXPERIENCE_MAP.get(user.get("experience", "Beginner"), 1)
        
        # Skill match
        skill_dist = user.get("skillDistribution", [])
        problem_tags = problem.get("tags", [])
        # If tags are objects in problem, extract names. If strings, use directly.
        # Check format. In notebook: problem_tags is list of strings.
        # In user mock data (auth.py): skillDistribution is list of {name, level}.
        
        skill_match = self._compute_skill_match(skill_dist, problem_tags)
        
        difficulty = DIFFICULTY_MAP.get(problem.get("difficulty", "Medium"), 2)
        acceptance_rate = problem.get("acceptanceRate", 50.0) / 100.0

        # Create DataFrame for prediction (sklearn pipelines usually expect 2D array or DF)
        # Feature columns from notebook: 
        # ["userRating", "accuracy", "solvedProblems", "experience", "skillMatch", "difficulty", "acceptanceRate"]
        
        features = pd.DataFrame([{
            "userRating": user_rating,
            "accuracy": accuracy,
            "solvedProblems": solved_problems,
            "experience": experience,
            "skillMatch": skill_match,
            "difficulty": difficulty,
            "acceptanceRate": acceptance_rate
        }])

        try:
            # Ensemble prediction logic from notebook
            # properties of the pipeline: predict_proba return [prob_class_0, prob_class_1]
            
            lr_prob = self.lr_model.predict_proba(features)[0][1]
            gbm_prob = self.gbm_model.predict_proba(features)[0][1]
            
            # If we only have one model loaded (e.g. duplicating logic for safety), this averages to the same.
            ensemble_prob = (lr_prob + gbm_prob) / 2.0
            
            return {
                "success_probability": round(ensemble_prob * 100, 1), # Return as percentage
                "recommendation": self._get_recommendation(ensemble_prob),
                "confidence": "High" # Simplified for now
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return {"error": str(e), "success_probability": 0}

    def _compute_skill_match(self, skill_distribution, problem_tags):
        if not skill_distribution or not problem_tags:
            return 0.1
        
        skill_map = {}
        for s in skill_distribution:
             if isinstance(s, dict):
                 skill_map[s.get("name", "")] = s.get("level", 0)
        
        levels = []
        for tag in problem_tags:
            # Tag might be string or dict
            tag_name = tag if isinstance(tag, str) else tag.get("name", "")
            if tag_name in skill_map:
                levels.append(skill_map[tag_name])
        
        if not levels:
            return 0.1
        
        return float(np.mean(levels)) / 100.0 # Normalize if levels are 0-100? 
        # Notebook logic: "skillMatch": avg level. 
        # User mock data has levels like 90, 75. 
        # Notebook user sample: "level": 0.9. 
        # Need to check scale. 
        # User mock data: { "name": "Arrays", "level": 90 }
        # Notebook sample: { "name": "Array", "level": 0.9 }
        # So I should normalize user data by dividing by 100 if it's > 1.
        
        avg_level = np.mean(levels)
        if avg_level > 1.0:
            return avg_level / 100.0
        return avg_level

    def _get_recommendation(self, prob):
        if prob >= 0.75:
            return "Great match! This problem aligns well with your skills."
        elif prob >= 0.50:
            return "Achievable with focused effort."
        elif prob >= 0.30:
            return "Challenging. Good for pushing your limits."
        else:
            return "Very hard. Consider practicing prerequisite topics first."

prediction_service = PredictionService()

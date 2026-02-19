import json
import os
import sys
import math
from datetime import datetime, timezone

# ==========================================
# CONFIGURATION
# ==========================================

# Base paths (Assuming this script is run from project root)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DISPLAY_PROBLEMS_PATH = os.path.join(BASE_DIR, "display-problems.json")
USERS_PATH = os.path.join(BASE_DIR, "users.json")
INTERACTIONS_PATH = os.path.join(BASE_DIR, "interactions.json")

# Model Parameters
# Ebbinghaus Forgetting Curve: R = e^(-t/S)
RETENTION_THRESHOLD = 0.6  # Trigger revision if retention probability drops below 60%
DEFAULT_STABILITY = 1.0    # Default stability for a new problem (in days)

# Multipliers for successful recall based on difficulty
DIFFICULTY_MULTIPLIER = {
    "Easy": 1.5,
    "Medium": 2.0,
    "Hard": 2.5
}

# Penalty for failed recall
FAILURE_MULTIPLIER = 0.5

# ==========================================
# DATA LOADER
# ==========================================

def load_json(path):
    """Safely loads a JSON file."""
    if not os.path.exists(path):
        print(f"Error: File not found at {path}")
        return []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {path}: {e}")
        return []

def load_all_data():
    """Loads problems, users, and interactions."""
    print("Loading data...")
    problems = load_json(DISPLAY_PROBLEMS_PATH)
    users = load_json(USERS_PATH)
    interactions = load_json(INTERACTIONS_PATH)
    
    print(f"Loaded {len(problems)} problems")
    print(f"Loaded {len(users)} users")
    print(f"Loaded {len(interactions)} interactions")
    
    return problems, users, interactions

def get_interactions_for_user(user_id, all_interactions):
    """Filters interactions for a specific user and sorts by time."""
    user_interactions = [
        i for i in all_interactions 
        if str(i.get("userId")) == str(user_id) or str(i.get("username")) == str(user_id)
    ]
    # Sort by timestamp (assuming ISO format string)
    user_interactions.sort(key=lambda x: x.get("createdAt", ""))
    return user_interactions

def create_problem_map(problems):
    """Creates a lookup map for problems by ID."""
    p_map = {}
    for p in problems:
        # handle both 'id' and '_id'
        ids = []
        if "id" in p: ids.append(str(p["id"]))
        if "_id" in p: ids.append(str(p["_id"]))
        
        for pid in ids:
            p_map[pid] = p
            
    return p_map

# ==========================================
# DECAY MODEL
# ==========================================

class SkillDecayModel:
    def __init__(self, problems_map):
        self.problems_map = problems_map
        # State: {user_id: {problem_id: {stability: float, last_review: datetime}}}
        self.user_states = {}

    def _parse_time(self, time_str):
        try:
            return datetime.fromisoformat(time_str.replace('Z', '+00:00'))
        except:
            return datetime.now(timezone.utc)

    def calculate_retention(self, last_review_time, stability, current_time):
        """
        Calculates retention probability R = e^(-t/S)
        t = days elapsed since last review
        S = stability (memory strength in days)
        """
        if not last_review_time:
            return 0.0
            
        elapsed_days = (current_time - last_review_time).total_seconds() / (86400.0)
        if elapsed_days < 0: elapsed_days = 0 # Should not happen with sorted data
        
        if stability <= 0: return 0.0
        
        # Exponential decay
        retention = math.exp(-elapsed_days / stability)
        return retention

    def calculate_stability_boost(self, difficulty, time_taken_seconds):
        """
        Calculates the stability multiplier based on difficulty and performance.
        """
        # Base multiplier by difficulty
        base = DIFFICULTY_MULTIPLIER.get(difficulty, 1.5)
        
        # Adjust based on time taken (Heuristic: faster is better, but not too fast)
        # Assuming reasonable times: Easy < 300s, Medium < 600s, Hard < 1200s
        # If time is significantly lower than average, boost stability slightly
        
        # Simple heuristic benchmarks (in seconds)
        benchmarks = {"Easy": 300, "Medium": 600, "Hard": 1200}
        benchmark = benchmarks.get(difficulty, 600)
        
        performance_boost = 1.0
        if time_taken_seconds > 0:
            ratio = time_taken_seconds / benchmark
            if ratio < 0.5: # Very fast
                performance_boost = 1.2
            elif ratio < 1.0: # Fast
                performance_boost = 1.1
            elif ratio > 2.0: # Slow
                performance_boost = 0.9
                
        return base * performance_boost

    def process_user_interactions(self, user_id, interactions):
        """
        Replays the history of interactions to build the current memory state.
        interactions: list of interaction objects sorted by time
        """
        if user_id not in self.user_states:
            self.user_states[user_id] = {}
            
        state = self.user_states[user_id]
        
        for interaction in interactions:
            problem_id = str(interaction.get("problemId"))
            
            # Skip if we don't know the problem
            problem_obj = self.problems_map.get(problem_id)
            difficulty = "Medium"
            if problem_obj:
               difficulty = problem_obj.get("difficulty", "Medium")
               
            # Correctness tracking
            is_correct = interaction.get("submissionStatus") == 1
            time_taken = interaction.get("timeTakenSeconds", 0)
            
            timestamp = self._parse_time(interaction.get("createdAt"))
            
            if problem_id not in state:
                # First time seeing problem
                if is_correct:
                    # Initial stability boosted by difficulty and speed
                    boost = self.calculate_stability_boost(difficulty, time_taken)
                    state[problem_id] = {
                        "stability": DEFAULT_STABILITY * boost,
                        "last_review": timestamp
                    }
                else:
                    # Failed attempt
                    state[problem_id] = {
                        "stability": 0.5,
                        "last_review": timestamp
                    }
            else:
                # Review
                current_stability = state[problem_id]["stability"]
                
                if is_correct:
                    # Successful recall
                    boost = self.calculate_stability_boost(difficulty, time_taken)
                    new_stability = current_stability * boost
                else:
                    # Forgetting occurred
                    new_stability = current_stability * FAILURE_MULTIPLIER
                    
                state[problem_id]["stability"] = new_stability
                state[problem_id]["last_review"] = timestamp

    def get_revision_notifications(self, user_id, user_name="there", current_time=None):
        """
        Returns a list of friendly notification strings for problems needing revision.
        """
        if current_time is None:
            current_time = datetime.now(timezone.utc)
            
        if user_id not in self.user_states:
            return []
            
        notifications = []
        state = self.user_states[user_id]
        
        for problem_id, memory in state.items():
            retention = self.calculate_retention(memory["last_review"], memory["stability"], current_time)
            
            if retention < RETENTION_THRESHOLD:
                # Get problem details
                problem_obj = self.problems_map.get(problem_id)
                title = problem_obj.get("title", f"Problem {problem_id}") if problem_obj else f"Problem {problem_id}"
                difficulty = problem_obj.get("difficulty", "Unknown") if problem_obj else "Unknown"
                
                # Calculate days since last review
                elapsed_days = (current_time - memory["last_review"]).total_seconds() / 86400.0
                days_int = int(round(elapsed_days))
                
                # Formulate message
                score_pct = int(retention * 100)
                
                msg = (f"Hi {user_name}, it's been {days_int} days since you solved '{title}' ({difficulty}). "
                       f"Your retention score is {score_pct}%. Time for a quick revision!")
                
                notifications.append({
                    "message": msg,
                    "retention": retention,
                    "problem_id": problem_id
                })
                
        # Sort by urgency (lowest retention)
        notifications.sort(key=lambda x: x["retention"])
        
        return [n["message"] for n in notifications]

# ==========================================
# MAIN EXECUTION
# ==========================================

def main():
    print("=== Skill Decay Model (Single File) ===\n")
    
    # 1. Load Data
    problems, users, interactions = load_all_data()
    problem_map = create_problem_map(problems)
    
    if ignored_users := [u for u in users if not u.get("userId")]:
        print(f"Warning: {len(ignored_users)} users missing userId")

    # 2. Initialize Model
    model = SkillDecayModel(problem_map)
    
    # 3. Process All Users
    print("\nProcessing user histories...")
    for user in users:
        user_id = user.get("userId") or user.get("_id") # Fallback to _id if userId missing
        user_name = user.get("name", "Unknown")
        
        if not user_id: continue
        
        user_interactions = get_interactions_for_user(user_id, interactions)
        print(f"  - Processing {user_name} ({len(user_interactions)} interactions)")
        
        model.process_user_interactions(user_id, user_interactions)
        
    # 4. Generate Recommendations for ALL users
    print("\n=== Revision Notifications ===")
    
    for user in users:
        user_id = user.get("userId") or user.get("_id")
        user_name = user.get("name", "Unknown")
        
        if not user_id: continue
        
        notifications = model.get_revision_notifications(user_id, user_name=user_name.split()[0])
        
        if notifications:
            print(f"\n--- Notifications for {user_name} ---")
            for note in notifications:
                print(f"🔔 {note}")

if __name__ == "__main__":
    main()

import joblib
import pickle
import sys
import numpy as np
import sklearn

print(f"Python version: {sys.version}")
print(f"NumPy version: {np.__version__}")
print(f"Scikit-learn version: {sklearn.__version__}")

path = r"C:\Users\kshit\Downloads\complexity_predictor_disha.pkl"

try:
    print("Trying joblib.load...")
    model = joblib.load(path)
    print("Model Loaded Successfully with joblib!")
except Exception as e:
    print("joblib.load Error:", e)
    try:
        print("Trying pickle.load...")
        with open(path, 'rb') as f:
            model = pickle.load(f)
            print("Model Loaded Successfully with pickle!")
    except Exception as e2:
        print("pickle.load Error:", e2)
        model = None

if model:
    print("Type:", type(model))
    if hasattr(model, 'steps'):
        print("Pipeline Steps:", [s[0] for s in model.steps])
        for name, step in model.steps:
            print(f"Step '{name}': {type(step)}")
    elif hasattr(model, 'get_params'):
        print("Params:", model.get_params())
    
    if hasattr(model, 'predict'):
        print("Has predict method")
else:
    print("Failed to load model.")

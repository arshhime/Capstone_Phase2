import pickle
import sys

path = r"C:\Users\kshit\Downloads\complexity_predictor_disha.pkl"

with open(path, 'rb') as f:
    data = pickle.load(f)

print("--- Feature Names ---")
if 'feature_names' in data:
    for i in range(0, len(data['feature_names']), 10):
        print(", ".join(data['feature_names'][i:i+10]))

if 'models' in data:
    print("\n--- Models ---")
    for k, v in data['models'].items():
        print(f"  {k}: {type(v)}")

if 'encoders' in data:
    print("\n--- Encoders (Classes) ---")
    for k, v in data['encoders'].items():
        if hasattr(v, 'classes_'):
            print(f"  {k}: {v.classes_}")

if 'accuracy' in data:
    print("\n--- Accuracy ---")
    print(data['accuracy'])

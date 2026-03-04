import pickle
import sys
import json

path = r"C:\Users\kshit\Downloads\complexity_predictor_disha.pkl"

with open(path, 'rb') as f:
    data = pickle.load(f)

result = {}

if 'feature_names' in data:
    result['feature_names'] = data['feature_names']

if 'encoders' in data:
    result['encoders'] = {}
    for k, v in data['encoders'].items():
        if hasattr(v, 'classes_'):
            result['encoders'][k] = v.classes_.tolist()

if 'accuracy' in data:
    result['accuracy'] = data['accuracy']

if 'models' in data:
    result['models'] = {k: str(type(v)) for k, v in data['models'].items()}

with open('model_dump.json', 'w') as f:
    json.dump(result, f, indent=2)

print("Dumped to model_dump.json")

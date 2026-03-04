import json
import sys
import os

def check_structure():
    print("Inspecting data_aug/correct_users.json...")
    with open('data_aug/correct_users.json', 'r', encoding='utf-8') as f:
        users = json.load(f)
        
    print(f"Total users: {len(users)}")
    if users:
        print(f"Sample user keys: {list(users[0].keys())}")
        
    print("\nInspecting data_aug/correct_interactions.json...")
    with open('data_aug/correct_interactions.json', 'r', encoding='utf-8') as f:
        interactions = json.load(f)
        
    print(f"Total interactions: {len(interactions)}")
    if interactions:
        print(f"Sample interaction keys: {list(interactions[0].keys())}")
        
    # Cross verify
    user_ids = set()
    for u in users:
        uid = u.get('_id')
        if isinstance(uid, dict) and '$oid' in uid:
            uid = uid['$oid']
        elif not uid:
            uid = u.get('id')
        if uid:
            user_ids.add(str(uid))
            
    print(f"\nExtracted {len(user_ids)} unique user IDs from users.json")
    
    missing_users = set()
    matched_interactions = 0
    
    for idx, inc in enumerate(interactions):
        uid = inc.get('userId')
        if not uid: continue
        if isinstance(uid, dict) and '$oid' in uid:
            uid = uid['$oid']
        uid = str(uid)
        
        if uid not in user_ids:
            missing_users.add(uid)
        else:
            matched_interactions += 1
            
    print(f"Interactions matched with valid users: {matched_interactions}/{len(interactions)}")
    print(f"Unique missing user IDs in interactions: {len(missing_users)}")
    if missing_users:
        print(f"Sample missing user IDs: {list(missing_users)[:5]}")

if __name__ == '__main__':
    check_structure()

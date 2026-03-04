import json
import os
from collections import defaultdict
from datetime import datetime

def generate_report():
    print("Loading correct_users.json...")
    with open('data_aug/correct_users.json', 'r', encoding='utf-8') as f:
        users = json.load(f)
        
    print("Loading correct_interactions.json...")
    with open('data_aug/correct_interactions.json', 'r', encoding='utf-8') as f:
        interactions = json.load(f)
        
    report = []
    report.append("# Data Augmentation Verification Report")
    report.append(f"Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    report.append("## 1. Overview")
    report.append(f"- **Total Users:** {len(users):,}")
    report.append(f"- **Total Interactions:** {len(interactions):,}\n")

    # User ID matching
    user_ids = set()
    for u in users:
        # Check both userId and _id
        uid = u.get('userId')
        if not uid:
            uid = u.get('_id')
            if isinstance(uid, dict) and '$oid' in uid:
                uid = uid['$oid']
        if uid:
            user_ids.add(str(uid))

    missing_users_in_interactions = set()
    interaction_counts_by_user = defaultdict(int)
    
    for inc in interactions:
        uid = inc.get('userId')
        if isinstance(uid, dict) and '$oid' in uid:
            uid = uid['$oid']
        uid = str(uid)
        
        interaction_counts_by_user[uid] += 1
        
        if uid not in user_ids:
            missing_users_in_interactions.add(uid)
            
    report.append("## 2. Relational Integrity (Users <-> Interactions)")
    if len(missing_users_in_interactions) == 0:
        report.append("- ✅ **All interactions map to a valid user** in `correct_users.json`.")
    else:
        report.append(f"- ❌ **Mismatch:** {len(missing_users_in_interactions):,} unique User IDs in interactions not found in users.json.")
        
    # Check if all users have at least some interactions
    users_without_interactions = len(user_ids) - len([u for u in user_ids if interaction_counts_by_user[u] > 0])
    if users_without_interactions == 0:
        report.append("- ✅ **All users have at least one interaction**.")
    else:
        report.append(f"- ⚠️ {users_without_interactions:,} users have ZERO interactions recorded.")
        
    # Check interaction statistics
    avg_interactions = len(interactions) / len(users) if users else 0
    report.append(f"- **Average interactions per user:** {avg_interactions:.2f}")
    
    # 3. Data Structure & Fields
    report.append("\n## 3. Top-Level Schema Checks")
    
    # User keys
    if users:
        user_keys = sorted(list(users[0].keys()))
        report.append("### User Fields Example")
        report.append(", ".join(f"`{k}`" for k in user_keys))
        
    # Interaction keys
    if interactions:
        inc_keys = sorted(list(interactions[0].keys()))
        report.append("\n### Interaction Fields Example")
        report.append(", ".join(f"`{k}`" for k in inc_keys))
        
    # Check problem status consistency
    report.append("\n## 4. Logical Consistency")
    
    # Are correct interactions matching correct problems count on users?
    # User object has 'correctProblems' and 'solvedProblems'
    # Actually 'correctProblems' is an array of IDs in some schemas or an int.
    # Let's count success interactions and compare
    user_success_counts = defaultdict(int)
    for inc in interactions:
        if inc.get('status') == 'success': # usually 'success' or 'accepted'
            user_success_counts[str(inc.get('userId'))] += 1
            
    # For now, just generate the report file
    with open('data_aug_report.md', 'w', encoding='utf-8') as f:
        f.write("\n".join(report))
        
    print("Report generated successfully as data_aug_report.md")

if __name__ == '__main__':
    generate_report()

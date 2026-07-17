import json
import random
from datetime import datetime, timedelta, timezone
import os

jobs = []
statuses = ['queued', 'running', 'succeeded', 'failed']
now = datetime.now(timezone.utc)

for i in range(1, 1001):
    status = random.choice(statuses)
    
    # Random created_at in the last 7 days
    created_at = now - timedelta(days=random.uniform(0, 7))
    
    job = {
        "id": f"job_{i:04d}",
        "status": status,
        "created_at": created_at.isoformat()
    }
    
    if status in ['succeeded', 'failed']:
        duration = timedelta(minutes=random.uniform(1, 120))
        finished_at = created_at + duration
        if finished_at > now:
            finished_at = now
        job["finished_at"] = finished_at.isoformat()
        
    if status == 'failed':
        job["last_error"] = random.choice([
            "Connection timeout",
            "Out of memory",
            "Data corruption detected",
            "API rate limit exceeded",
            "Unexpected payload format"
        ])
        
    jobs.append(job)

# Sort them by created_at descending just so the file is neat, though the DB will sort anyway.
jobs.sort(key=lambda x: x["created_at"], reverse=True)

seed_path = os.path.join(os.path.dirname(__file__), "seed_jobs.json")
with open(seed_path, "w") as f:
    json.dump(jobs, f, indent=2)

print(f"Generated {len(jobs)} jobs to {seed_path}")

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import datetime

import models
from database import engine, get_db, SessionLocal

# Automatically create tables in DB
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Processing API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobSchema(BaseModel):
    id: str
    status: str
    created_at: datetime.datetime
    finished_at: Optional[datetime.datetime] = None
    last_error: Optional[str] = None

    class Config:
        from_attributes = True

@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        # Check if empty
        if db.query(models.Job).first() is None:
            import json
            import os
            
            seed_path = os.path.join(os.path.dirname(__file__), "seed_jobs.json")
            if os.path.exists(seed_path):
                with open(seed_path, "r") as f:
                    jobs_data = json.load(f)
                
                jobs = []
                for j in jobs_data:
                    jobs.append(models.Job(
                        id=j["id"],
                        status=j["status"],
                        created_at=datetime.datetime.fromisoformat(j["created_at"]),
                        finished_at=datetime.datetime.fromisoformat(j["finished_at"]) if "finished_at" in j else None,
                        last_error=j.get("last_error")
                    ))
                db.add_all(jobs)
                db.commit()
                print(f"Seeded {len(jobs)} jobs from {seed_path}")
    finally:
        db.close()

@app.get("/jobs", response_model=List[JobSchema])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(models.Job).order_by(models.Job.created_at.desc()).offset(skip).limit(limit).all()
    return jobs

@app.get("/jobs/{job_id}", response_model=JobSchema)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

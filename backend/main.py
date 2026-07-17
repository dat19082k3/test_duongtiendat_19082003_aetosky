from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import datetime

import models
from database import engine, get_db

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

@app.get("/jobs", response_model=List[JobSchema])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(models.Job).offset(skip).limit(limit).all()
    return jobs

@app.get("/jobs/{job_id}", response_model=JobSchema)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

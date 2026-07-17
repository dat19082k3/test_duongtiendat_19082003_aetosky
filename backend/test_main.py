from fastapi.testclient import TestClient
from main import app

# We use the context manager 'with TestClient(app) as client:' 
# so that FastAPI startup events (like data seeding) are executed before tests.

def test_get_jobs():
    with TestClient(app) as client:
        response = client.get("/jobs")
        assert response.status_code == 200
        
        # Verify it returns a list
        jobs = response.json()
        assert isinstance(jobs, list)
        
        # If DB was seeded, there should be at least 4 jobs
        assert len(jobs) >= 4
        
        # Check if basic fields are present in the first job
        first_job = jobs[0]
        assert "id" in first_job
        assert "status" in first_job
        assert "created_at" in first_job

def test_get_job_by_id():
    with TestClient(app) as client:
        # job_0001 is guaranteed to be seeded by our startup event
        response = client.get("/jobs/job_0001")
        assert response.status_code == 200
        
        job = response.json()
        assert job["id"] == "job_0001"
        assert job["status"] in ["queued", "running", "succeeded", "failed"]

def test_get_job_not_found():
    with TestClient(app) as client:
        response = client.get("/jobs/invalid_job_id")
        assert response.status_code == 404

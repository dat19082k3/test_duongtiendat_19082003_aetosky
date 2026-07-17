from fastapi.testclient import TestClient
from main import app

# We use the context manager 'with TestClient(app) as client:' 
# so that FastAPI startup events (like data seeding) are executed before tests.

def test_get_jobs():
    with TestClient(app) as client:
        response = client.get("/jobs")
        assert response.status_code == 200
        
        # Verify it returns a paginated structure
        data = response.json()
        assert "total" in data
        assert "items" in data
        
        jobs = data["items"]
        assert isinstance(jobs, list)
        
        # If DB was seeded, there should be at least 4 jobs, but capped by default limit 10
        assert len(jobs) > 0
        
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

def test_get_jobs_with_date_filter():
    with TestClient(app) as client:
        # Date range that covers some jobs (based on the generated seed data)
        # Assuming seed data spans past months.
        response = client.get("/jobs?start_date=2000-01-01T00:00:00&end_date=2050-12-31T23:59:59")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] > 0
        
        # Test an empty range
        response_empty = client.get("/jobs?start_date=1990-01-01T00:00:00&end_date=1991-01-01T00:00:00")
        assert response_empty.status_code == 200
        data_empty = response_empty.json()
        assert data_empty["total"] == 0

def test_get_jobs_with_sorting():
    with TestClient(app) as client:
        # Test sorting by id asc
        response_asc = client.get("/jobs?sort_by=id&sort_order=asc&limit=5")
        assert response_asc.status_code == 200
        jobs_asc = response_asc.json()["items"]
        assert len(jobs_asc) > 1
        assert jobs_asc[0]["id"] <= jobs_asc[1]["id"]
        
        # Test sorting by id desc
        response_desc = client.get("/jobs?sort_by=id&sort_order=desc&limit=5")
        assert response_desc.status_code == 200
        jobs_desc = response_desc.json()["items"]
        assert len(jobs_desc) > 1
        assert jobs_desc[0]["id"] >= jobs_desc[1]["id"]

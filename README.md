# Background Jobs Monitor

This is a Full Stack take-home exercise for displaying background data processing jobs.

## Overview
The application monitors the status of background jobs (queued, running, succeeded, failed) using a FastAPI backend and a React (Vite) frontend with Ant Design.

## System Requirements
- Node.js (v18+)
- Python 3.9+
- npm

## How to Run

Instead of manually starting the backend and frontend separately, you can run everything directly from the root directory using the provided `npm` scripts.

### 1. Installation & Setup
Run the following command once to install all Python backend and Node frontend dependencies:
```bash
npm run setup
```
*Note: A seed data file `seed.json` with 1000 jobs has been generated in the backend and is used as the data source to support server-side pagination and filtering.*

### 2. Start the Application
To run both the FastAPI backend and the React frontend simultaneously:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## Testing

To run both backend (Pytest) and frontend (Vitest) tests at once:
```bash
npm run test
```

**Frontend E2E Tests (Playwright):**
```bash
npm run test:e2e
```

## Architecture & Features
- **Server-side Pagination & Filtering**: The backend handles pagination (`skip`, `limit`) and status filtering, capable of scaling to thousands of jobs without crashing the browser.
- **Multi-Route SPA**: Built with `react-router-dom`, supporting direct deep-linking to job details (`/jobs/:jobId`).
- **Resilience**: The frontend gracefully handles missing fields and unexpected statuses (mapping them to `UNKNOWN`), and warns the user if a job state is logically inconsistent (e.g., `running` but has a `finished_at` timestamp).
- **Error Boundaries**: Comprehensive `404 Not Found` and `500 Server Error` screens.

## Future Improvements (Next Steps)
Given more time outside the 90-minute timebox, here are the key improvements I would implement to make this production-ready:

1. **Real-time Updates (WebSocket / SSE):** 
   Currently, the system relies on manual refreshing to fetch new statuses. I would integrate WebSockets (or Server-Sent Events) so that job statuses transition automatically from `queued` -> `running` -> `succeeded/failed` in real-time without requiring a browser reload.

2. **Job Control Actions (Retry/Cancel):** 
   Add interactive APIs such as `POST /jobs/{id}/retry` to allow users to rerun a `failed` job directly from the detail view, or `POST /jobs/{id}/cancel` to forcefully terminate a stuck `running` job.

3. **Advanced Filtering & Date Range:** 
   Extend the backend and frontend to support filtering by `created_at` date ranges. In a real-world system where jobs grow to millions of records, filtering purely by status is not enough; users often need to investigate jobs that failed "in the last 24 hours".

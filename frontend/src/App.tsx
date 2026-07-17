import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { JobList } from './pages/JobList';
import { JobDetail } from './pages/JobDetail';
import { NotFound } from './pages/NotFound';
import { ServerError } from './pages/ServerError';
import './App.css';

const App: React.FC = () => {
  return (
    <ServerError>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ServerError>
  );
};

export default App;

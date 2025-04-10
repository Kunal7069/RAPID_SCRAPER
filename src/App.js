import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import JobTracker from './components/JobTracker';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/job-tracker" element={<JobTracker />} />
    </Routes>
  );
}

export default App;
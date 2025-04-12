
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import JobTracker from './components/JobTracker';
import TokenPrompt from './components/TokenPrompt';
import LinkedInScraperDocs from './components/LinkedInScraperDocs'; 

function App() {
  const [tokenValidated, setTokenValidated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // try verifying token if exists
      fetch('https://vigil-6sgu.onrender.com/read-rapid/verify_token', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.ok) setTokenValidated(true);
          else localStorage.removeItem('accessToken');
        })
        .catch(() => localStorage.removeItem('accessToken'));
    }
  }, []);

  if (!tokenValidated) {
    return <TokenPrompt onTokenValidated={() => setTokenValidated(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/job-tracker" element={<JobTracker />} />
      <Route path="/scraper-docs" element={<LinkedInScraperDocs />} />
    </Routes>
  );
}

export default App;

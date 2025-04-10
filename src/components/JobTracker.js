// JobTracker.jsx
import React, { useEffect, useState } from 'react';

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://vigil-6sgu.onrender.com/read-rapid/job-tracker');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching job tracker:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const tableHeaders = [
    "ID", "Username", "Type", "Status", "Created At",
    "Post Limit", "Comment Limit", "Reaction Limit",
    "Activity Comments", "Activity Reactions", "Profile Info",
    "Post Scrap", "Post Comments", "Post Reactions"
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>📋 Job Tracker</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {tableHeaders.map(header => (
                  <th
                    key={header}
                    style={{
                      border: '1px solid #ccc',
                      padding: '0.5rem',
                      backgroundColor: '#f0f0f0',
                      textTransform: 'capitalize'
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={tdStyle}>{job.id}</td>
                  <td style={tdStyle}>{job.username}</td>
                  <td style={tdStyle}>{job.type}</td>
                  <td style={tdStyle}>{job.status}</td>
                  <td style={tdStyle}>{new Date(job.created_at).toLocaleString()}</td>
                  <td style={tdStyle}>{job.post_limit}</td>
                  <td style={tdStyle}>{job.comment_limit}</td>
                  <td style={tdStyle}>{job.reaction_limit}</td>
                  <td style={tdStyle}>{job.activity_comments}</td>
                  <td style={tdStyle}>{job.activity_reactions}</td>
                  <td style={tdStyle}>{job.profile_info}</td>
                  <td style={tdStyle}>{job.post_scrap}</td>
                  <td style={tdStyle}>{job.post_comments}</td>
                  <td style={tdStyle}>{job.post_reactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '0.5rem',
  textAlign: 'center',
};

export default JobTracker;

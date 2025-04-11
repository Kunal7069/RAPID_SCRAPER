import React, { useEffect, useState } from "react";

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("https://vigil-6sgu.onrender.com/read-rapid/job-tracker");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching job tracker:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDownload = async (id, username) => {
    if (!token) {
      alert("Please enter your access token first.");
      return;
    }

    try {
      const res = await fetch(
        `https://vigil-6sgu.onrender.com/read-rapid/get_job_data/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

      const data = await res.json();
      const fileName = `${username}_${id}.json`;
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      window.alert("JSON file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading JSON:", error);
      window.alert("Failed to download JSON. Please try again.");
    }
  };

  const tableHeaders = [
    "ID",
    "Username",
    "Type",
    "Status",
    "Created At",
    "Post Limit",
    "Comment Limit",
    "Reaction Limit",
    "Activity Comments",
    "Activity Reactions",
    "Profile Info",
    "Post Scrap",
    "Post Comments",
    "Post Reactions",
    "Actions",
  ];

  const filteredJobs = jobs.filter((job) =>
    job.username.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>📋 Job Tracker</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>
          Access Token:{" "}
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your access token"
            style={{ padding: "0.4rem", width: "300px" }}
          />
        </label>
        <label>
          Filter by Username:{" "}
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Type username..."
            style={{ padding: "0.4rem", width: "200px" }}
          />
        </label>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    style={{
                      border: "1px solid #ccc",
                      padding: "0.5rem",
                      backgroundColor: "#f0f0f0",
                      textTransform: "capitalize",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td style={tdStyle}>{job.id}</td>
                  <td style={tdStyle}>{job.username}</td>
                  <td style={tdStyle}>{job.type}</td>
                  <td style={tdStyle}>{job.status}</td>
                  <td style={tdStyle}>
                    {new Date(job.created_at).toLocaleString()}
                  </td>
                  <td style={tdStyle}>{job.post_limit}</td>
                  <td style={tdStyle}>{job.comment_limit}</td>
                  <td style={tdStyle}>{job.reaction_limit}</td>
                  <td style={tdStyle}>{job.activity_comments}</td>
                  <td style={tdStyle}>{job.activity_reactions}</td>
                  <td style={tdStyle}>{job.profile_info}</td>
                  <td style={tdStyle}>{job.post_scrap}</td>
                  <td style={tdStyle}>{job.post_comments}</td>
                  <td style={tdStyle}>{job.post_reactions}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDownload(job.id, job.username)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Download JSON
                    </button>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td
                    colSpan={15}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No jobs found with this username.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "0.5rem",
  textAlign: "center",
};

export default JobTracker;

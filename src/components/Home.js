
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [creditsBought, setCreditsBought] = useState("50000");
  const [totalCost, setTotalCost] = useState("175");
  const [minimumCalculatedCost, setMinimumCalculatedCost] = useState(null);
  const [maximumCalculatedCost, setMaximumCalculatedCost] = useState(null);
  const [formData, setFormData] = useState({
    type: "person",
    username: "",
    access_token: "",
    activity_comments: "no",
    activity_reactions: "no",
    profile_info: "no",
    post_scrap: "no",
    post_comments: "no",
    post_reactions: "no",
    post_limit: 50,
    comment_limit: 100,
    reaction_limit: 49,
    media_flag: "no",
    caching : "no"
  });

  const [response, setResponse] = useState(null);
  const [creditEstimate, setCreditEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

  const getNextMultiple = (value, multiple) => {
    const num = parseInt(value, 10);
    if (num % multiple === 0) return num;
    return Math.ceil(num / multiple) * multiple;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
  
    let adjustedFormData = { ...formData };
    
    if(formData.caching === "no"){
      if(formData.post_scrap === "yes" || formData.activity_comments === "yes" || formData.activity_reactions === "yes"){
        const adjustBatchSizes = window.confirm(
          "Do you want to adjust to ideal batch sizes?"
        );
      
        if (adjustBatchSizes) {
          if (formData.post_scrap === "yes") {
            adjustedFormData.post_limit = getNextMultiple(formData.post_limit, 50);
          }
          if (formData.post_reactions === "yes") {
            adjustedFormData.reaction_limit = getNextMultiple(formData.reaction_limit, 49);
          }
          if (formData.activity_comments === "yes") {
            adjustedFormData.post_limit = getNextMultiple(formData.post_limit, 100);
          }
          // Update local formData state (optional, only if you want to reflect adjusted values in UI)
          setFormData(adjustedFormData);
      }
      
      }
    }
    
  
    try {
      const { access_token, ...bodyData } = adjustedFormData;
      const res = await fetch("https://vigil-6sgu.onrender.com/rapid/get-activity-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adjustedFormData.access_token}`,
        },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreditEstimate = async () => {
    setLoading(true);
    setCreditEstimate(null);
    setMinimumCalculatedCost(null);
    setMaximumCalculatedCost(null);
    try {
      const res = await fetch("https://vigil-6sgu.onrender.com/read-rapid/credit-estimation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${formData.access_token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setCreditEstimate(data);

      if (data.max_credits && creditsBought && totalCost) {
        const costPerCredit = parseFloat(totalCost) / parseFloat(creditsBought);
        const estimatedCost = costPerCredit * parseFloat(data.max_credits);
        setMaximumCalculatedCost(estimatedCost.toFixed(4));
      }
      if (data.min_credits && creditsBought && totalCost) {
        const costPerCredit = parseFloat(totalCost) / parseFloat(creditsBought);
        const estimatedCost = costPerCredit * parseFloat(data.min_credits);
        setMinimumCalculatedCost(estimatedCost.toFixed(4));
      }
    } catch (err) {
      console.error(err);
      setCreditEstimate({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!response) return;

    const now = new Date();
    const timeString = now
      .toLocaleTimeString("en-GB", { hour12: false })
      .replace(/:/g, "");
    const fileName = `${formData.username}_${timeString}.json`;

    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const formSectionStyle = {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle = {
    marginBottom: "0.3rem",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const selectStyle = { ...inputStyle, backgroundColor: "#fff" };

  const buttonStyle = {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "1rem",
    marginRight: "1rem",
  };

  return (
    <div
      style={{
        padding: "2rem 3rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ margin: 0 }}>🚀 RAPID API SCRAPER</h1>
        <Link
          to="/job-tracker"
          style={{
            textDecoration: "none",
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#005dc1")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0070f3")}
        >
          📄 View Job Tracker
        </Link>
        <Link
          to="/scraper-docs"
          style={{
            textDecoration: "none",
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#005dc1")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0070f3")}
        >
          📄 Scraper Doc
        </Link>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {/* LEFT: Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#fafafa",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 0 8px rgba(0,0,0,0.1)",
            flex: 3,
          }}
        >
          <div style={formSectionStyle}>
            <label style={labelStyle}>Access Token</label>
            <input
              type="text"
              name="access_token"
              value={formData.access_token || ""}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formSectionStyle}>
            <label style={labelStyle}>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="person">Person</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div style={formSectionStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <hr style={{ margin: "1.5rem 0" }} />

          {/* <h3 style={{ marginBottom: "1rem" }}>Tasks</h3>
          {[
            "profile_info",
            "post_scrap",
            "activity_comments",
            "activity_reactions"
          ].map((field) => (
            <div key={field} style={formSectionStyle}>
              <label style={labelStyle}>{field.replace(/_/g, " ")}</label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          ))} */}

          <h3 style={{ marginBottom: "1rem" }}>Tasks</h3>
          {[
            { field: "profile_info", description: "Extracts profile information only (no post-related data)." },
            { field: "post_scrap", description: "Scrapes posts created by the user." },
            { field: "activity_comments", description: "Scrapes posts the user has commented on." },
            { field: "activity_reactions", description: "Scrapes posts the user has reacted to." }
          ].map(({ field, description }) => (
            <div key={field} style={formSectionStyle}>
              <label style={labelStyle}>
                {field.replace(/_/g, " ")}
                <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.3rem" }}>{description}</div>
              </label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          ))}
          <hr style={{ margin: "1.5rem 0" }} />
          <h3 style={{ marginBottom: "1rem" }}>Configuartion for Posts (Only need to configure if task is post scrap, activity comments, activity reactions)</h3>
          {/* {[
            "post_comments",
            "post_reactions",
            "media_flag"
          ].map((field) => (
            <div key={field} style={formSectionStyle}>
              <label style={labelStyle}>{field.replace(/_/g, " ")}</label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          ))} */}

            {[
              {
                field: "post_comments",
                description: "To scrape commenters along with the posts",
              },
              {
                field: "post_reactions",
                description: "To scrape reactors along with the posts",
              },
              {
                field: "media_flag",
                description: "To save images in raw binary format along with the URL",
              }
            ].map(({ field, description }) => (
              <div key={field} style={formSectionStyle}>
                <label style={labelStyle}>
                  {field.replace(/_/g, " ")}
                  <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.3rem" }}>
                    {description}
                  </div>
                </label>
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={selectStyle}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            ))}
          <hr style={{ margin: "1.5rem 0" }} />
          <h3 style={{ marginBottom: "1rem" }}>Other options</h3>
          {/* {[
            "caching"
          ].map((field) => (
            <div key={field} style={formSectionStyle}>
              <label style={labelStyle}>{field.replace(/_/g, " ")}</label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          ))} */}

          {[
            {
              field: "caching",
              description: "To read data from the database if available instead of scraping fresh data",
            }
          ].map(({ field, description }) => (
            <div key={field} style={formSectionStyle}>
              <label style={labelStyle}>
                {field.replace(/_/g, " ")}
                <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.3rem" }}>
                  {description}
                </div>
              </label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          ))}


          <hr style={{ margin: "1.5rem 0" }} />

          <h3 style={{ marginBottom: "1rem" }}>Limits</h3>
          {["post_limit", "comment_limit", "reaction_limit"].map((field) => (
            <div key={field} style={formSectionStyle}>
              <label style={labelStyle}>{field.replace(/_/g, " ")}</label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          ))}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <button type="submit" style={buttonStyle}>
              SCRAPE
            </button>
            <button
              type="button"
              onClick={handleCreditEstimate}
              style={{ ...buttonStyle, backgroundColor: "#ff9800" }}
            >
              CALCULATE CREDIT
            </button>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px" }}>
                Credits Bought
              </label>
              <input
                type="number"
                placeholder="Credits Bought"
                value={creditsBought}
                onChange={(e) => setCreditsBought(e.target.value)}
                style={{ ...inputStyle, width: "130px" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px" }}>
                Total Cost(in $)
              </label>
              <input
                type="number"
                placeholder="Total Cost"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                style={{ ...inputStyle, width: "130px" }}
              />
            </div>
          </div>
        </form>

        {/* RIGHT: Notes */}
        <div
          style={{
            flex: 2,
            backgroundColor: "#fff9e6",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 0 6px rgba(0,0,0,0.08)",
            fontSize: "14px",
            fontWeight: "bold",
            lineHeight: "1.6",
          }}
        >
          <h3 style={{ marginTop: 0 }}>📝 Notes</h3>
          <ul style={{ paddingLeft: "1rem" }}>
            <li>Keep the <strong>post_limit</strong> in multiples of <strong>50</strong> while scraping posts.</li>
            <li>Keep the <strong>reaction_limit</strong> in multiples of <strong>49</strong>.</li>
            <li>Keep the <strong>post_limit</strong> in multiples of <strong>100</strong> while scraping activity comments.</li>
          </ul>
        </div>
      </div>

      {loading && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>Loading...</p>
      )}

      {response && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Scrape Response:</h3>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "1rem",
              backgroundColor: "#f4f4f4",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              borderRadius: "8px",
            }}
          >
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
          <button
            onClick={handleDownload}
            style={{ ...buttonStyle, backgroundColor: "#28a745" }}
          >
            Download JSON
          </button>
        </div>
      )}

      {creditEstimate && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Credit Estimation:</h3>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "1rem",
              backgroundColor: "#fffbea",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              borderRadius: "8px",
            }}
          >
            <pre>{JSON.stringify(creditEstimate, null, 2)}</pre>
            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
              💰 Estimated Maximum Cost of Credits Used: ${maximumCalculatedCost}
            </p>
            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
              💰 Estimated Minimum Cost of Credits Used: ${minimumCalculatedCost}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
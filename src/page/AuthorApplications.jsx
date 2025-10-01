import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const backendUrl = API_BASE_URL;

const AuthorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/authormail`);
        setApplications(res.data);
      } catch (err) {
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Applications from Author</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : applications.length === 0 ? (
        <div>No applications found.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f8f8" }}>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Name</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Degree</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Skill</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Resume</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Applied At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>{app.name}</td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>{app.degree}</td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>{app.skill}</td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>
                    <a href={`${backendUrl}/${app.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a>
                  </td>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>{app.createdAt ? new Date(app.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuthorApplications;

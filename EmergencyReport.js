import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCrosshairs } from "react-icons/fa";
import "../App.css";

function EmergencyReport() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    description: "",
    contact: "",
    disasterType: "",
    severity: "",
    latitude: "",
    longitude: "",
    location: "",   // ✅ extra field if needed later
  });

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/emergencies");
      setReports(res.data);
    } catch (err) {
      console.error("Error loading reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        alert("📍 GPS location captured & attached!");
      },
      () => alert("❌ Failed to get location. Enable GPS permissions.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.latitude || !form.longitude) {
      alert("⚠ Please click Apply My Location before submitting.");
      return;
    }

    await axios.post("http://localhost:5000/api/emergencies/add", form);
    alert("🚨 Emergency Submitted Successfully!");

    setForm({
      description: "",
      contact: "",
      disasterType: "",
      severity: "",
      latitude: "",
      longitude: "",
      location: "",
    });

    fetchReports();
  };

  return (
    <div className="emergency">
      <h1 className="page-title">🚨 Emergency Reporting</h1>

      <form className="report-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe emergency..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          placeholder="Your contact (phone/email)"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          required
        />

        <select
          value={form.disasterType}
          onChange={(e) => setForm({ ...form, disasterType: e.target.value })}
          required
        >
          <option value="">--Select Disaster Type--</option>
          <option>Flood</option>
          <option>Earthquake</option>
          <option>Cyclone</option>
          <option>Fire</option>
          <option>Landslide</option>
          <option>Other</option>
        </select>

        <select
          value={form.severity}
          onChange={(e) => setForm({ ...form, severity: e.target.value })}
          required
        >
          <option value="">--Select Severity--</option>
          <option>Low</option>
          <option>Moderate</option>
          <option>Severe</option>
        </select>

        <button type="button" className="use-location-btn" onClick={useMyLocation}>
          <FaCrosshairs /> Apply My Location
        </button>

        <button type="submit" className="report-button">
          🆘 Submit Emergency Report
        </button>
      </form>

      {/* Recent Reports List (unchanged styling, but now shows GPS) */}
      <div className="reports">
        <h2 className="reports-title">📋 Recent Reports</h2>

        {reports.length === 0 ? (
          <p className="no-reports">No reports yet.</p>
        ) : (
          <ul>
            {reports.map((r) => (
              <li key={r._id} className="report-item">
                <p><strong>📄 Description:</strong> {r.description}</p>
                <p><strong>📞 Contact:</strong> {r.contact}</p>
                <p><strong>🌋 Disaster Type:</strong> {r.disasterType}</p>
                <p><strong>⚠️ Severity:</strong> {r.severity}</p>

                {/* ✅ GPS / Coordinates shown */}
                <p><strong>📍 Coordinates:</strong> {r.latitude?.toFixed(6)}, {r.longitude?.toFixed(6)}</p>

                <p><strong>🕒 Time:</strong> {new Date(r.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EmergencyReport;

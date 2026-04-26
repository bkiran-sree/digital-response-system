import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { FaPlusCircle, FaTrashAlt, FaCrosshairs } from "react-icons/fa";
import "./resourceTracker.css";

const socket = io("http://localhost:5000"); // ✅ single socket instance

const ResourceTracker = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    resourceName: "",
    resourceType: "Food",
    quantity: "",
    location: "",
    contact: "",
    severity: "Low",
    latitude: "",
    longitude: "",
  });

  // ✅ Fetch resources from DB and update table
  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resources");
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  // ✅ Load data once when page loads
  useEffect(() => {
    fetchResources();
  }, []);

  // ✅ Real-time resource updates (without refresh)
  useEffect(() => {
    socket.on("newResource", (newResource) => {
      setResources((prev) => [newResource, ...prev]); // instantly update table
    });

    return () => socket.off("newResource");
  }, []);

  // ✅ Capture exact GPS location
  const captureLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        alert("📍 GPS location captured!");
      },
      () => alert("❌ Failed to capture GPS. Enable location.")
    );
  };

  // ✅ Add resource and emit notification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      alert("⚠ Capture GPS location before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/resources/add", formData);
      alert("✅ Resource added successfully!");

      // Reset form after submission
      setFormData({
        resourceName: "",
        resourceType: "Food",
        quantity: "",
        location: "",
        contact: "",
        severity: "Low",
        latitude: "",
        longitude: "",
      });

      // Refresh list
      fetchResources();
    } catch (err) {
      alert("❌ Failed to add resource.");
      console.error(err);
    }
  };

  // ✅ Delete resource from DB
  const deleteResource = async (_id) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/resources/${_id}`);
      fetchResources(); // refresh
    } catch (err) {
      alert("❌ Failed to delete resource.");
    }
  };

  return (
    <div className="resource-tracker-container">
      <h2>📦 Resource Tracking Dashboard</h2>

      {/* ✅ Add Resource Form */}
      <form className="resource-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="resourceName"
          placeholder="Resource Name"
          value={formData.resourceName}
          onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
          required
        />

        <select
          name="resourceType"
          value={formData.resourceType}
          onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
        >
          <option>Food</option>
          <option>Water</option>
          <option>Medical</option>
          <option>Shelter</option>
          <option>Transport</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location Details"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Info"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required
        />

        <select
          name="severity"
          value={formData.severity}
          onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="button" className="use-location-btn" onClick={captureLocation}>
          <FaCrosshairs /> Capture Location
        </button>

        <button type="submit" className="add-btn">
          <FaPlusCircle /> Add Resource
        </button>
      </form>

      {/* ✅ Resource Data Table */}
      <table className="resource-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Location</th>
            <th>Contact</th>
            <th>Severity</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Added On</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {resources.length > 0 ? (
            resources.map((r) => (
              <tr key={r._id}>
                <td>{r.resourceName}</td>
                <td>{r.resourceType}</td>
                <td>{r.quantity}</td>
                <td>{r.location}</td>
                <td>{r.contact}</td>
                <td>{r.severity}</td>
                <td>{r.latitude?.toFixed(6)}</td>
                <td>{r.longitude?.toFixed(6)}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteResource(r._id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                No resources added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTracker;

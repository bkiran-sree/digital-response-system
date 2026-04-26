import React, { useEffect, useState } from "react";
import axios from "axios";
import "./volunteerTracker.css";
import { FaCrosshairs } from "react-icons/fa";

const VolunteerCoordination = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    skills: "",
    availability: "Available",
    assignedTask: "",
    latitude: null,
    longitude: null,
  });

  const fetchVolunteers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/volunteers");
      setVolunteers(res.data);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({ ...formData, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        alert("📍 GPS location attached!");
      },
      () => alert("Failed to fetch location!")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
    };

    await axios.post("http://localhost:5000/api/volunteers/add", payload);
    alert("✅ Volunteer added successfully!");
    fetchVolunteers();

    setFormData({
      name: "",
      contact: "",
      email: "",
      location: "",
      skills: "",
      availability: "Available",
      assignedTask: "",
      latitude: null,
      longitude: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this volunteer?")) return;
    await axios.delete(`http://localhost:5000/api/volunteers/${id}`);
    fetchVolunteers();
  };

  return (
    <div className="volunteer-tracker-container">
      <h2>🤝 Volunteer Coordination</h2>

      <form className="volunteer-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} />
        <select name="availability" value={formData.availability} onChange={handleChange}>
          <option>Available</option> <option>Busy</option> <option>Offline</option>
        </select>
        <input name="assignedTask" placeholder="Assigned Task" value={formData.assignedTask} onChange={handleChange} />

        <button type="button" className="use-location-btn" onClick={useMyLocation}>
          <FaCrosshairs /> Use My Location
        </button>

        <button type="submit" className="add-btn">➕ Add Volunteer</button>
      </form>

      <table className="volunteer-table">
        <thead>
          <tr>
            <th>Name</th> <th>Contact</th> <th>Email</th> <th>Location</th> <th>Skills</th> <th>Status</th> <th>Task</th> <th>Joined</th> <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.length ? (
            volunteers.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td> <td>{v.contact}</td> <td>{v.email || "--"}</td>
                <td>{v.location}</td> <td>{v.skills.join(", ")}</td>
                <td>{v.availability}</td> <td>{v.assignedTask || "--"}</td>
                <td>{new Date(v.joinedAt).toLocaleString()}</td>
                <td><button className="delete-btn" onClick={() => handleDelete(v._id)}>❌</button></td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="9" style={{ textAlign: "center" }}>No volunteers found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerCoordination;

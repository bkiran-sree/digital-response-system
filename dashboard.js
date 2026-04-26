import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./dashboard.css";

import EmergencyReport from "../components/EmergencyReport";
import ResourceTracker from "../components/ResourceTracker";
import VolunteerCoordination from "../components/VolunteerCoordination";
import MapDisplay from "../components/MapDisplay";
import Notifications from "../components/Notifications";

// Connect to backend Socket.IO server
const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  const [alertsCount, setAlertsCount] = useState(0);
  const [newsList, setNewsList] = useState([]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // removes token
    window.location.href = "/"; // redirect to login/home
  };

  // Listen to alerts
  useEffect(() => {
    socket.on("receiveAlert", () => {
      setAlertsCount((prev) => prev + 1);
    });
    return () => socket.off("receiveAlert");
  }, []);

  // Listen to real-time news
  useEffect(() => {
    socket.on("receiveNews", (newsItem) => {
      setNewsList((prev) => [newsItem, ...prev]);
    });
    return () => socket.off("receiveNews");
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return renderHomePage();
      case "EmergencyReport":
        return <EmergencyReport />;
      case "ResourceTracker":
        return <ResourceTracker />;
      case "VolunteerCoordination":
        return <VolunteerCoordination />;
      case "MapDisplay":
        return <MapDisplay />;
      case "Notifications":
        return <Notifications resetAlerts={() => setAlertsCount(0)} />;
      default:
        return <h2>Page Not Found</h2>;
    }
  };

  const renderHomePage = () => (
    <div className="home-page">
      <h2 className="home-heading">Featured Disasters</h2>
      <div className="feature-cards">
        <div className="feature-card">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Bolivia_floods_2025.jpg"
            alt="Bolivia Floods"
            className="feature-image"
          />
          <div className="feature-content">
            <h3>2025 Bolivia Floods</h3>
            <p>
              <strong>Date:</strong> March 2025
            </p>
            <p>Severe flooding displaced over 100,000 people and caused major losses.</p>
          </div>
        </div>
      </div>

      <h2 className="home-heading">Latest Disaster News</h2>
      <div className="news-cards">
        {newsList.length === 0 ? (
          <p>No news available.</p>
        ) : (
          newsList.map((news, idx) => (
            <div className="news-card" key={idx}>
              {news.image && <img src={news.image} alt={news.title} />}
              <div className="news-content">
                <h4>{news.title}</h4>
                <p>{news.description}</p>
                <a href={news.link || news.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={`dashboard ${isMenuOpen ? "menu-open" : ""}`}>
      {/* ✅ SIDEBAR */}
      <nav className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src="logo.png" alt="Logo" className="logo" />
          <h2>Dashboard</h2>
        </div>

        <ul className="dashboard-navbar">
          <li onClick={() => setActivePage("Home")}>Home</li>
          <li onClick={() => setActivePage("EmergencyReport")}>Emergency Reporting</li>
          <li onClick={() => setActivePage("ResourceTracker")}>Resource Tracker</li>
          <li onClick={() => setActivePage("VolunteerCoordination")}>Volunteer Coordination</li>
          <li onClick={() => setActivePage("MapDisplay")}>Map</li>
          <li onClick={() => setActivePage("Notifications")}>
            Notifications {alertsCount > 0 && <span className="alert-badge">{alertsCount}</span>}
          </li>

          {/* ✅ LOGOUT BUTTON */}
          <li
            onClick={handleLogout}
            className="logout-btn"
            style={{
              marginTop: "30px",
              color: "red",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Logout
          </li>
        </ul>
      </nav>

      {/* ✅ MAIN CONTENT */}
      <div className="main-content">
        <header className="dashboard-header">
          <div className="menu-toggle" onClick={toggleMenu}>
            <i className={`fa ${isMenuOpen ? "fa-times" : "fa-bars"}`} />
          </div>
          <h1>{activePage.replace(/([A-Z])/g, " $1").trim()}</h1>
        </header>

        <div className="content">{renderPage()}</div>

        <footer>
          <p>&copy; 2025 Disaster Response Coordination | All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

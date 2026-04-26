import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // If you're using React Router for navigation
import '../App.css'; // You can rename to DisasterApp.css if needed

function Home() {
  const [nightMode, setNightMode] = useState(false);

  const toggleNightMode = () => {
    setNightMode(!nightMode);
  };

  return (
    <div className={`page ${nightMode ? 'night-mode' : ''}`}>
      {/* Header */}
      <header className="header">
        
        <h1 align="center">
          Digital Disaster Response Network for Real time relief and recovery operations
        </h1>
        <span className="menu-toggle" onClick={toggleNightMode}>
          ☀️/🌙
        </span>
      </header>
    

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Enhancing Disaster Response</h2>
          <p>
            During natural disasters, existing management systems often fall short in real-time coordination.
            Our platform bridges that gap with live updates, seamless communication, and efficient resource management to support disaster-affected communities.
          </p>
          <div className="cta">
            <a href="https://apsdma.ap.gov.in/" target="_blank" rel="noopener noreferrer">
              Learn About APSDMA
            </a>
          </div>
        </div>
      </section>
      <section align="center" className="cta-section">
        <a href="/about" className="cta-button">Learn More</a><br/>
        <Link to="/register" className="cta-button">Get Started</Link>
      </section>

      
      {/* Info Section */}
      <section className="learning-tips">
        <h3>Overview</h3>
        <ul>
          <li><strong>Gap in Existing Platforms:</strong> Limited real-time integration and communication in APSDMA and similar systems.</li>
          <li><strong>Approach:</strong> User-centric platform providing live awareness and efficient coordination.</li>
          <li><strong>Scope:</strong> Designed for scalability and effectiveness in large-scale disasters.</li>
        </ul>
      </section>
      

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Disaster Response Coordination  | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;

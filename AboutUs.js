import React from 'react';
import '../App.css';  // Assuming the styles are in App.css

function AboutUs() {
  return (
    <div className="about-page">
      {/* About Us Section */}
      <section className="features">
      <h2>About Us</h2>
      <p>
        We enhance disaster response with real-time updates, resource tracking, volunteer coordination,
        and emergency reporting to bridge the gap between affected communities and rescue teams.
      </p>
</section>
      {/* Features Section */}
      <section className="features" id="features">
        <h3>Core Objectives</h3>
        <div className="feature-cards">
          <div className="feature-card">
            <img src="/images/live-updates.png" alt="Real-Time Updates" />
            <h4>Real-Time Updates</h4>
            <p>Get instant information on disaster impact, weather, and rescue activities.</p>
          </div>
          <div className="feature-card">
            <img src="/images/resources.png" alt="Resource Tracking" />
            <h4>Resource Tracking</h4>
            <p>Track availability of food, water, and medical supplies in real-time.</p>
          </div>
          <div className="feature-card">
            <img src="/images/volunteers.png" alt="Volunteer Coordination" />
            <h4>Volunteer Coordination</h4>
            <p>Connect and coordinate with volunteers and rescue teams effectively.</p>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="features">
        <div className="feature-cards">
          <div className="feature-card">
            <img src="/images/emergency.png" alt="Emergency Reporting" />
            <h4>Emergency Reporting</h4>
            <p>Quickly report emergencies or request help via a user-friendly interface.</p>
          </div>
          <div className="feature-card">
            <img src="/images/maps.png" alt="Mapping & Locations" />
            <h4>Mapping & Locations</h4>
            <p>Share and track shelter locations and guide rescue operations via integrated maps.</p>
          </div>
          <div className="feature-card">
            <img src="/images/notifications.png" alt="User Notifications" />
            <h4>User Notifications</h4>
            <p>Receive alerts on safe zones, shelters, and real-time status updates.</p>
          </div>
        </div>
      </section>

      {/* CTA Section with "Learn More" and "Get Started" buttons */}
      {/* Footer */}
      <footer>
        <p>&copy; 2025 Disaster Response Coordination | All Rights Reserved</p>
      </footer>
      
    </div>
  );
}

export default AboutUs;

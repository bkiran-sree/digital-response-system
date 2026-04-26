// src/main.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components and pages
import Dashboard from './pages/dashboard';
import EmergencyReport from './components/EmergencyReport';
import ResourceTracker from './components/ResourceTracker';
import VolunteerCoordination from './components/VolunteerCoordination';
import MapDisplay from './components/MapDisplay'; // ✅ keep this path correct

const Main = () => {
  return (
    <Router>
      <Routes>
        {/* Default route (Dashboard as homepage) */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/emergency-report" element={<EmergencyReport />} />
        <Route path="/resource-tracker" element={<ResourceTracker />} />
        <Route path="/volunteer-coordination" element={<VolunteerCoordination />} />
        <Route path="/map-display" element={<MapDisplay />} />
      </Routes>
    </Router>
  );
};

export default Main;

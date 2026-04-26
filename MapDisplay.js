import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

// ✅ Marker Icons
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapDisplay = () => {
  const [mapData, setMapData] = useState({
    emergencies: [],
    resources: [],
    volunteers: [],
  });

  // ✅ Fetch initial DB data
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mapdata");
      const data = await res.json();
      setMapData(data);
    } catch (err) {
      console.error("Error fetching map data:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // ✅ Real-time socket listeners
    socket.on("newEmergency", (data) => {
      setMapData((prev) => ({
        ...prev,
        emergencies: [...prev.emergencies, data],
      }));
    });

    socket.on("newResource", (data) => {
      setMapData((prev) => ({
        ...prev,
        resources: [...prev.resources, data],
      }));
    });

    socket.on("newVolunteer", (data) => {
      setMapData((prev) => ({
        ...prev,
        volunteers: [...prev.volunteers, data],
      }));
    });

    // ✅ Clean listener on component unmount
    return () => {
      socket.off("newEmergency");
      socket.off("newResource");
      socket.off("newVolunteer");
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <h2 style={{ textAlign: "center", padding: "8px", fontWeight: "bold" }}>
        🌍 Real-Time Disaster Response Map
      </h2>

      <MapContainer
        center={[17.385, 78.4867]} // Hyderabad position
        zoom={10}
        style={{ width: "100%", height: "85vh", borderRadius: "8px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ✅ Emergency Markers */}
        {mapData.emergencies.map((emg, index) => (
          <Marker
            key={`emergency-${index}`}
            position={[emg.latitude, emg.longitude]}
            icon={redIcon}
          >
            <Popup>
              <b>🚨 Emergency</b>
              <br />
              Type: {emg.disasterType}
              <br />
              Severity: {emg.severity}
              <br />
              Description: {emg.description}
              <br />
              Contact: {emg.contact}
            </Popup>
          </Marker>
        ))}

        {/* ✅ Resource Markers */}
        {mapData.resources.map((res, index) => (
          <Marker
            key={`resource-${index}`}
            position={[res.latitude, res.longitude]}
            icon={blueIcon}
          >
            <Popup>
              <b>📦 Resource</b>
              <br />
              {res.resourceName} ({res.resourceType})
              <br />
              Quantity: {res.quantity}
              <br />
              Location: {res.location}
              <br />
              Contact: {res.contact}
            </Popup>
          </Marker>
        ))}

        {/* ✅ Volunteer Markers */}
        {mapData.volunteers.map((vol, index) => (
          <Marker
            key={`volunteer-${index}`}
            position={[vol.latitude, vol.longitude]}
            icon={greenIcon}
          >
            <Popup>
              <b>🧑‍🤝‍🧑 Volunteer</b>
              <br />
              Name: {vol.name}
              <br />
              Contact: {vol.contact}
              <br />
              Skills: {vol.skills?.join(", ") ?? "Not specified"}
              <br />
              Availability: {vol.availability}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapDisplay;

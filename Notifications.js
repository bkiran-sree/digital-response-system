import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Notifications = ({ resetAlerts }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("receiveAlert", (notification) => {
      setAlerts((prev) => [notification, ...prev]);
    });

    return () => socket.off("receiveAlert");
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔔 Alerts & Notifications</h2>

      <button
        onClick={() => {
          resetAlerts();
          setAlerts([]);
        }}
        style={{
          padding: "8px 12px",
          background: "red",
          color: "white",
          borderRadius: "5px",
          marginBottom: "12px",
        }}
      >
        Clear Notifications
      </button>

      {alerts.length === 0 ? (
        <p>No alerts yet.</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              ✅ {alert.type} submitted —{" "}
              {alert.data.location || alert.data.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

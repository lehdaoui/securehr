import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css";

function Logs() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://13.53.177.189:5001/api/logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Logs sécurité
          </h1>

          <p>
            Surveillance des événements système
            et cybersécurité
          </p>

        </div>

        <Link
          to="/dashboard"
          className="add-btn"
        >
          Retour Dashboard
        </Link>

      </div>

      {/* TABLE */}

      <div className="table-card">

        <table className="modern-table">

          <thead>

            <tr>

              <th>Email</th>

              <th>Action</th>

              <th>IP</th>

              <th>Date</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {logs.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="empty-message"
                >
                  Aucun log enregistré
                </td>

              </tr>

            ) : (

              logs.map((log) => (

                <tr key={log.id}>

                  <td>{log.email}</td>

                  <td>{log.action}</td>

                  <td>{log.ip}</td>

                  <td>
                    {new Date(log.created_at)
                      .toLocaleString()}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${log.status}`}
                    >
                      {log.status}
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Logs;
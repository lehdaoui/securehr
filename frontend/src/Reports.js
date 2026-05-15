import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Reports() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setEmployees(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  const total = employees.length;
  const active = employees.filter((e) => e.status === "Actif").length;
  const inactive = total - active;
  const salary = employees.reduce(
    (sum, emp) => sum + Number(emp.salary || 0),
    0
  );

  return (
    <div className="reports-page">
      <div className="reports-topbar">
        <div>
          <h1>Rapports RH</h1>
          <p>Analyse globale des employés et des activités RH</p>
        </div>

        <button onClick={() => navigate("/dashboard")}>
          Retour Dashboard
        </button>
      </div>

      <div className="reports-cards">
        <div className="report-card">
          <span>Total employés</span>
          <h2>{total}</h2>
        </div>

        <div className="report-card">
          <span>Employés actifs</span>
          <h2>{active}</h2>
        </div>

        <div className="report-card">
          <span>Employés inactifs</span>
          <h2>{inactive}</h2>
        </div>

        <div className="report-card">
          <span>Masse salariale</span>
          <h2>{salary} DH</h2>
        </div>
      </div>

      <div className="reports-section">
        <h3>Tableau récapitulatif des employés</h3>

        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Département</th>
              <th>Poste</th>
              <th>Salaire</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6">Aucun employé enregistré.</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.fullname}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.salary} DH</td>
                  <td>{emp.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="reports-section">
        <h3>Activités RH récentes</h3>

        <div className="activity-list">
          <div className="activity-item">Connexion administrateur sécurisée</div>
          <div className="activity-item">Gestion des employés activée</div>
          <div className="activity-item">Rapport RH généré automatiquement</div>
          <div className="activity-item">Surveillance des accès en cours</div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
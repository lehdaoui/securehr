import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [activities, setActivities] = useState([]);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    fullname: "",
    email: "",
    department: "",
    position: "",
    salary: "",
    status: "Actif",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivities(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchEmployees();
    fetchActivities();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const total = employees.length;
  const active = employees.filter((emp) => emp.status === "Actif").length;
  const inactive = total - active;

  const salary = employees.reduce(
    (sum, emp) => sum + Number(emp.salary || 0),
    0
  );

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEmployees();
      fetchActivities();
    } catch (err) {
      console.log(err);
    }
  };

  const openEdit = (emp) => {
    setEditingEmployee(emp.id);

    setEditForm({
      fullname: emp.fullname,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      status: emp.status,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const updateEmployee = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5001/api/employees/${editingEmployee}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingEmployee(null);
      fetchEmployees();
      fetchActivities();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="enterprise-layout">
      <aside className="enterprise-sidebar">
        <div className="enterprise-logo">
          <div className="logo-box">HR</div>

          <div>
            <h2>SecureHR</h2>
            <span>Enterprise Platform</span>
          </div>
        </div>

        <nav className="enterprise-menu">
          <button className="active" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/employees")}>
            Ajouter employé
          </button>

          <button onClick={() => navigate("/reports")}>
            Rapports RH
          </button>

          <button onClick={() => navigate("/logs")}>
            Logs sécurité
          </button>
        </nav>

        <div className="enterprise-user">
          <div className="user-circle">A</div>

          <div>
            <strong>{user?.name || "Administrateur RH"}</strong>
            <p>{user?.role || "Admin"}</p>
          </div>
        </div>

        <button className="logout-enterprise" onClick={logout}>
          Déconnexion
        </button>
      </aside>

      <main className="enterprise-main">
        <header className="enterprise-header">
          <div>
            <h1>Tableau de bord RH</h1>
            <p>Vue globale des employés et des activités internes.</p>
          </div>

          <div className="header-actions">
            <input type="text" placeholder="Rechercher un employé..." />
            <button>Notifications</button>
          </div>
        </header>

        <section className="enterprise-stats three-cards">
          <div className="enterprise-card">
            <span className="card-label">Total employés</span>
            <h2>{total}</h2>
            <p>Effectif global de l’entreprise</p>
          </div>

          <div className="enterprise-card">
            <span className="card-label">Employés actifs</span>
            <h2>{active}</h2>
            <p>Comptes actuellement actifs</p>
          </div>

          <div className="enterprise-card">
            <span className="card-label">Masse salariale</span>
            <h2>{salary} DH</h2>
            <p>Total des salaires enregistrés</p>
          </div>
        </section>

        <section className="enterprise-grid">
          <div className="enterprise-panel">
            <div className="panel-title">
              <h3>Répartition RH</h3>
              <span>Données actuelles</span>
            </div>

            <div className="rh-distribution">
              <div className="clean-donut"></div>

              <div className="distribution-list">
                <div>
                  <span>Total employés</span>
                  <strong>{total}</strong>
                </div>

                <div>
                  <span>Employés actifs</span>
                  <strong>{active}</strong>
                </div>

                <div>
                  <span>Employés inactifs</span>
                  <strong>{inactive}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="enterprise-panel">
            <div className="panel-title">
              <h3>Activités récentes</h3>
              <span>Aujourd’hui</span>
            </div>

            <div className="activity-list">
              {activities.length === 0 ? (
                <div className="empty-activity">
                  Aucune activité récente
                </div>
              ) : (
                activities.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <strong>{activity.type}</strong>
                    <p>{activity.message}</p>
                    <small>{activity.created_at}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="enterprise-panel">
          <div className="panel-title">
            <h3>Derniers employés ajoutés</h3>

            <button onClick={() => navigate("/employees")}>
              Ajouter
            </button>
          </div>

          {editingEmployee && (
            <form className="employee-form edit-form" onSubmit={updateEmployee}>
              <input
                name="fullname"
                value={editForm.fullname}
                onChange={handleEditChange}
                placeholder="Nom complet"
                required
              />

              <input
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
                required
              />

              <input
                name="department"
                value={editForm.department}
                onChange={handleEditChange}
                placeholder="Département"
                required
              />

              <input
                name="position"
                value={editForm.position}
                onChange={handleEditChange}
                placeholder="Poste"
                required
              />

              <input
                name="salary"
                type="number"
                value={editForm.salary}
                onChange={handleEditChange}
                placeholder="Salaire"
                required
              />

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              >
                <option>Actif</option>
                <option>Inactif</option>
              </select>

              <button type="submit" className="edit-btn">
                Enregistrer
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => setEditingEmployee(null)}
              >
                Annuler
              </button>
            </form>
          )}

          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Département</th>
                <th>Poste</th>
                <th>Salaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="7">Aucun employé ajouté</td>
                </tr>
              ) : (
                employees.slice(0, 6).map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.fullname}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.salary} DH</td>

                    <td>
                      <span
                        className={
                          emp.status === "Actif"
                            ? "status active"
                            : "status inactive"
                        }
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-btn"
                          onClick={() => openEdit(emp)}
                        >
                          Modifier
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteEmployee(emp.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
import "./App.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Employees() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    department: "",
    position: "",
    salary: "",
    status: "Actif",
  });

  const token = localStorage.getItem("token");

  const resetForm = () => {
    setForm({
      fullname: "",
      email: "",
      department: "",
      position: "",
      salary: "",
      status: "Actif",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addEmployee = async (e) => {

    e.preventDefault();

    console.log("TOKEN :", token);

    try {

      const response = await axios.post(
        "http://13.53.177.189:5001/api/employees",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("SUCCESS :", response.data);

      alert("Employé ajouté avec succès");

      resetForm();

      navigate("/dashboard");

    } catch (err) {

      console.log("ERREUR COMPLETE :", err);

      console.log(
        "REPONSE BACKEND :",
        err.response?.data
      );

      console.log(
        "STATUS :",
        err.response?.status
      );

      alert(
        err.response?.data?.message ||
        "Erreur lors de l'ajout"
      );

    }

  };

  return (

    <div className="employees-page">

      <div className="employees-topbar">

        <div>

          <h1>
            Ajouter un employé
          </h1>

          <p>
            Gestion centralisée des employés
            de l’entreprise
          </p>

        </div>

        <button
          className="dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          Retour Dashboard
        </button>

      </div>

      <div className="employee-form-card">

        <div className="form-header">

          <h3>
            Informations employé
          </h3>

          <div className="blue-line"></div>

        </div>

        <form
          className="employee-form"
          onSubmit={addEmployee}
        >

          <input
            type="text"
            name="fullname"
            placeholder="Nom complet"
            value={form.fullname}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Département"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="position"
            placeholder="Poste"
            value={form.position}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="salary"
            placeholder="Salaire"
            value={form.salary}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Actif</option>
            <option>Inactif</option>
          </select>

          <div className="form-buttons">

            <button
              type="submit"
              className="save-btn"
            >
              Enregistrer
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Annuler
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default Employees;
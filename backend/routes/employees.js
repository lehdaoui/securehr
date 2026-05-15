const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* GET EMPLOYEES */
router.get("/", authMiddleware, (req, res) => {
  db.all("SELECT * FROM employees ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur récupération employés",
      });
    }

    res.json(rows);
  });
});

/* ADD EMPLOYEE */
router.post("/", authMiddleware, (req, res) => {
  const { fullname, email, department, position, salary, status } = req.body;

  if (!fullname || !email || !department || !position || !salary) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires",
    });
  }

  db.run(
    `INSERT INTO employees
    (fullname, email, department, position, salary, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [fullname, email, department, position, salary, status || "Actif"],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: "Erreur ajout employé",
        });
      }

      db.run(
        `INSERT INTO activities (type, message)
         VALUES (?, ?)`,
        ["Ajout employé", `Nouvel employé ajouté : ${fullname}`]
      );

      db.run(
        `INSERT INTO security_logs (email, action, ip, status)
         VALUES (?, ?, ?, ?)`,
        [email, "Ajout employé", req.ip, "Succès"]
      );

      res.json({
        message: "Employé ajouté avec succès",
        id: this.lastID,
      });
    }
  );
});

/* UPDATE EMPLOYEE */
router.put("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { fullname, email, department, position, salary, status } = req.body;

  if (!fullname || !email || !department || !position || !salary) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires",
    });
  }

  db.run(
    `UPDATE employees
     SET fullname = ?, email = ?, department = ?, position = ?, salary = ?, status = ?
     WHERE id = ?`,
    [fullname, email, department, position, salary, status || "Actif", id],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: "Erreur modification employé",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Employé introuvable",
        });
      }

      db.run(
        `INSERT INTO activities (type, message)
         VALUES (?, ?)`,
        ["Modification employé", `Employé modifié : ${fullname}`]
      );

      db.run(
        `INSERT INTO security_logs (email, action, ip, status)
         VALUES (?, ?, ?, ?)`,
        [email, "Modification employé", req.ip, "Succès"]
      );

      res.json({
        message: "Employé modifié avec succès",
      });
    }
  );
});

/* DELETE EMPLOYEE */
router.delete("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM employees WHERE id = ?", [id], (err, employee) => {
    if (err || !employee) {
      return res.status(404).json({
        message: "Employé introuvable",
      });
    }

    db.run("DELETE FROM employees WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({
          message: "Erreur suppression",
        });
      }

      db.run(
        `INSERT INTO activities (type, message)
         VALUES (?, ?)`,
        ["Suppression employé", `Employé supprimé : ${employee.fullname}`]
      );

      db.run(
        `INSERT INTO security_logs (email, action, ip, status)
         VALUES (?, ?, ?, ?)`,
        [employee.email, "Suppression employé", req.ip, "Succès"]
      );

      res.json({
        message: "Employé supprimé",
      });
    });
  });
});

module.exports = router;
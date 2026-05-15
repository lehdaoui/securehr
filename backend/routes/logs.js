const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  db.all(
    "SELECT * FROM security_logs ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur récupération logs",
        });
      }

      res.json(rows);
    }
  );
});

module.exports = router;
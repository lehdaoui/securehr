const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  db.all(
    "SELECT * FROM activities ORDER BY id DESC LIMIT 5",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur activités",
        });
      }

      res.json(rows);
    }
  );
});

module.exports = router;
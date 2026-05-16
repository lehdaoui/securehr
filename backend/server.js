require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("./db");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const activitiesRoutes = require("./routes/activities");
const logsRoutes = require("./routes/logs");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Trop de tentatives. Réessayez plus tard.",
  },
});

app.use("/api/auth/login", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/logs", logsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "SecureHR API fonctionne",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur SecureHR démarré sur le port ${PORT}`);
});
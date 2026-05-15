const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db");

const router = express.Router();

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    // Détection SQL Injection simple
    const suspiciousPatterns = ["'", "--", ";", " OR ", "DROP", "="];

    const suspicious = suspiciousPatterns.some(pattern =>
        email.includes(pattern) || password.includes(pattern)
    );

    if (suspicious) {

        db.run(
            `INSERT INTO security_logs (email, action, ip, status)
             VALUES (?, ?, ?, ?)`,
            [
                email,
                "Tentative SQL Injection",
                req.ip,
                "Bloqué"
            ]
        );

        return res.status(400).json({
            message: "Activité suspecte détectée"
        });
    }

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: "Erreur serveur"
                });
            }

            if (!user) {

                db.run(
                    `INSERT INTO security_logs (email, action, ip, status)
                     VALUES (?, ?, ?, ?)`,
                    [
                        email,
                        "Échec connexion",
                        req.ip,
                        "Refusé"
                    ]
                );

                return res.status(401).json({
                    message: "Utilisateur introuvable"
                });
            }

            const validPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!validPassword) {

                db.run(
                    `INSERT INTO security_logs (email, action, ip, status)
                     VALUES (?, ?, ?, ?)`,
                    [
                        email,
                        "Mot de passe incorrect",
                        req.ip,
                        "Refusé"
                    ]
                );

                return res.status(401).json({
                    message: "Mot de passe incorrect"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "8h"
                }
            );

            db.run(
                `INSERT INTO security_logs (email, action, ip, status)
                 VALUES (?, ?, ?, ?)`,
                [
                    email,
                    "Connexion réussie",
                    req.ip,
                    "Autorisé"
                ]
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
});

module.exports = router;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Accès refusé"
            });
        }

        const verified = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (error) {
        res.status(401).json({
            message: "Token invalide"
        });
    }
};

module.exports = authMiddleware;
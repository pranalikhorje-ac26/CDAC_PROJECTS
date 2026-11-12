const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const verifyToken = async (req, res, next) => {
    try {
        // Get token from request header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Token not provided."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user from database
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Attach user information to request
        req.user = user;

        // Move to next middleware or route
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = verifyToken;
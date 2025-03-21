const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token
// Extracts token from the Authorization header
// Verifies the token using the secret key
// Sets req.user_id if the token is valid
// Responds with appropriate error messages if the token is invalid or expired
// Proceeds to the next middleware if the user is an admin if the token is good

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message:
          err.name === "TokenExpiredError"
            ? "Token expired"
            : "Invalid authorization token",
      });
    }
    req.user_id = payload.id;
    next();
  });
}

module.exports = verifyToken;

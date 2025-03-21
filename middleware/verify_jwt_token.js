const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token
// Extracts token from the Authorization header
// Verifies the token using the secret key
// Sets req.user_id if the token is valid
// Responds with appropriate error messages if the token is invalid or expired
// Proceeds to the next middleware if the user is an admin if the token is good

function verifyToken(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, payload) => {
      if (err) {
        res.status(401);
        if (err.name === "TokenExpiredError") {
          res.json({ message: "Token expired" });
          $;
        } else {
          res.json({ message: "Token invalid" });
        }
        return;
      } else {
        req.user_id = payload.id;
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ message: "Token required" });
  }
}
module.exports = verifyToken;

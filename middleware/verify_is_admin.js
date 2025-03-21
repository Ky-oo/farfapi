const jwt = require("jsonwebtoken");

// Middleware to verify if the user is an admin
// Retrieves the JWT token from the authorization header
// Decodes the token to get user information
// Checks if the user is not an admin
// Returns a 403 Forbidden response if the user is not an admin
// Proceeds to the next middleware if the user is an admin
function verifyIsAdmin(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.decode(token);
  if (!user.isAdmin) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
}

module.exports = verifyIsAdmin;

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.header("Authorization");

  //console.log("Received token:", token);

  if (!token)
    return res.status(401).json({ message: "No token, access denied" });

  // Handle 'Bearer <token>' format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;

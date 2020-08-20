const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const secret = process.env.AUTH_SECRET;
  let token = req.headers["access-token"];
  if (!token) {
    return res.status(400).json({
      message: "access-token header required",
    });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.statusCode = 401;
        return res.json({
          message: "access-token is not valid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.statusCode = 400;
    return res.json({
      message: "access-token is not supplied",
    });
  }
};

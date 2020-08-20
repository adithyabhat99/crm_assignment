const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const secret = process.env.AUTH_SECRET;
  let token = req.headers["access-token"];
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.statusCode = 401;
        return res.json({
          error: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        if (decoded["type1"] != "pg") {
          res.statusCode = 401;
          return res.json({
            error: "Token is not valid,user is not a pg owner",
          });
        }
        next();
      }
    });
  } else {
    res.statusCode = 400;
    return res.json({
      error: "Auth token is not supplied",
    });
  }
};

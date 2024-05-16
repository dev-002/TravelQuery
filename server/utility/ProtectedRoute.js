const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const bearer_token = req.headers?.token;
    if (bearer_token) {
      const token = bearer_token.split(" ")[1];
      const data = jwt.verify(token, process.env.TOKEN_SECRET);
      if (data) {
        req.data = data;
        next();
      } else throw new Error("Token Expired");
    } else throw new Error("user not logged in");
  } catch (err) {
    return res.status(401).json({ ack: false, msg: err });
  }
};

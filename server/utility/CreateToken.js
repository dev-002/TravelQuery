const jwt = require("jsonwebtoken");

module.exports = async (data) => {
  try {
    const token = jwt.sign(data, process.env.TOKEN_SECRET);
    if (Boolean(token)) {
      const bearer_token = "bearer " + token;
      if (bearer_token) return bearer_token;
    }
  } catch (err) {
    return res.status(500).json({ ack: false, msg: err });
  }
};

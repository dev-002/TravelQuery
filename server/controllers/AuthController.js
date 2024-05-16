const User = require("../models/user");
const Guide = require("../models/guide");
const bcrypt = require("bcrypt");
const CreateToken = require("../utility/CreateToken");

const login = async (req, res, next) => {
  const { role, password, mobile } = req.body;
  try {
    if (Boolean(role) && Boolean(password) && Boolean(mobile)) {
      let result;
      // user
      if (role === 2) {
        result = await User.findOne({
          mobile,
        });
      }
      // guide
      if (role === 3) {
        result = await Guide.findOne({
          mobile,
        });
      }

      if (result) {
        if (bcrypt.compare(password, result.password)) {
          const token = await CreateToken({
            name: req.body.name,
            mobile: req.body.mobile,
            role,
          });
          result.password = null;
          return res.status(200).json({ ack: true, result, token });
        } else throw new Error("Invalid credentials");
      } else throw new Error("No user exist");
    }
  } catch (err) {
    console.log("auth login error: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

const register = async (req, res, next) => {
  const { role } = req.body;
  try {
    if (Boolean(role)) {
      let result;
      // user
      if (role === 2) {
        result = await User.create({ ...req.body });
      }
      // guide
      if (role === 3) {
        result = await Guide.create({ ...req.body });
      }

      if (result) {
        const token = await CreateToken({
          name: req.body.name,
          mobile: req.body.mobile,
          role,
        });
        console.log(token);
        result.password = null;
        return res.status(201).json({ ack: true, result, token });
      } else throw new Error("auth register error");
    }
  } catch (err) {
    console.log("auth register error: ", err);
    return res.status(500).json({ ack: false, err });
  }
};

module.exports = { login, register };

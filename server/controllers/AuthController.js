const User = require("../models/user");
const Guide = require("../models/guide");
const bcrypt = require("bcrypt");
const CreateToken = require("../utility/CreateToken");
const { AwsInstance } = require("twilio/lib/rest/accounts/v1/credential/aws");

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

//
let Temp_otp;
const sendOTP = async (req, res, next) => {
  const { mobile } = req.body;
  try {
    const client = require("twilio")(
      process.env.TWILLO_SID,
      process.env.TWILLO_TOKEN
    );

    const otp = Math.floor(100000 + Math.random() * 900000);
    Temp_otp = otp;
    client.messages
      .create({
        body: otp,
        to: mobile,
        from: "+918755737078",
      })
      .then((message) => {
        console.log(message.sid);
        return res.status(200).json({ ack: true });
      });
  } catch (err) {
    return res.status(500).json({ ack: false, err });
  }
};

const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;
  try {
    if (Temp_otp == otp) return res.status(200).json({ ack: true });
    else throw new Error("Wrong OTP");
  } catch (err) {
    return res.status(500).json({ ack: false, err });
  }
};

const changePass = async (req, res, next) => {
  const { newPass, mobile, role } = req.body;

  try {
    let user;
    if (role == 2) {
      user = await User.findOne({ mobile });
    } else user = await Guide.findOne({ mobile });

    if (user) {
      user =
        role == 2
          ? await User.fingByIdAndUpdate(
              user._id,
              { $set: { password: newPass } },
              { new: true }
            )
          : Guide.fingByIdAndUpdate(
              user._id,
              { $set: { password: newPass } },
              { new: true }
            );

      if (user) return res.status(200).json({ ack: true, user });
      else throw new Error("error while updating Pass");
    } else throw new Error("User doesn't exist");
  } catch (err) {
    return res.status(500).json({ ack: false, err });
  }
};

module.exports = { login, register, sendOTP, verifyOTP, changePass };

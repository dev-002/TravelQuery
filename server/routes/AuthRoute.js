const express = require("express");
const router = express.Router();

// controllers
const {
  login,
  register,
  sendOTP,
  verifyOTP,
  changePass,
} = require("../controllers/AuthController");

router.post("/login", login);
router.post("/register", register);
router.post("/forget", sendOTP);
router.post("/verify", verifyOTP);
router.post("/change", changePass);

module.exports = router;

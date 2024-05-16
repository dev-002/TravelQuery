const express = require("express");
const router = express.Router();

// controllers
const { login, register } = require("../controllers/AuthController");

router.post("/login", login);
router.post("/register", register);
router.get("/test", (req, res) => res.send("Route working"));

module.exports = router;

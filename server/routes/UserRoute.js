const express = require("express");
const ProtectedRoute = require("../utility/ProtectedRoute");

const router = express.Router();

// controllers
const { getUser, updateUser } = require("../controllers/UserController");

router.get("/", ProtectedRoute, getUser);
router.put("/", ProtectedRoute, updateUser);

module.exports = router;

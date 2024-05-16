const express = require("express");
const router = express.Router();

// imports
const AuthRoute = require("./AuthRoute");
const UserRoute = require("./UserRoute");
const GuideRoute = require("./GuideRoute");
const PlaceRoute = require("./PlaceRoute");
const ProfileRoute = require("./ProfileRoute");
const TravelPlanRoute = require("./TravelPlanRoute");

const ProtectedRoute = require("../utility/ProtectedRoute");

// routes
router.use("/auth", AuthRoute);
router.use("/user", UserRoute);
router.use("/travel-plans", TravelPlanRoute);
router.use("/guide", ProtectedRoute, GuideRoute);
router.use("/places", ProtectedRoute, PlaceRoute);
router.use("/profile", ProtectedRoute, ProfileRoute);

module.exports = router;

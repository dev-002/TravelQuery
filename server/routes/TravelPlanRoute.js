const express = require("express");
const router = express.Router();

const {
  fetchAllPlan,
  fetchSpecificPlan,
  createPlan,
  updatePlan,
  deletePlan,
  searchMember,
  searchPlace,
  searchGuide,
} = require("../controllers/TravelPlanController");
const ProtectedRoute = require("../utility/ProtectedRoute");

router.get("/", ProtectedRoute, fetchAllPlan);
router.post("/", ProtectedRoute, fetchSpecificPlan);
router.post("/", ProtectedRoute, createPlan);
router.put("/", ProtectedRoute, updatePlan);
router.delete("/", ProtectedRoute, deletePlan);

router.post("/search/member", searchMember);
router.post("/search/places", searchPlace);
router.post("/search/guide", searchGuide);

module.exports = router;

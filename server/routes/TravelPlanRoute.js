const express = require("express");
const router = express.Router();

const {
  fetchAllPlan,
  fetchSpecificPlan,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/TravelPlanController");

router.get("/", fetchAllPlan);
router.get("/", fetchSpecificPlan);
router.post("/", createPlan);
router.put("/", updatePlan);
router.delete("/", deletePlan);

module.exports = router;

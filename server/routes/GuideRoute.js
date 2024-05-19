const express = require("express");
const router = express.Router();

const {
  fetchAllGuide,
  fetchSpecificGuide,
  updateGuide,
  deleteGuide,
  fetchGuideAreas,
  fetchTravelPlans,
  fetchReviews,
} = require("../controllers/GuideController");

router.get("/", fetchAllGuide);
router.post("/", fetchSpecificGuide);

router.put("/", updateGuide);
router.delete("/", deleteGuide);

router.get("/area", fetchGuideAreas);
router.get("/travelPlan", fetchTravelPlans);
router.get("/reviews", fetchReviews);

module.exports = router;

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
  searchGuide,
  postReview,
  fetchGuideReview,
  QuoteGenerator,
} = require("../controllers/GuideController");

router.get("/", fetchAllGuide);
router.post("/", fetchSpecificGuide);
router.put("/", updateGuide);
router.delete("/", deleteGuide);

router.get("/area", fetchGuideAreas);
router.get("/travelPlan", fetchTravelPlans);
router.get("/reviews", fetchReviews);
router.post("/reviews", postReview);

router.post("/reviews/guide", fetchGuideReview);

router.post("/search", searchGuide);

router.get("/screen/quote", QuoteGenerator);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  fetchPlace,
  addPlace,
  updatePlace,
  deletePlace,
  searchPlace,
  addReview,
  fetchReviews,
} = require("../controllers/PlaceController");

router.post("/", fetchPlace);
router.post("/add", addPlace);
router.put("/", updatePlace);
router.delete("/", deletePlace);
router.post("/search", searchPlace);
router.post("/review/add", addReview);
router.get("/review", fetchReviews);

module.exports = router;

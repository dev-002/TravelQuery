const express = require("express");
const router = express.Router();

const {
  fetchAllGuide,
  fetchSpecificGuide,
  updateGuide,
  deleteGuide,
} = require("../controllers/GuideController");

router.get("/", fetchAllGuide);
router.post("/", fetchSpecificGuide);
router.put("/", updateGuide);
router.delete("/", deleteGuide);

module.exports = router;

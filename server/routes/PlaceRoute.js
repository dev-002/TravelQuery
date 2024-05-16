const express = require("express");
const router = express.Router();

const {
  fetchPlace,
  addPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/PlaceController");

router.post("/", fetchPlace);
router.post("/add", addPlace);
router.put("/", updatePlace);
router.delete("/", deletePlace);

module.exports = router;

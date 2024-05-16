const express = require("express");
const router = express.Router();

// controllers
const {
  getUser,
  updateUser,
  toggleWishlist,
  fetchWishlist,
  checkWishlist,
} = require("../controllers/ProfileController");

router.get("/", getUser);
router.put("/", updateUser);
router.get("/wishlist", fetchWishlist);
router.post("/wishlist", toggleWishlist);
router.post("/wishlist/check", checkWishlist);

module.exports = router;

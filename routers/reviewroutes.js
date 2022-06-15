const express = require("express");
const {
  createReview,
  allReviews,
  oneReview,
  updateReview,
  deleteReview,
} = require("./../controllers/reviewcontroller");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

router.use(protect);
router.route("/").get(allReviews);
router.route("/:id").get(oneReview);
router.route(":/id").patch(restrictTo("user", "admin"), updateReview);
router.route(":/id").delete(restrictTo("user", "admin"), deleteReview);
router.route("/create").post(restrictTo("user"), createReview);

module.exports = router;

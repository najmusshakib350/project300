const express = require("express");
const {
  setProfile,
  getProfile,
} = require("./../controllers/profilecontroller");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, setProfile).get(protect, getProfile);

module.exports = router;

//Third party module
const express = require("express");
const {
  getMe,
  getuser,
  getAllUsers,
  updateUser,
  deleteUser,
  createUsers,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  deleteMe,
} = require("./../controllers/usercontroller");
const {
  protect,
  signup,
  login,
  logout,
  restrictTo,
} = require("../controllers/authController");

// Mounting multiple router
const router = express.Router();

//Route delear for user
router.get("/me", protect, getMe, getuser);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

//Protect All routes after this middleware
router.use(protect);


router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUsers);
router.route("/:id").get(getuser).patch(updateUser).delete(deleteUser);

module.exports = router;

const router = require("express").Router();
const {
  createCartItem,
  getCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cartcontroller");
const { protect, restrictTo } = require("../controllers/authController");

router
  .route("/")
  .get(protect, restrictTo("user", "admin"), getCartItem)
  .post(protect, restrictTo("user", "admin"), createCartItem)
  .put(protect, restrictTo("user", "admin"), updateCartItem);

router
  .route("/:id")
  .delete(protect, restrictTo("user", "admin"), deleteCartItem);

module.exports = router;

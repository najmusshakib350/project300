const express = require("express");
const {
  getCheckoutSession,
  createPurchase,
  userPurchaseProduct,
  getAllPurchase,
  updatePurchase,
  deletePurchase,
  // createPurchaseCheckoutt
} = require("./../controllers/paymentcontroller");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

router.use(protect);

router.post("/checkout-session", getCheckoutSession);
// router.route('/df').post(createPurchaseCheckoutt)

router.use(restrictTo("admin", "user"));
router.route("/").get(getAllPurchase).post(createPurchase);

router
  .route("/:id")
  .get(userPurchaseProduct)
  .patch(updatePurchase)
  .delete(deletePurchase);

module.exports = router;

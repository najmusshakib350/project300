const express = require("express");
const {
  createProduct,
  allProducts,
  findOneProduct,
  deleteProduct,
  updateProduct,
  uploadProductImages,
  resizeProductImages,
} = require("./../controllers/productcontroller");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

router.route("/").get(allProducts);
router.route("/:id").get(findOneProduct);
router.route("/:id").delete(protect, restrictTo("admin"), deleteProduct);
router
  .route("/:id")
  .patch(
    protect,
    restrictTo("admin"),
    uploadProductImages,
    resizeProductImages,
    updateProduct
  );
router.route("/create").post(protect, restrictTo("admin"), uploadProductImages,
resizeProductImages,createProduct);

module.exports = router;

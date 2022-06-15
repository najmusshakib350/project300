const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
  });
  return next();
});

module.exports.Cart = mongoose.model("Cart", cartSchema);

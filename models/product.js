const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
      maxlength: [
        40,
        "A product name must have less or equal than 40 characters",
      ],
      minlength: [
        2,
        "A product name must have more or equal than 10 characters",
      ],
    },
    ratingAverage: {
      type: Number,
      default: 4,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be bellow 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 4,
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    quantity:{
      type:Number,
      default:0
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "catname",
  });
  return next();
});

//virtual populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

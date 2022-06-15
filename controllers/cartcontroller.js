const { Cart } = require("./../models/cart");
const Product = require("./../models/product");
const catchasync = require("./../utils/catchasync");
const _ = require("lodash");

//createCartItem
module.exports.createCartItem = catchasync(async function (req, res, next) {
  const { price, product } = _.pick(req.body, ["price", "product"]);

  const item = await Cart.findOne({
    user: req.user._id,
    product: product,
  });

  const singleProduct= await Product.findById(product);
  if(singleProduct.quantity <= 0 ){
    return res.status(200).json({
      status: "This product is outof stock!",
    });
  }
 
  if (item) {
    return res.status(400).json({
      status: "Item already exists in Cart!",
    });
  }
  const cartItem = new Cart({
    price: price,
    product: product,
    user: req.user._id,
  });
  const result = await cartItem.save();
  res.status(201).json({
    status: "Added to cart successfully!!!",
    data: {
      result,
    },
  });
});

//getCartItem

module.exports.getCartItem = catchasync(async function (req, res, next) {
  const cartItem = await Cart.find({
    user: req.user._id,
  });
  res.status(200).json({
    status: "Cart item find out successfully!!!",
    data: {
      cartItem,
    },
  });
});

//update cartItem
module.exports.updateCartItem = catchasync(async function (req, res, next) {
  const { _id, count } = _.pick(req.body, ["count", "_id"]);
  const cartItem = await Cart.updateOne(
    { _id: _id, user: req.user._id },
    { count: count }
  );
  res.status(200).json({
    status: "cartItem update successfully!!!",
    data: {
      cartItem,
    },
  });
});
//delete cartItem
module.exports.deleteCartItem = catchasync(async function (req, res, next) {
  await Cart.deleteOne({ id: req.params._id, user: req.user._id });
  res.status(204).json({
    status: "cartItem delete successfully!!!",
  });
});

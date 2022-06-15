const Review = require("./../models/review");
const handlerFactory = require("./handlerFactory");

module.exports.createReview = handlerFactory.createOne(Review);
module.exports.allReviews = handlerFactory.getAll(Review);
module.exports.oneReview = handlerFactory.getOne(Review);
module.exports.updateReview = handlerFactory.updateOne(Review);
module.exports.deleteReview = handlerFactory.deleteOne(Review);

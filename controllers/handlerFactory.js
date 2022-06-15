const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/apperror");
const catchasync = require("./../utils/catchasync");

//create
module.exports.createOne = function (Model) {
  return catchasync(async function (req, res, next) {
    console.log("Heloo request")
    console.log(req.body)
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc: document,
      },
    });
  });
};

//getAll
module.exports.getAll = function (Model) {
  return catchasync(async function (req, res, next) {
    const featuresInstance = new APIFeatures(Model, req.query);
    const features = featuresInstance.filter();
    const document = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        doc: document,
      },
    });
  });
};
//getOne
module.exports.getOne = function (Model, populateOption) {
  return catchasync(async function (req, res, next) {
    let query = Model.findById(req.params.id);
    if (populateOption) query = query.populate(populateOption);

    const document = await query;

    if (!document) {
      return next(new AppError("No Document found with that Id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc: document,
      },
    });
  });
};

//updateOne
module.exports.updateOne = function (Model) {
  return catchasync(async function (req, res, next) {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError("No Document found with that Id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc: document,
      },
    });
  });
};

//DeleteOne

module.exports.deleteOne = function (Model) {
  return catchasync(async function (req, res, next) {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError("No Document found with that Id", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};

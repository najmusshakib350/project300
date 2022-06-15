const Category = require("./../models/category");
const AppError = require("./../utils/apperror");
const catchasync = require("./../utils/catchasync");
const Product = require("./../models/product");

//create category
module.exports.createCategory = catchasync(async function (req, res, next) {
  let allCat;

  if(req.body.parentstatus === undefined){
    req.body.parentid = 0;
  }
  else if (req.body.parentstatus === "Main") {
    req.body.parentid = 0;
  } else {
    allCat = await Category.find({ catname: req.body.parentstatus });
    req.body.parentid = allCat[0]._id;
  }

  const createCat = await Category.create(req.body);

  res.status(201).json({
    status: "category created successfully!!!",
    createCat,
  });
});

//find out All category
module.exports.findAllCategory = catchasync(async function (req, res, next) {
  const categories = await Category.find({});
  res.status(200).json({
    status: "all category find out successfully!!!",
    categories,
  });
});

//find out one category
module.exports.findOneCategory = catchasync(async function (req, res, next) {
  const category = await Category.findById(req.params.id);
  res.status(200).json({
    status: "category find out successfully!!!",
    category,
  });
});

//delete category
module.exports.deleteCategory = catchasync(async function (req, res, next) {
  //child category delete
  const childCategory = await Category.find({ parentid: req.params.id });
  childCategory.forEach(async (el) => {
    await Category.findByIdAndDelete(el._id);
  });
  //parent category delete
  const category = await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "category delete successfully!!!",
    category,
  });

  //product delete
  await Product.deleteMany({ category: req.params.id });
});

//update category
module.exports.updateCategory = catchasync(async function (req, res, next) {
  //child category update
  const childCategory = await Category.find({ parentid: req.params.id });
  childCategory.forEach(async (el) => {
    el.parentstatus = req.body.catname;
    await Category.findByIdAndUpdate(el._id, el, {
      new: true,
      runValidators: true,
    });
  });
  //parent category update
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "category update successfully!!!",
    category,
  });
});

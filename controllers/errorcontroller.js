//development error middleware
function developmentError(err, req, res) {
  res.status(err.statuscode).json({
    status: err.status,
    message: err.message,
    err,
  });
}
//production error middleware
function productionError(err, req, res) {
  if (err.isoperational) {
    res.status(err.statuscode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went error!!!",
    });
  }
}

module.exports = (err, req, res, next) => {
  console.log("Hello i am globalError Handle");
  console.log(err.response)
  err.statuscode = err.statuscode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    developmentError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    productionError(err, req, res);
  }

  return next();
};

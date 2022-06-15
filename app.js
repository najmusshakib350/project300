const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routers/userroutes");
const cartRouter = require("./routers/cartroutes");
const profileRouter = require("./routers/profileroutes");
const paymentRouter = require("./routers/paymentroutes");
const { webhookCheckout } = require("./controllers/paymentcontroller");

const express = require("express");
const AppError = require("./utils/apperror");
const GlobalError = require("./controllers/errorcontroller");
const categoryRouter = require("./routers/categoryroutes");
const productRouter = require("./routers/productroutes");
const reviewRouter = require("./routers/reviewroutes");
const app = express();
//webhook-checkout
app.post("/webhook-checkout",express.raw({type: 'application/json'}),webhookCheckout);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Solv cross origin policy problem
app.use(cors());
//Router mount
app.use("/api/category/", categoryRouter);
app.use("/api/user/", userRouter);
app.use("/api/product", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/cart/", cartRouter);
app.use("/api/profile", profileRouter);
app.use("/api/payment/", paymentRouter);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`can not findout this url: ${req.originalUrl}`, 404)
  );
});
app.use(GlobalError);
module.exports = app;

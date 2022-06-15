const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { User } = require("./../models/people");
const catchAsync = require("./../utils/catchasync");
const { Cart } = require("../models/cart");
const Profile = require("./../models/profile");
const Purchase = require("./../models/purchaseItems");
const factory = require("./handlerFactory");
const Email = require("./../utils/email");

module.exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  
  const userId = req.user.id;

  const Items = await Cart.find({ user: userId });
  //const profile = await Profile.findOne({ user: userId });

  
  //Product Name
  const allProductName = Items.map((item) => {
    return item.product.name;
  });
  //Product Id
  const allProductId = Items.map((item) => {
    return item.product._id;
  });

  const total_amount = Items.map((item) => item.count * item.price).reduce(
    (a, b) => a + b,
    0
  );

  //Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
   
     success_url:`http://localhost:3000/my/product`,
    cancel_url: `http://localhost:3000/`,
    mode: 'payment',
    //Client code added
     // Adding the shipping prices
     shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 900,
            currency: 'usd',
          },
          display_name: 'Regular shipping',
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          }
        }
      },
      
    ],
    allow_promotion_codes: true,
    //client code end
    customer_email: req.user.email,
    client_reference_id: allProductId.join(" "),
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: allProductName.join(" "),
            images: [`${req.protocol}://${req.get('host')}/img/products/${Items[0].product.photo}`],
          },
          unit_amount: total_amount * 100,
        },
        //client code added start
        quantity: allProductId,
        tax_rates: [process.env.TAX_ID]
        //client code end
      },
    ],
    mode: "payment",
  });
  res.status(200).json({
    status: "success",
    session,
  });
  //res.redirect(303,  session.url);
});


// module.exports.createPurchaseCheckoutt=async (req,res,next) => {

  
//   let session={
//    client_reference_id:"62a8512ca50a04acbe90503c",
//    customer_details:{
//      email:"najmusshakib1997@gmail.com"
//    },
//    amount_total:20000
//   }
 
 
 
//    const productStr = session.client_reference_id;
//    const product = productStr.split(" ");
//    // const user = (await User.findOne({ email: session.customer_email })).id;
  
//    const user = await User.findOne({ email: session.customer_details.email });
//    console.log("Hello...................")
//    console.log(product)
//    console.log(user)
//    const userId=user._id;
//    // const price = session.line_items[0].amount / 100;
//    const price = session.amount_total / 100;
//    await Purchase.create({ product,user:userId, price });
//    await Cart.deleteMany({user:userId});
//     //3) Send it to user's email
//     try {
   
//      await new Email(user, '').sendPurchaseEmail();
//      res.status(200).json({
//        status: "success",
//        message: "sent to email",
//      });
//    } catch (err) {
//      res.status(500).json({
//        message:"There was an error sending the email. Try again later"
//      })
//    }
//  };


const createPurchaseCheckout = async (session) => {

  const productStr = session.client_reference_id;
  const product = productStr.split(" ");
  // const user = (await User.findOne({ email: session.customer_email })).id;
  const user = (await User.findOne({ email: session.customer_details.email }));
  const userId=user._id;
  // const price = session.line_items[0].amount / 100;
  const price = session.amount_total / 100;
  await Purchase.create({ product,user:userId, price });
  await Cart.deleteMany({user:userId});
   //3) Send it to user's email
   try {
    await new Email(user, '').sendPurchaseEmail();
  } catch (err) {
  }
};

module.exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed"){
    createPurchaseCheckout(event.data.object);
  }


  res.status(200).json({ received: true });
};

module.exports.createPurchase = factory.createOne(Purchase);
module.exports.getAllPurchase = factory.getAll(Purchase);
module.exports.updatePurchase = factory.updateOne(Purchase);
module.exports.deletePurchase = factory.deleteOne(Purchase);

module.exports.userPurchaseProduct=catchAsync(async function (req, res, next) {
  let document = await Purchase.find( {user:req.params.id});

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


const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  phone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  postcode: Number,
  country: String,
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;

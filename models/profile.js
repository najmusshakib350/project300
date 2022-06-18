const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  //phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  postal_code: Number,
  country: String,
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;

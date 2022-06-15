const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    catname: {
      type: String,
      unique:true
    },
    parentstatus: {
      type: String,
      default: "Main",
    },
    parentid: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

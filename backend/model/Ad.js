const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add title"],
    },
    description: {
      type: String,
      required: [true, "Please add description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter price, Eur"],
    },
    category: {
      type: String,
      required: [true, "Please add category"],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ad", adSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please add username"],
    },
    userEmail: {
      type: String,
      require: [true, "Please add email"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Please add pasword"],
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
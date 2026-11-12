const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please fill a valid email address",
    ],
  },

  phone_no: {
    type: String,
    required: true,
    trim: true,
    match: [
      /^\+91[6-9]\d{9}$/,
      "Please fill a valid Indian mobile number",
    ],
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  isBlocked: {
    type: Boolean,
    default: false
}
});

module.exports = mongoose.model("User", userSchema, "users");
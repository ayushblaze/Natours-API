const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Umm, user without a name? Doesn't seem right :)"],
  }, 
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // makes the password not show up in any output 
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE & SAVE.
      validator: function(el) {
        return el === this.password;
      }
    },
    message: "Password don't match",
    select: false, // makes the password not show up in any output 
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is invalid");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profileImg: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHMBY8KV3NAYcO1Qe3IVWkI9grt9QKeZ3vHA&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("url is not valid");
        }
      },
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    skills: [String],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

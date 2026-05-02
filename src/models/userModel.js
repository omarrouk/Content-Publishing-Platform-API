const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Provide a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: [
      validator.isStrongPassword,
      "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols",
    ],
    select: false,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  loggedOutAt: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiredAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
  } catch (error) {
    throw error;
  }
});

userSchema.pre(/^find/, function () {
  try {
    if (!this.getOptions().withDeleted) {
      this.where({ deletedAt: { $eq: null } });
    }
  } catch (error) {
    throw error;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

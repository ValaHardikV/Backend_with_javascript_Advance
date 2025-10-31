import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Create a new Mongoose schema for the "User" collection
const userSchema = new Schema(
  {
    // Username of the user
    username: {
      type: String,
      required: true,     // must be provided
      unique: true,       // cannot have two users with same username
      lowercase: true,    // converts automatically to lowercase
      trim: true,         // removes extra spaces
      index: true         // makes searching faster
    },

    // Email of the user
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,     // (typo here: should be "lowercase") converts to lowercase
      trim: true,
    },

    // User’s full name
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    // Profile picture (stored as Cloudinary URL)
    avatar: {
      type: String,
      required: true,
    },

    // Optional cover image
    coverImage: {
      type: String,
    },

    // List of videos the user has watched
    watchHistory: [
      {
        type: Schema.Types.ObjectId, // refers to the "Video" collection
        ref: "Video"
      }
    ],

    // User password (hashed before saving)
    password: {
      type: String,
      required: [true, 'Password is required']
    },

    // Refresh token for re-authentication
    refreshToken: {
      type: String
    }

  },
  {
    timestamps: true // automatically adds createdAt and updatedAt fields
  }
);

// Before saving user → hash the password if it was changed or created
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password not changed

  this.password = await bcrypt.hash(this.password, 10); // hash password with salt rounds = 10
  next(); // continue saving
});

// Method to check if entered password matches hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token (short-term token)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key for access token
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY // expiry time from .env
    }
  );
};

// Method to generate refresh token (long-term token)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET, // secret key for refresh token
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

// Create and export User model using the schema
export const User = mongoose.model("User", userSchema);

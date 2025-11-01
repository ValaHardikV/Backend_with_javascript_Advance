// -----------------------------------------------------------------------------
// 📦 IMPORT REQUIRED MODULES AND UTILITIES
// -----------------------------------------------------------------------------

// asyncHandler: A helper function that wraps async routes and catches any errors,
// automatically passing them to Express error handlers — so we don’t need try-catch in every route.
import { asyncHandler } from "../utils/asyncHandler.js";

// ApiError: A custom error class that helps us throw consistent and readable API errors.
import { ApiError } from "../utils/ApiError.js";

// User: Our Mongoose model for interacting with the "users" collection in MongoDB.
import { User } from "../models/usr.models.js";

// uploadOnCloudinary: A helper that uploads images to Cloudinary and returns the file URL.
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ApiResponse: A class that formats all successful API responses in a consistent way.
import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken"


// -----------------------------------------------------------------------------
// 🔑 GENERATE ACCESS AND REFRESH TOKENS
// -----------------------------------------------------------------------------

// This helper function creates a new pair of access and refresh tokens for a user.
// These tokens are used for authentication and session management.
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    // Find the user by their unique ID
    const user = await User.findById(userId);

    // Call model methods to create tokens
    const accessToken = user.generateAccessToken();   // Short-lived token (used to access protected routes)
    const refreshToken = user.generateRefreshToken(); // Long-lived token (used to get a new access token)

    // Save the refresh token to the user’s record in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // Skip validation while saving tokens

    // Return both tokens for further use (like sending them in cookies)
    return { accessToken, refreshToken };

  } catch {
    // If anything fails during token creation
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
  }
};



// -----------------------------------------------------------------------------
// 👤 REGISTER USER CONTROLLER
// -----------------------------------------------------------------------------

// This function handles user registration.
// It checks input validity, uploads images, stores user data in the database,
// and returns a success message with user details.
const registerUser = asyncHandler(async (req, res) => {

  // ✅ Step 1: Extract user details sent by frontend (e.g., from signup form)
  const { fullName, email, username, password } = req.body;

  // req.body holds all the form or JSON data sent in the POST request.

  // ✅ Step 2: Ensure all required fields are provided by the user
  const values = [fullName, email, username, password];
  const keys = ["fullName", "email", "username", "password"];

  for (let i = 0; i < values.length; i++) {
    if (!values[i] || values[i].trim() === "") {
      // Throw a clear error message if any required field is missing
      throw new ApiError(400, `${keys[i]} is required`);
    }
  }

  // ✅ Step 3: Check if the email already exists in the database
  let existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // ✅ Step 4: Check if the username is already taken by another user
  existedUser = await User.findOne({ username });
  if (existedUser) {
    throw new ApiError(409, "User with this username already exists");
  }

  // ✅ Step 5: Get paths of uploaded images (stored temporarily before uploading to Cloudinary)
  let avatarLocalPath = "";
  let coverImageLocalPath = "";

  // Extract avatar path if available
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  // Extract cover image path if available
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // Avatar image is required for registration (used as profile picture)
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ✅ Step 6: Upload avatar and cover image to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // If avatar upload fails, stop the registration
  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // ✅ Step 7: Create a new user record in MongoDB
  const user = await User.create({
    fullName,                        // User's full name
    avatar: avatar.url,              // Avatar image URL (from Cloudinary)
    coverImage: coverImage?.url || "", // Optional cover image
    email,                           // User's email address
    password,                        // Plain password (will be hashed automatically by model)
    username: username.toLowerCase() // Convert to lowercase to avoid case-sensitive duplicates
  });

  // ✅ Step 8: Fetch the newly created user (excluding password & refresh token for safety)
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  // If somehow user creation failed
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // ✅ Step 9: Send a success response with user data
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});



// -----------------------------------------------------------------------------
// 🔐 LOGIN USER CONTROLLER
// -----------------------------------------------------------------------------

// This function handles user login.
// It validates credentials, checks password, generates tokens,
// sets them in secure cookies, and returns user info.
const loginUser = asyncHandler(async (req, res) => {

  // ✅ Step 1: Extract login credentials from request
  const { email, username, password } = req.body;
  console.log(email);

  // At least one of email or username must be provided
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  // ✅ Step 2: Find the user in MongoDB (by either email or username)
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  // If user not found
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // ✅ Step 3: Compare entered password with stored (hashed) password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid username or password");
  }

  // ✅ Step 4: Generate fresh access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  // ✅ Step 5: Fetch user details without exposing password or tokens
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // ✅ Step 6: Define cookie settings
  const options = {
    httpOnly: true, // Cannot be accessed by frontend JS (prevents XSS)
    secure: true,   // Only sent over HTTPS (ensures security)
  };

  // ✅ Step 7: Send tokens as cookies and return user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});



// -----------------------------------------------------------------------------
// 🚪 LOGOUT USER CONTROLLER
// -----------------------------------------------------------------------------

// This function logs a user out by clearing refresh token from database
// and removing both access & refresh tokens from cookies.
const logoutUser = asyncHandler(async (req, res) => {

  // ✅ Step 1: Remove refresh token from the database (invalidate session)
  await User.findByIdAndUpdate(
    req.user._id,  // Current logged-in user's ID (added by authentication middleware)
    {
      $set: { refreshToken: undefined },
    },
    { new: true }  // Return updated user document
  );

  // ✅ Step 2: Set cookie options for clearing tokens
  const options = {
    httpOnly: true,
    secure: true,
  };

  // ✅ Step 3: Clear both access and refresh tokens from cookies
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const user = await User.findById(decodedToken?._id);
  
    if(!user){
      throw new ApiError(401 , "Invalid refresh token")
    }
  
    if(incomingRefreshToken !== user.refreshToken){
      throw new ApiError(401, "Refresh token is expired oe used")
    }
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id);
  
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
})

// -----------------------------------------------------------------------------
// 🚀 EXPORT CONTROLLERS
// -----------------------------------------------------------------------------

// Export all controller functions so they can be used in route files
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};

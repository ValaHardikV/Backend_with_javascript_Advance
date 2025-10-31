// Importing required modules and helper functions
import { asyncHandler } from "../utils/asyncHandler.js"; // To handle errors in async functions easily
import { ApiError } from "../utils/ApiError.js";         // Custom error class for throwing API errors
import { User } from "../models/usr.models.js";          // User model (represents users in MongoDB)
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Function to upload files on Cloudinary
import { ApiResponse } from "../utils/ApiResponse.js";   // Custom response class for sending formatted responses


// ---------------- REGISTER USER CONTROLLER ----------------
// This function handles new user registration requests.
// It receives data (name, email, username, password, images), validates it,
// uploads files to Cloudinary, stores user info in the database,
// and finally returns a success response.

const registerUser = asyncHandler(async (req, res) => {

  // ✅ Step 1: Extract required data from the request body
  const { fullName, email, username, password } = req.body;

  // (req.body) holds the form data or JSON data sent by the frontend

  // ✅ Step 2: Check that all required fields are filled
  // We'll store both the field values and their names for easy checking
  const values = [fullName, email, username, password];
  const keys = ["fullName", "email", "username", "password"];

  // Loop through all values and check if any is missing or empty
  for (let i = 0; i < values.length; i++) {
    if (!values[i] || values[i].trim() === "") {
      // If a field is empty, throw a custom error with its name
      throw new ApiError(400, `${keys[i]} is required`);
    }
  }

  // ✅ Step 3: Check if a user with the same email already exists
  let existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  // ✅ Step 4: Check if a user with the same username already exists
  existedUser = await User.findOne({ username });
  if (existedUser) {
    throw new ApiError(409, "User with username already exists");
  }

  // ✅ Step 5: Get the local paths of uploaded files (avatar and cover image)
  // Files are stored temporarily in the 'public/temp' folder before uploading to Cloudinary
  let avatarLocalPath = "";
  let coverImageLocalPath = "";

  // Check if avatar file was uploaded and extract its path
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  // Check if cover image file was uploaded and extract its path
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // If no avatar file is found, throw an error (avatar is mandatory)
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ✅ Step 6: Upload both images to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // If avatar upload fails, throw an error
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ✅ Step 7: Create a new user in the database
  const user = await User.create({
    fullName,                        // User’s full name
    avatar: avatar.url,              // Cloudinary URL of avatar image
    coverImage: coverImage?.url || "", // Optional cover image URL
    email,                           // User’s email
    password,                        // User’s password (will be hashed in model)
    username: username.toLowerCase() // Convert username to lowercase for consistency
  });

  // ✅ Step 8: Fetch the newly created user but exclude sensitive fields
  const createUser = await User.findById(user._id).select("-password -refreshToken");

  // If something goes wrong and user is not created properly
  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // ✅ Step 9: Send a success response to the frontend
  // Use ApiResponse class for consistent response formatting
  return res.status(201).json(
    new ApiResponse(200, createUser, "User registered successfully")
  );
});


// Export the controller so it can be used in route files
export {
  registerUser,
}

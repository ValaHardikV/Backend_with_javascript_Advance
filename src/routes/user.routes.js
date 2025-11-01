// -------------------------------------------------------------
// Importing Required Modules
// -------------------------------------------------------------

import { Router } from "express"; 
// Express Router helps create isolated route modules.
// This keeps your main app.js file clean and organized.

import { registerUser, loginUser, logoutUser , refreshAccessToken } from "../controllers/user.controller.js";
// Import controller functions responsible for handling user-related requests
// Each function will perform business logic such as registering, logging in, or logging out users.

import { upload } from "../middlewares/multer.middleware.js";
// Multer middleware is used to handle multipart/form-data (file uploads)
// This allows users to upload profile pictures or cover images.

import { verifyJWT } from "../middlewares/auth.middleware.js";
// This middleware verifies the user's JWT token to ensure only authenticated
// users can access protected routes (like logout).



// -------------------------------------------------------------
// Create a New Router Instance
// -------------------------------------------------------------
// The Express Router object lets us define routes modularly (instead of app.js)
// Each router can handle a specific section of the app (e.g., user routes, product routes, etc.)
const router = Router();



// -------------------------------------------------------------
// USER REGISTRATION ROUTE  -->  POST /register
// -------------------------------------------------------------
// This route allows new users to register.
// It accepts form-data containing user details and optional file uploads (avatar, cover image).
// The request first passes through the multer middleware to handle file uploads,
// and then the 'registerUser' controller handles the actual registration logic.

router.route("/register").post(

  // ---------------------------------------------------------
  // Multer Upload Configuration
  // ---------------------------------------------------------
  // 'upload.fields()' allows handling multiple file inputs with different field names.
  // Each field can specify how many files are allowed.
  upload.fields([
    {
      name: "avatar",   // Field name for profile picture
      maxCount: 1       // Only one avatar file allowed
    },
    {
      name: "coverImage", // Field name for cover image
      maxCount: 1         // Only one cover image file allowed
    }
  ]),

  // ---------------------------------------------------------
  // Controller: registerUser
  // ---------------------------------------------------------
  // Once file uploads are processed successfully by multer,
  // the control moves to the registerUser() function.
  // That function validates user data, stores file paths,
  // encrypts passwords, and saves the user record in the database.
  registerUser
);



// -------------------------------------------------------------
// USER LOGIN ROUTE  -->  POST /login
// -------------------------------------------------------------
// This route allows existing users to log in using valid credentials (email & password).
// The 'loginUser' controller checks credentials, generates access and refresh tokens,
// and sends them to the client (usually stored in cookies).
router.route("/login").post(loginUser);



// -------------------------------------------------------------
// USER LOGOUT ROUTE  -->  POST /logout
// -------------------------------------------------------------
// This is a protected route (requires authentication).
// Only users with a valid JWT access token can log out.
// The 'verifyJWT' middleware verifies the token before allowing access to 'logoutUser'.
router.route("/logout").post(

  // Middleware to verify JWT (ensures user is authenticated)
  verifyJWT,

  // Controller: logoutUser
  // Handles token invalidation (removes refresh token, clears cookies, etc.)
  logoutUser
);


router.route("/refresh-token").post(refreshAccessToken)

// -------------------------------------------------------------
// Export the Router
// -------------------------------------------------------------
// Export this router so it can be imported and used in the main app file (e.g., app.js).
// In app.js, you might use it like:
// app.use("/api/v1/users", userRouter);
// This makes all defined routes available under the /api/v1/users path.
export default router;

// Import required modules
import { Router } from "express"; // Express Router is used to create mini route-handlers
import { registerUser ,loginUser, logoutUser } from "../controllers/user.controller.js"; // Import the controller function
import { upload } from "../middlewares/multer.middleware.js"; // Import multer middleware for file uploads
import { verifyJWT } from "../middlewares/auth.middleware.js";



// -------------------- CREATE ROUTER --------------------
// Create a new router object using Express
// Router helps organize routes into separate files (cleaner code)
const router = Router();



// -------------------- USER REGISTRATION ROUTE --------------------
// Define a POST route for user registration
// When someone sends a POST request to "/register",
// first the 'upload' middleware will handle file uploads (avatar & coverImage),
// then the 'registerUser' controller will handle registration logic.

router.route("/register").post(

  // 'upload.fields()' is used to upload multiple files with different field names
  upload.fields([
    {
      name: "avatar",    // Field name for user's profile picture
      maxCount: 1        // Only 1 avatar file allowed
    },
    {
      name: "coverImage", // Field name for user's cover image
      maxCount: 1         // Only 1 cover image allowed
    }
  ]),

  // After files are uploaded successfully,
  // the 'registerUser' function will run to save user info in the database
  registerUser
);


router.route("/login").post(loginUser)

//secure route
router.route("/logout").post(verifyJWT, logoutUser)

// -------------------- EXPORT ROUTER --------------------
// Export this router so it can be imported into the main app file (app.js)
// The main app will use this router at a specific path (like /api/v1/users)
export default router;

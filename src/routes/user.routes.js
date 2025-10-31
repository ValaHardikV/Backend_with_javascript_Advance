import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

// Create a new router object from Express
const router = Router();

// Define the route for user registration
// When someone sends a POST request to "/register",
// the registerUser controller function will be called
router.route("/register").post(registerUser);

// Export the router so it can be used in the main app
export default router;
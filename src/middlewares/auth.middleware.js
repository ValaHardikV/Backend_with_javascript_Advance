// Import the asyncHandler utility to handle asynchronous route errors gracefully
import { asyncHandler } from "../utils/asyncHandler.js";

// Import custom ApiError class for consistent error responses
import { ApiError } from "../utils/ApiError.js";

// Import the 'jsonwebtoken' library to verify and decode JWT tokens
import jwt from "jsonwebtoken";

// Import the User model to find and verify the authenticated user in the database
import { User } from "../models/usr.models.js";

// -------------------------------------------------------------
// Middleware: verifyJWT
// -------------------------------------------------------------
// This middleware function checks whether the incoming request
// has a valid JSON Web Token (JWT). If valid, it attaches the
// corresponding user information to `req.user` and allows the
// request to proceed. Otherwise, it throws an authentication error.
// -------------------------------------------------------------

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // ---------------------------------------------------------
        // Step 1: Extract the JWT token from the incoming request
        // ---------------------------------------------------------
        // Tokens can be sent either:
        // - In cookies (req.cookies.accessToken), or
        // - In the Authorization header as "Bearer <token>"
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        // If no token is found, immediately reject the request
        if (!token) {
            throw new ApiError(401, "Unauthorized request - Token missing");
        }

        // ---------------------------------------------------------
        // Step 2: Verify the JWT token
        // ---------------------------------------------------------
        // The jwt.verify() function checks the token’s integrity and
        // ensures it was signed using the server’s secret key.
        // If invalid or expired, it will throw an error.
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // ---------------------------------------------------------
        // Step 3: Find the user in the database using decoded token info
        // ---------------------------------------------------------
        // The token should contain a user ID (_id).
        // We query the User model to ensure the user exists and is valid.
        // The `.select()` method excludes sensitive fields like password
        // and refreshToken from being attached to the request object.
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        // If no user is found with the given ID, reject the request
        if (!user) {
            throw new ApiError(401, "Invalid Access Token - User not found");
        }

        // ---------------------------------------------------------
        // Step 4: Attach the authenticated user to the request object
        // ---------------------------------------------------------
        // This allows the next route handler or middleware to access
        // the user’s data through `req.user`.
        req.user = user;

        // ---------------------------------------------------------
        // Step 5: Continue to the next middleware or route handler
        // ---------------------------------------------------------
        next();
    } catch (error) {
        // ---------------------------------------------------------
        // Step 6: Handle token errors or verification issues
        // ---------------------------------------------------------
        // Any error during token verification or user lookup will be
        // caught here and converted into a standardized ApiError.
        throw new ApiError(401, error.message || "Invalid access token");
    }
});

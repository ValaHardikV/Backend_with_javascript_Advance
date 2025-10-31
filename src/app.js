// Importing required libraries
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create an Express app instance
const app = express();


// -------------------- MIDDLEWARES --------------------
// Middleware are small functions that run before your route handlers.
// They can modify the request, add extra data, or check for permissions.
// Example: Check if a user is logged in before showing profile page.


// Enable CORS (Cross-Origin Resource Sharing)
// CORS allows your backend (Node.js server) to accept requests
// coming from another domain — like your React frontend.
app.use(cors({
  origin: process.env.CORS_ORIGIN, // only allow requests from this frontend URL
  credentials: true // (fixed typo: should be "credentials") → allows cookies & auth headers
}));


// Parse incoming JSON data in request body
// Example: If frontend sends JSON data, this middleware reads and converts it
// into a JS object so we can use it in req.body
app.use(express.json({ limit: "16kb" }));


// Parse URL-encoded data (like data sent from HTML forms)
// 'extended: true' means it can parse complex nested objects
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// Serve static files from the "public" folder
// Example: If you have files like images or videos in /public,
// you can access them directly in browser like: http://localhost:8000/filename.jpg
app.use(express.static("public"));


// This middleware allows the server to read cookies from incoming requests
// Example: When a user logs in, cookies store session info or JWT token.
app.use(cookieParser());




// -------------------- ROUTES --------------------

// Import user-related routes
import UserRouter from './routes/user.routes.js';

// Declare and use routes
// "/api/v1/users" → base URL for all user routes
app.use("/api/v1/users", UserRouter);

// Example:
// If user.routes.js has a route "/register",
// Full URL becomes: http://localhost:8000/api/v1/users/register



// -------------------- EXPORT APP --------------------
// Export the Express app instance so it can be imported
// and started in the main server file (like server.js or index.js)
export { app };

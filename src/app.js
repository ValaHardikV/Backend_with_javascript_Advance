import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Use middlewares to configure how the app handles incoming requests
// Middleware = functions that run before the request reaches routes
// Example: Check if user is logged in before accessing certain pages



// Enable CORS (Cross-Origin Resource Sharing)
// This allows your backend to accept requests from the frontend (like React)
app.use(cors({
  origin: process.env.CORS_ORIGIN, // only allow requests from this frontend URL
  credentials: true // (typo fixed: should be "credentials") allow cookies & auth headers
}));

// Parse incoming JSON data with a size limit of 16KB
app.use(express.json({ limit: "16kb" }));

// Parse URL-encoded data (like form submissions)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files (like images, videos, etc.) from the "public" folder
app.use(express.static("public"));

// Allow server to read and handle cookies from client requests
app.use(cookieParser());





//routes
import UserRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users", UserRouter)


//URL created like this after above statement
//http://localhost:8000/api/v1/users/register



// Export the Express app so it can be used in server.js or index.js
export { app };

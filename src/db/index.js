// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Import the database name from a constants file
// (DB_NAME is usually defined as a string in constants.js, like: export const DB_NAME = "myDatabaseName";)
import { DB_NAME } from "../constants.js";



// ---------------- FUNCTION: Connect to MongoDB ----------------

// This function connects your backend (Express app) to the MongoDB database.
const connectDB = async () => {
  try {
    // 🧠 Step 1: Connect to MongoDB using mongoose
    // mongoose.connect() returns a promise — so we use "await" to wait for it to finish.

    // process.env.MONGODB_URI → MongoDB connection string (like "mongodb://localhost:27017")
    // DB_NAME → name of the specific database to use
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // 🧩 Step 2: If connection is successful, log the host (server) name in the console.
    // connectionInstance.connection.host → gives the database host (like "localhost" or cluster name)
    console.log(`\n✅ MongoDB connected successfully!`);
    console.log(`🖥️  DB HOST : ${connectionInstance.connection.host}`);
  } 
  catch (error) {
    // ❌ Step 3: If something goes wrong while connecting
    console.log("🚨 MongoDB connection FAILED ❌");
    console.log("Error details:", error);

    // Stop the app completely because database is required for backend to work.
    process.exit(1); // 1 means exit due to failure
  }
};



// ---------------- EXPORT FUNCTION ----------------

// Export the connectDB function so it can be imported and used in another file,
// like server.js or index.js (where the main app starts)
export default connectDB;

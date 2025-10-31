import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Function to connect MongoDB with our backend
const connectDB = async () => {
  try {
    // Connect to MongoDB using mongoose
    // process.env.MONGODB_URI → main database URL from .env file
    // DB_NAME → name of the database (imported from constants.js)
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // If connection is successful, print host name in console
    console.log(`\nMongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
  } 
  catch (error) {
    // If connection fails, show error and stop the app
    console.log("MONGODB connection FAILED ", error);
    process.exit(1); // exit the process with failure
  }
};

// Export the function so it can be used in server.js or index.js
export default connectDB;
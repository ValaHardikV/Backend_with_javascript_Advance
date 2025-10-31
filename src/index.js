// when connect the database remember two thing
//always use try catch to handle exception
//and database take time so use asyn methods


//method 1 to connect database

/*

import dotenv from "dotenv"

dotenv.config({
    path: './env'
})

import mongoose from "mongoose";
import { DB_NAME } from "./constants";

import express from "express"
const app = express()

(async () => {

    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("Database not connect\n");
            console.log("Error : ",error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listing on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.error("Error : ", error);
        throw error;
    }

})()

*/


// ---------------- DATABASE CONNECTION NOTES ----------------
// When connecting to a database, always remember two important things:
// 1️⃣ Always use try-catch to handle connection errors properly.
// 2️⃣ Database connections take time, so use async/await to wait for the connection.


// ---------------- Method 2: Connect Database Using Separate DB File ----------------
// (This is a cleaner and more professional way to connect your database.)


// Import required packages and files
import dotenv from "dotenv";          // For loading environment variables from .env file
import connectDB from "./db/index.js"; // Custom function that connects MongoDB (written in db/index.js)
import { app } from "./app.js";        // Import the main Express app from app.js



// ---------------- Load environment variables ----------------
// dotenv loads all variables from .env into process.env
dotenv.config({
  path: './.env' // Make sure the path is correct (your .env file should be in project root)
});



// ---------------- Connect to MongoDB ----------------
// connectDB() is an async function that connects to MongoDB using mongoose
// It returns a promise, so we use .then() and .catch() to handle success or failure.
connectDB()
  .then(() => {
    // ✅ If connection is successful:
    // Start the Express server and make it listen on the given PORT.
    // process.env.PORT → value from .env file
    // If not found, it uses default port 8000.
    app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // ❌ If MongoDB connection fails:
    // Print an error message to the console.
    console.log("❌ MongoDB connection failed !!!", err);
  });

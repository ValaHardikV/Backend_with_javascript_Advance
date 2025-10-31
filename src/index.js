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


// ---------------- Method 2: Connect Database Using Separate DB File ----------------

// Import required packages and files
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables from the .env file
dotenv.config({
  path: './env' // path to your .env file
});

// Connect to MongoDB
connectDB()
  .then(() => {
    // Once database connection is successful,
    // start the Express server and listen on the given port
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // If database connection fails, show error in console
    console.log("MongoDB connection failed !!!", err);
  });

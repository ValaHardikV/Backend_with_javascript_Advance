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


//method-2 to connect database
//write function in db folder and import here

import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//app.use() to used configration for different data comes
app.use(cors({
    origin: process.env.CORS_ORIGIN, //where we accept request from fronted
    Credential: true
}))

app.use(express.json({limit: "16kb"})) //set limit how much maximum toal json files comes at most at single time

//data comes from url
app.use(express.urlencoded({extended: true, limit: "16kb"}))

//anyone access file that store 
app.use(express.static("public"))

//server read cookies
app.use(cookieParser())

//middle where means --> before request reach our server, we check something in request it's called miidle-where
//means ex. check user logged in or not , 


export {app}
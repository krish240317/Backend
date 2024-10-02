import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//If there is export default then you can change name  , There can only be one export default 

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))//it means accepting json formate data
app.use(express.urlencoded({extended:true,limit:"16kb"}))//to accept url which automatically include space or ? etc
//extended means we can pass object inside object

app.use(express.static("public"));
app.use(cookieParser());  //to access and set user browser cookies

//routes 
import userRouter from './routes/user.routes.js'
//Declare Routes 
app.use("/api/v1/users",userRouter);


export {app}


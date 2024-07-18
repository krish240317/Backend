import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
export {app}


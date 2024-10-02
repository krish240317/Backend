import { Route, Router } from "express";
import {registerUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// The Router() function in Express.js creates a new instance of a router object.
const router =Router()

//we want user to upload files while register like avtar and 
router.route("/register").post(
    //middleware before route 
    upload.fields([
        {
            name:"avatar", //this should be same in front end and backend  
            maxCount:1    //accept 1 file
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),                                                  //to upload multiple files
    registerUser)

export default router;
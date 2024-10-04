import { Route, Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// The Router() function in Express.js creates a new instance of a router object.
const router = Router();

//we want user to upload files while register like avtar and
router.route("/register").post(
  //middleware before route
  upload.fields([
    {
      name: "avatar", //this should be same in front end and backend
      maxCount: 1, //accept 1 file
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]), //to upload multiple files
  registerUser,
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;

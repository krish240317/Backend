import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  const { fullName, email, username, password } = req.body; //step1
  console.log("email", email);

  //this is basic way
  /*  if(fullName==="")
        {
            throw new ApiError(400,"Error in fullName ");
            
        } */ //step2
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are require ");
  }

  //Check user exsist or not   find by both email or username                          step 3
  const exsistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exsistedUser) {
    throw new ApiError(409, "User With email or username already exsist ");
  }
  //                                                    Step 4

  const avtarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is require ");
  }

  const avatar = await uploadOnCloudinary(avtarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // step 5
  if (!avatar) {
    throw new ApiError(400, "Avtar file is require2 ");
  }

  //    step 5
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //Step 5&6
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // step  7
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});
//not using asynchandler here as this is our internal method not web request so ok not to use here

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await user.findById(userID);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = usre.generateRefreshToken();

    //we save refresh token  in DB
    user.refreshtoken = refreshtoken;
    //to save rftoken in Db and on calling save all other require filds has to be valid for that not entering other and onlu rf we use validitate
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch {
    throw new ApiError(
      500,
      "Something went wrong while generating acccess and refresh tolken ",
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  // step1
  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "username Or email required ");
  }
  //step 3
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User Does not Exsist ");
  }

  //step4
  const ispasswordvalid = user.isPasswordCorrect(password);
  if (!ispasswordvalid) {
    throw new ApiError(401, "Invalid password ");
  }

  //step 5 generate access token we can do here but we will built another function
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  //We do this to get user after giving access and refresh token WHY?????//
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  //  step 6 sending cookies
  //for secure connection only backend can change or modify cookies 

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
            //this is for just good practice if user want act or ret
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

});

const logoutUser = asyncHandler(async(req, res) => {
  //here problem arise is how i will know user who is login ???
  //we can take input to know email here 
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

export { registerUser,loginUser,logoutUser };

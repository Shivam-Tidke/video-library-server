import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }



    } catch (error) {
        throw new ApiError(500, "Something went wrong generating access and refresh tokens")
    }
}
const registerUser = asyncHandler(async (req, res) => {

    //get user details from frotend
    //Validation-not empty
    //check if user already exist: UserName, Email
    //create user object- create entry in db
    //check for user creration
    //return res 

    const { username, fullName, password, email, mobile } = req.body;



    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with Email or userName already exists")
    }

    const user = await User.create({
        username: sanitizedUsername,
        email: sanitizedEmail,
        fullName,
        password,
        mobile
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    //    we can retun like this
    //    return res.status(201).json({createdUser})

    return res.status(201).json(
        new ApiResponse(200, createdUser, "Registered User successfully")
    )
})

const GetallUsers = asyncHandler(async (req, res) => {
    const users = await User.find()

    if (!users || users.length === 0) {
        throw new ApiError(400, "No users found");
    }

    return res.status(200).json(
        new ApiResponse(200, users, "All users fatched successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    //username  or email
    //find the user
    //access and refresh token
    //send cookie

    const { email, username, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required ")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exits")
    }

    const isValidPassword = await user.isPasswordCorrect(password)

    if (isValidPassword) {
        throw new ApiError(400, "Invalide user credentials")
    }

    const { accessToken, refreshToken } = await
        generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken").json(
        new ApiResponse(
            200, {
            user: loggedInUser, accessToken, refreshToken
        },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {

    User.findByIdAndUpdate(
        req.user._id, 
        {
        $set: {
            refreshToken: undefined
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
.json(new ApiResponse(200, {}, "User logged out "))
})

const refreshAccessToken = asyncHandler(async (req, res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
    throw new ApiError(400, "Unautorized request")
   }

  try {
     const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
     )
  
     const user = await User.findById(decodedToken?._id)
      if(!user){
          throw new ApiError(400, "Invalide refresh token")
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError (400,"Refresh token is expired or used")
      }
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse (
              200,
              {accessToken, refreshToken: newRefreshToken},
              "Access token refreshed"
          )
      )
  } catch (error) {
    throw new ApiError (400, error?.message||"invalide refresh token")
    
  }

})

export { registerUser, GetallUsers, loginUser, logoutUser, refreshAccessToken }

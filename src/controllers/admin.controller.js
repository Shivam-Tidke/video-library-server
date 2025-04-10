import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { Admin } from "../models/admin.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }



    } catch (error) {
        throw new ApiError(500, "Something went wrong generating access and refresh tokens for admin")
    }
}
const registerAdmin = asyncHandler(async (req, res) => {

    //get user details from frotend
    //Validation-not empty
    //check if user already exist: UserName, Email
    //create user object- create entry in db
    //check for user creration
    //return res 

    const { username, fullName, password, email } = req.body;



    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existedAdmin = await Admin.findOne({
        $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }]
    });

    if (existedAdmin) {
        throw new ApiError(409, "User with Email or userName already exists")
    }

    const user = await Admin.create({
        username: sanitizedUsername,
        email: sanitizedEmail,
        fullName,
        password
    })

    const createdAdmin = await Admin.findById(user._id).select(
        "-password"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    //    we can retun like this
    //    return res.status(201).json({createdUser})

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Registered User successfully")
    )
})


const loginAdmin = asyncHandler(async (req, res ) => {
    //req body -> data
    //username  or emailres
    //find the user
    //access and refresh token
    //send cookie

    const { email, username, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required ")
    }

    const admin = await Admin.findOne({
        $or: [{ username }, { email }]
    }) 

    if (!admin) {
        throw new ApiError(404, "admin does not exits")
    }

    const isValidPassword = await admin.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(400, "Invalide admin credentials")
    }

    const { accessToken, refreshToken } = await
        generateAccessAndRefreshTokens(admin._id)

    const loggedInUser = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken").json(
        new ApiResponse(
            200, {
            admin: loggedInUser, accessToken, refreshToken
        },
            "Admin logged in successfully"
        )
    )

})

const logoutAdmin = asyncHandler(async (req, res) => {

    Admin.findByIdAndUpdate(
        req.admin._id, 
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
.json(new ApiResponse(200, {}, "Admin logged out "))
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
  
     const admin = await Admin.findById(decodedToken?._id)
      if(!admin){
          throw new ApiError(400, "Invalide refresh token")
      }
  
      if (incomingRefreshToken !== admin?.refreshToken) {
          throw new ApiError (400,"Refresh token is expired or used")
      }
  
      const options = {
          httpOnly: true,
          secure: false
      }
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(admin._id)
  
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

export { registerAdmin, loginAdmin, logoutAdmin, refreshAccessToken }
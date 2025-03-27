import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandler(async (req, res)=>{
  
        //get user details from frotend
        //Validation-not empty
        //check if user already exist: UserName, Email
        //create user object- create entry in db
        //check for user creration
        //return res
        const {fullName, userName, Password, Email, Mobile} = req.body
        console.log("Email", Email)
        
        // if (fullName === "") {
        //     throw new ApiError(400, "fullName is required")
        // }

        if (
            [fullName, Email, userName, Mobile, Password].some((field)=>field?.trim().trim() === "")
        ) {
            throw new ApiError(400,"All field are required");
        }

        const existedUser = User.findOne({
            $or:[{userName},{Email}]
        })

        if (existedUser) {
            throw new ApiError(409, "User with Email or userName already exists")
        }

       const user =  User.create({
           userName,
           Email,
           fullName,
           Email,
           Mobile
        })

       const createdUser = await User.findById(user._id).select(
        "-Password"
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

export {registerUser}
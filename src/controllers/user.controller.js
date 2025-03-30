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

        const {FullName, UserName, Password, Email, Mobile} = req.body;
        
        

        
        // if (fullName === "") {
        //     throw new ApiError(400, "fullName is required")
        // }

        // if (
        //     [FullName, UserName, Password, Email, Mobile].some((field)=>field?.trim() === "")
        // ) {
        //     throw new ApiError(400,"All field are required");
        // }
        if (!FullName || !UserName || !Password || !Email || !Mobile) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or:[{UserName},{Email}]
        })

        if (existedUser) {
            throw new ApiError(409, "User with Email or userName already exists")
        }

       const user = await User.create({
           UserName,
           Email,
           FullName,
           Password,
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

const GetallUsers = asyncHandler(async(req, res) =>{
const users = await User.find()

if(!users || users.length === 0){
    throw new ApiError(400,"No users found");
}

return res.status(200).json(
    new ApiResponse(200, users, "All users fatched successfully")
)

 

})


export {registerUser, GetallUsers }

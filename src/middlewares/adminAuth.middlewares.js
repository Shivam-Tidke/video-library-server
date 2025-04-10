import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";

export const verifyAdminJWT = asyncHandler(async (req, _, next)=>{
    try {
      const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if(!token){
            throw new ApiError(400,"Unautorized User")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
      const admin =  await Admin.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!admin){
            throw new ApiError(400, "Invalid access token")
        }
    
        req.admin = admin;
        next()
    } catch (error) {

        throw new ApiError(400, error?.message||"Invalid access token")
        
    }
})
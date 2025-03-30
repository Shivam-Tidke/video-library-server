import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerCategory = asyncHandler(async (req, res)=>{
    const {name} = req.body;

    if(!name?.trim()){
        throw new ApiError(400, "Category is required")
    }

    const categoryName = name.trim().toLowerCase();

    const existedCategory = await Category.findOne({categoryName})

    if(existedCategory){
        throw new ApiError(400, "Category already exists")
    }

    const category = await Category.create({name: categoryName})

    

    return res.status(201).json(
         new ApiResponse(201, category, "Category Created Successfully")
    )    
})

export {registerCategory}
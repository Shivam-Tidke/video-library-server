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

    const existedCategory = await Category.findOne({name: categoryName})

    if(existedCategory){
        throw new ApiError(400, "Category already exists")
    }

    const category = await Category.create({name: categoryName})

    

    return res.status(201).json(
         new ApiResponse(201, category, "Category Created Successfully")
    )    
})

const getAllCategories = asyncHandler(async (req, res)=>{
    const category = await Category.find()

    if(!category || category.length===0){
        throw new ApiError(400,"No categories found")
    }

    return res.status(200).json(
        new ApiResponse(200, category, "All category fatched successfully")
    )
})
export {registerCategory, getAllCategories}
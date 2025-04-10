import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerVideo = asyncHandler(async(req,res)=>{
    const  {Title, URL, Description, Likes, Dislikes, Views, CategoryId} = req.body;

    if(!Title || !URL || !Description ){
        throw new ApiError(400,"All field are required")
    }

    const existedVideo = await Video.findOne({
        $or:[{URL}, {Title}]
    })

    if(existedVideo){
        throw new ApiError(400,"Already video exist")
    }

    const video = await Video.create({
        Title,
        URL,
        Description,
        Likes,
        Dislikes,
        Views,
        CategoryId
    })

    const createdVideo = await Video.findById(video._id)

    if(!createdVideo){
        throw new ApiError(400, "Something went werong while uploading a video")
    }

    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video Uploaded successfully")
    )
})

const GetAllVideos = asyncHandler (async(req, res)=>{
    const videos = await Video.find()

    if(!videos || videos.length === 0 ){
        throw new ApiError(400,"No videos found")
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "All videos fetch successfully")
    )
})

export {registerVideo, GetAllVideos}
    
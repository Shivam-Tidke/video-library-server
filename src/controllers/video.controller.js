import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerVideo = asyncHandler(async(req, res)=>{
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

const DeleteVideo = asyncHandler (async (req, res)=>{
 const {id} = req.params 

 if(!mongoose.Types.ObjectId.isValid(id)){
    throw new ApiError (400, "Invalide video ID");
 }

 const deletedVideo = await Video.findByIdAndDelete(id)

 if(!deletedVideo){
    throw new ApiError(400, "Video not found or already deleted")
 }

 return res.status(200).json(
    new ApiResponse (200, deletedVideo, "Video deleted successfully")
 )
})

const GetVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(id);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
});

const EditVideo = asyncHandler (async (req, res)=>{
    const {id} = req.params 
   
    if(!mongoose.Types.ObjectId.isValid(id)){
       throw new ApiError (400, "Invalide video ID");
    }
   
    const UpdatedVideo = await Video.findByIdAndUpdate(
        id,
        {
            $set: {
                Title: req.body.Title,
                URL: req.body.URL,
                Description: req.body.Description,
                Likes: req.body.Likes,
                Dislikes: req.body.Dislikes,
                Views: req.body.Views,
                CategoryId: req.body.CategoryId
            }
        },
        {
            new: true,           // return the updated document
            runValidators: true  // ensure model validation runs
        }
    );
   
    if(!UpdatedVideo){
       throw new ApiError(400, "Video not found")
    }
   
    return res.status(200).json(
       new ApiResponse (200, UpdatedVideo, "Video Updated successfully")
    )
   })


export {registerVideo, GetAllVideos, DeleteVideo, GetVideoById, EditVideo}


    
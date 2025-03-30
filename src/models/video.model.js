import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
    {
       
        Title:{
            type: String,
            required: true,
           
        },
        URL:{
            type: String,
            required: true,
            unique:true
            
        },
        Description:{
            type: String,
            required: true,
          
        },
        Likes:{
            type: Number,
            default:0
        },
        Dislikes:{
            type: Number,
            default:0
        },
        Views:{
            type: Number,
            default:0
        },
        CategoryId:{
            type: Schema.Types.ObjectId,
            ref:"Category"
        }
    },
    {
        timestamps: true
    }
)

export const Video = mongoose.model("Video", videoSchema)
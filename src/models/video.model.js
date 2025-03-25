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
            type: mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required: true
 
        }
        

    },
    {
        timestamps: true
    }
)

export const Video = mongoose.model("Videos", videoSchema)
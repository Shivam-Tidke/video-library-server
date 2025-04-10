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
        },
        Comments: [
            {
              UserId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
              },
              Text: {
                type: String,
                required: true,
                trim: true,
              },
              CreatedAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
    },
    {
        timestamps: true
    }
)

export const Video = mongoose.model("Video", videoSchema)
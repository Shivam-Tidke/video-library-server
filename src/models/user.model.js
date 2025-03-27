import mongoose, { Schema } from "mongoose"


const userSchema = new Schema
( 
    {
        UserName:{
            type: String,
            required:true,
            trim: true,
            unique: true,
            lowercase: true,
            index: true
            
        },
        Password:{
            type: String,
            required:[true,"Password is required"]
        },
        Email:{
            type: String,
            required:true,
            trim: true,
            unique: true, 
        },
        Mobile:{
            type: String,
            required:true,
            trim: true,
            unique: true, 
        },
        FullName:{
            type: String,
            required:true,
            trim: true,
            unique: true, 
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema);
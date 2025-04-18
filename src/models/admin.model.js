import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const adminSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true, // This already creates an index
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true
        },

        refreshToken:{
            type:String
        }
    },
    {
        timestamps: true
    }
);
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10); 
    next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
    return  await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Admin = mongoose.model("Admin", adminSchema);

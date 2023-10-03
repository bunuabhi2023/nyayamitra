const mongoose = require("mongoose");

const users = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "please enter you Name"],
            maxLength:255,
        },
        email: {
            type:String,
            required:[true, "please enter you Email"],
            unique: true,
        },
        password: {
            type:String,
            required:[true, "please enter your password"],
            minLength: [8, "Password must be at least 8 Characters"],
        },
        email_otp: {
            type:String,
            required:false,
            maxLength:50,
        },
        mobile: {
            type:String,
            required:[true, "please enter your 10 digit Mobile Number"],
            unique: true,
            maxLength:10,
        },
        mobile_otp: {
            type:String,
            required:false,
            maxLength:50,
        },
        gender: {
            type:String,
            required:false,
            maxLength:50,
        }, 
        latitude: {
            type:String,
            required:false,
            maxLength:255,
        },
        longitude: {
            type:String,
            required:false,
            maxLength:255,
        },
        mobile_verified_at: {
            type:Date,
            required:false,
        },
        email_verified_at: {
            type:Date,
            required:false,
        },
        status: {
            type:String,
            enum:["inactive", "active", "rejected"],
            default:"inactive"
        },
        file:{
            Bucket:{
                type:String,
                required:false,
                maxLength:255,
            },
            Key:{
                type:String,
                required:false,
                maxLength:255,
            },
            Url:{
                type:String,
                required:false,
                maxLength:255,
            }
        },
        role:{
            type:String,
            enum:["Admin", "Vendor"],
            default:"Vendor"
        },
        city:{
            type:String,
            required:false,
            maxLength:255,
        },
        state:{
            type:String,
            required:false,
            maxLength:255,
        },
        pincode:{
            type:String,
            required:false,
            maxLength:50,
        },
        address:{
            type:String,
            required:false,
            maxLength:255,
        },
        deviceId:{
            type:String,
            required:false,
            maxLength:800,
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("User", users);
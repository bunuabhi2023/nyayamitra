const mongoose = require("mongoose");

const cases = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "please enter case Name"],
            maxLength:255,
        },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now(),
        },
        updatedAt:{
            type:Date,
            required:false
        }
    }
);

module.exports = mongoose.model("Case", cases);
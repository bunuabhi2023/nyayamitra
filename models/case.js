const mongoose = require("mongoose");

const cases = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "please enter case Name"],
            maxLength:255,
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Case", cases);
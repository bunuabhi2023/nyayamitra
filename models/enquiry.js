const mongoose = require("mongoose");

const enquiries = new mongoose.Schema(
    {
       
        enqNo: {
            type:String,
            required:false,
            maxLength:255,
        },
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Case',
            required: true,
        },
        clientName: {
            type:String,
            required:[true, "please enter your Name"],
            maxLength:255,
        },
        mobile: {
            type:String,
            required:[true, "please enter your 10 digit Mobile Number"],
            maxLength:10,
        },
        email: {
            type:String,
            required:true,
            maxLength:255,
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
        gender: {
            type:String,
            required:false,
            maxLength:50,
        }, 
        message: {
            type:String,
            required:false,
            maxLength:255,
        },
        status: {
            type:String,
            enum:["new", "open", "pending", "close"],
            default:"new"
        },
        amount:{
            type:Number,
            required:false,
        },
        isPaid:{
            type:Boolean,
            default:false
        },
        razorpayOrderId:{
            type:String,
            required:false,
            maxLength:255,
        },
        razorpayPaymentId:{
            type:String,
            required:false,
            maxLength:255,
        },
        razorpaySignature:{
            type:String,
            required:false,
            maxLength:800,
        },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now(),
        },
        updatedAt:{
            type:Date,
            required:true,
            default:Date.now(),
        }
    }
);

module.exports = mongoose.model("Enquiry", enquiries);
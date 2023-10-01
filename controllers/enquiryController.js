const Enquiry = require('../models/enquiry');
const Case = require('../models/case')
const crypto = require("crypto");
const Razorpay = require("razorpay");
const nodemailer = require('nodemailer');


function hmac_sha256(data, key) {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(data);
    return hmac.digest("hex");
}


  // Function to get a Enquiry  by ID
const getEnquiryById = async (req, res) => {
try {
    const cases = await Enquiry.findById(req.params.id);
    if (!cases) {
    console.log(`Enquiry with ID ${req.params.id} not found`);
    return res.status(404).json({ error: 'Enquiry not found' });
    }


    res.json(cases);
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch case' });
}
}



const enquiryNow = async(req, res) =>{

    try {
        const params = req.body;
        const razorpayKey = "rzp_test_8bMWGYcmn7AFVM";
        const razorpaySecret = "HQWffwEDGNsi6T5sJlEVlrm1";

        const razorpay = new Razorpay({
            key_id: razorpayKey,
            key_secret: razorpaySecret,
        });

        if (!params.caseId || !params.clientName || !params.email || !params.mobile || !params.message) {
            const response = {status: 'Error', message: 'Missing params',};
            return res.status(400).json(response);
          }

          const amount = 1;
          const enqNo = crypto.randomBytes(8).toString("hex");

        const caseDetail = await Case.findById(params.caseId);
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: "webienttechenv@gmail.com",
                pass: "ljxugdpijagtxeda",
            },
        });

        const emailBody = `
            <p>Dear Abhishek Kumar Singh (Director),</p>
            <p>A New Enquiry For ${caseDetail.name}.</p>
            <p><strong>Feedback Details:</strong></p>
            <p>City: ${params.city}</p>
            <p>State: ${params.state}</p>
            <p>Case: ${caseDetail.name}</p>
            <p>Gender: ${params.gender}</p>
            <p>Mobile: ${params.mobile}</p>
            <p>Email: ${params.email}</p>
        `;
        const mailOptions = {
            from: 'webienttechenv@gmail.com',
            to: 'asraijada08@gmail.com',
            subject: 'New Enquiry',
            html: emailBody
        };
        
        const orderData = {
            receipt: enqNo,
            amount: amount * 100, // Example: Amount in paise
            currency: "INR",
        };

        const orderRzp = await razorpay.orders.create(orderData);

        const enquiry = new Enquiry({
            caseId: params.caseId,
            clientName: params.clientName,
            email: params.email,
            mobile: params.mobile,
            message: params.message,
            gender: params.gender,
            city: params.city,
            state: params.state,
            amount: 1,
            razorpayOrderId: orderRzp.id,
            razorpayPaymentId: null,
            razorpaySignature: null
        });

        const savedenquiry = await enquiry.save();
        if(savedenquiry){    
          const emailSent = await transporter.sendMail(mailOptions);
          const emailBodyClient = `
            <p>Dear ${params.clientName},</p>
            <p>Thank You for Enquiry For ${caseDetail.name}! You Case No is ${savedenquiry._id}.</p>
            <p>We Will Get Back To You Within 30 Minutes</p>
            <p>Thank You,</p>
            <p>Nyaya Mitra</p>
            <p>asraijada08@gmail.com</p>
        `;
        const mailOptionsClient = {
            from: 'webienttechenv@gmail.com',
            to: params.email,
            subject: 'New Enquiry',
            html: emailBodyClient
        };
        const emailSentClient = await transporter.sendMail(mailOptionsClient);
        }
        res.status(200).json(savedenquiry);
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }

};

const successPayment = async(req, res) =>{
    try{
        const secret = 'HQWffwEDGNsi6T5sJlEVlrm1';

        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const expectedSignature = hmac_sha256(
            `${razorpayOrderId}|${razorpayPaymentId}`,
            secret
        );

        if (expectedSignature === razorpaySignature) {

            const updateEnquiry = await Enquiry.findOneAndUpdate(
                {razorpayOrderId: razorpayOrderId},
              { razorpayPaymentId, razorpaySignature, isPaid: true },
              { new: true }
            );
            const responseData = {
                status: "Success",
                message: "Thank You For Your Enquiry! Our Executive will get back to you within 30 minutes.",
            };

            res.status(201).json(responseData);
        } else {
            // Invalid signature
            const responseData = {
                status: "Error",
                message: "Payment failed",
            };

            res.status(201).json(responseData);
        }
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }

};

module.exports = {
    enquiryNow,
    successPayment
  };

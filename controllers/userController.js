const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { options } = require("../routes/route");
require("dotenv").config();
const multer = require('multer');
const ErrorHandler = require("../utils/ErrorHandler");
const admin = require('firebase-admin'); 
const serviceAccount = require('../serviceAccount.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


exports.signUp = async (req, res, next) => {
    try {
      const { name, email, mobile, password } = req.body;

      if (!name || !email || !mobile || !password)
      return next(new ErrorHandler("Please Enter All Fields", 400));
      // Check if the email or mobile already exists in the database
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      });
  
      if (existingUser) {
        return next(new ErrorHandler("user already exist", 409));
      }
  
      // Hash the password before saving it to the database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create the new customer object with the hashed password
      const newUser = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
        email_otp: null,
        mobile_otp: null,
        gender: null,
        latitude: null,
        longitude: null,
        mobile_verified_at: null,
        email_verified_at: null,
        file: null,
        city: null,  
        pincode: null,
        address: null,
      });
  
      // Save the new customer to the database
      await newUser.save();
  
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during customer signup:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  


  exports.login = async (req,res, next) => {
    try {

        //data fetch
        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password) {
          return next(new ErrorHandler("PLease fill all the details carefully", 400));
           
        }

        //check for registered user
        let user = await User.findOne({email});
        //if not a registered user
        if(!user) {
          return next(new ErrorHandler("User is not registered", 400));
        }
        console.log(user._id)

        const payload = {
            email:user.email,
            _id:user._id,
            role:user.role,
        };
        //verify password & generate a JWT token
        if(await bcrypt.compare(password,user.password) ) {
            //password match
            let token =  jwt.sign(payload, 
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"15d",
                                });
                  

            // Save the updated user record
            await user.save();
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date( Date.now() + 15 * 24 * 60 * 60 * 1000),
                httpOnly:true,
                sameSite: 'none',
                secure: true,
            }

            

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });
        }
        else {
          return next(new ErrorHandler("Password Incorrect", 401));
        }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });

    }
}

exports.getMyProfile = async (req, res, next) => {
  try {
    const authenticatedUser = req.user;

    const userId = authenticatedUser._id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    return res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return next(new ErrorHandler("Something went wrong", 500));
  }
};

exports.getUser = async (req, res, next) => {
  try {

    const users = await User.find({role: 'Vendor'}).select('-password');

    if (!users) {
      return next(new ErrorHandler("User not found", 404));
    }

    return res.json({ users });
  } catch (error) {
    console.error('Error fetching user:', error);
    return next(new ErrorHandler("Something went wrong", 500));
  }
};

exports.getUserById = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    

    return res.json({ user});
  } catch (error) {
    console.error('Error fetching user:', error);
    return next(new ErrorHandler("Something went wrong", 500));
  }
};

exports.updateUser = async(req,res, next) =>{

    const { name, email, mobile, dob, city, state, pincode,address, status} = req.body;
    const updatedBy = req.user.id;

    const file = req.s3FileUrl;

    try {
      const existingUser = await User.findById(req.params.id);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      
      const duplicateUser = await User.findOne({
        $and: [
          { _id: { $ne: existingUser._id } }, 
          { $or: [{ email }, { mobile }] }, 
        ],
      });

      if (duplicateUser) {
        return next(new ErrorHandler("Email or mobile already exists for another user", 400));
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, mobile, dob, file, city, state, pincode,address, status, updatedBy, updatedAt: Date.now() },
        { new: true }
      );

      console.log(updatedUser); // Add this line for debug logging
      res.json({user:updatedUser});
    } catch (error) {
      console.error(error); // Add this line for debug logging
      return res.status(500).json({ error: 'Failed to update User' });
    }
}

exports.updateMyProfile = async(req,res, next) =>{

  const { name, email, mobile, dob, city, state, pincode,address} = req.body;
  
  const authenticatedUser = req.user;

  const userId = authenticatedUser._id;

  const file = req.s3FileUrl;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    
    const duplicateUser = await User.findOne({
      $and: [
        { _id: { $ne: existingUser._id } }, 
        { $or: [{ email }, { mobile }] }, 
      ],
    });

    if (duplicateUser) {
      return next(new ErrorHandler("Email or mobile already exists for another user", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, mobile, dob, file, city, state, pincode,address, updatedAt: Date.now() },
      { new: true }
    );

    console.log(updatedUser); // Add this line for debug logging
    res.json({user:updatedUser});
  } catch (error) {
    console.error(error); 
    return next(new ErrorHandler("Failed to update User", 500));
  }
}
exports.deleteUser = async (req, res, next) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      console.log(`User with ID ${req.params.id} not found`);
      return next(new ErrorHandler("User not found", 404));
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Failed to delete User", 500));
  }
};

exports.updateUserStatus =async(req, res, next) =>{
  try {
    const updateStatus =await User.findOneAndUpdate(
      {_id:req.params.id},
      {status: req.body.status},
      {new:true}
    );
    if (!updateStatus) {
      console.log(`User with ID ${req.body.UserId} not found`);
      return next(new ErrorHandler("User not found", 404));
    }
    res.json({ message: 'User Status Updated successfully' });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Failed to Update Status", 500));
  }
}
  
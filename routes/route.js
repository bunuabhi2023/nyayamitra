const express  = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const caseController = require('../controllers/caseController');
const enquiryController =require('../controllers/enquiryController');


const {auth, isAdmin, isVendor}  = require('../middlewares/Auth');

const {customerAuth} = require('../middlewares/CustomerAuth');
const { imageSingleUpload } = require("../middlewares/multer");
// Home 
router.get("/", (req, res) =>{
    res.send("Welcome to Beauty Club Backend");
});
//Admin Route//
router.post("/register-user", userController.signUp);
router.post("/login-user", userController.login);
router.get("/my-profile", auth, userController.getMyProfile);//auth
router.put("/update-user/:id", imageSingleUpload, auth, isAdmin, userController.updateUser);
router.put("/update-my-profile", imageSingleUpload, auth, userController.updateMyProfile);
router.put("/update-user-status/:id", auth, isAdmin, userController.updateUserStatus);
router.get("/get-all-users", auth, isAdmin, userController.getUser);
router.get("/get-user-by-id/:id", auth, isAdmin, userController.getUserById);
router.delete("/delete-user/:id", auth, isAdmin, userController.deleteUser);

//case Route//
router.post("/create-case", auth, isAdmin, caseController.createCase);
router.put("/update-user/:id",auth, isAdmin, caseController.updateCase);
router.get("/get-all-cases",  caseController.getAllCase);
router.get("/get-case-by-id/:id",  caseController.getCaseById);
router.delete("/delete-case/:id", auth, isAdmin, caseController.deleteCase);

//Enuiry Routes//
router.post("/enquiry-now", enquiryController.enquiryNow);
router.post("/verify-payment", enquiryController.successPayment);



module.exports = router;
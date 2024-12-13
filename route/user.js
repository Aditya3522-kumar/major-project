const express = require("express"); 
const router = express.Router(); 
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");
const usercontroller = require("../controller/usercontroller.js");


//signup route
router.get("/signup" , (req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup" , wrapasync(usercontroller.signup));

//login route
router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl , passport.authenticate("local",{failureRedirect:"/login" , failureFlash:true}), usercontroller.login);

//logout route
router.get("/logout" , usercontroller.logout);

module.exports = router;

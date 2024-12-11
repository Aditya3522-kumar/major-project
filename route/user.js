const express = require("express"); 
const router = express.Router(); 
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");

router.get("/signup" , (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapasync(async(req,res)=>{
   try{
    const{ username ,email , password } = req.body;
    const newUser = new User({email , username});
    const registeredUser = await User.register(newUser , password);
    req.login(registeredUser , (err)=>{
        if(err){
            req.flash("error" , "login failed");
            return next(err);
        }
        req.flash("success" , "user signup completed");
        res.redirect("/listings");
    })
    console.log(registeredUser);
    req.flash("success" , "user signup completed");
    res.redirect("/listings");
   }catch(e){
    req.flash("error" , e.message);
    res.redirect("/signup");
   }

}));

router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl , passport.authenticate("local",{failureRedirect:"/login" , failureFlash:true}), async(req,res)=>{
   req.flash("success","welcome to wanderlust you are logged in");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
});

router.get("/logout" , (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            req.flash("error" , "logout failed");
            return next(err);
        }
        req.flash("success" , "logged out successfully");
        res.redirect("/listings");
    })
});





module.exports = router;

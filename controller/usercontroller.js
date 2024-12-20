const User = require("../models/user.js");

module.exports.signup = async(req,res)=>{
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
    //  console.log(registeredUser);
    //  req.flash("success" , "user signup completed");
    //  res.redirect("/listings");
    }catch(e){
     req.flash("error" , e.message);
     res.redirect("/signup");
    }
 
 };

 module.exports.login =  async(req,res)=>{
    req.flash("success","welcome to wanderlust you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 };

 module.exports.logout =  (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            req.flash("error" , "logout failed");
            return next(err);
        }
        req.flash("success" , "logged out successfully");
        res.redirect("/listings");
    })
};

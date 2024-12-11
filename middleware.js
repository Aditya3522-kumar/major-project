
module.exports = isloggedIn = (req,res,next)=>{
    // console.log(req.path , ",,..,,..," ,req.originalUrl);
    if(req.isAuthenticated()){
        
        next();
     }
     else{
        req.session.redirectUrl = req.originalUrl;
        console.log(req.originalUrl);
        req.flash("error" , "you must be logged");
        res.redirect("/login");
     }
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}



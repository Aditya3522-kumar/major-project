const Listing = require("./models/listing");
const Review = require("./models/reviews");
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
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error" , "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

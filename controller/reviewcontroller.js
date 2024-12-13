// const Review = require("../models/review.js");
const Review = require("../models/reviews.js") 
const Listing = require("../models/listing.js");
// const ExpressError = require("../utils/ExpressError.js");
module.exports.create = async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log(id ,"from post request");
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const listing = await Listing.findById(id);
    console.log(listing , "listing");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};

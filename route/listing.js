const express = require("express");
const router = express.Router({mergeParams: true});
let wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const{ listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


//index route
router.get("/" , async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
});

//create route
router.get("/new" , (req,res)=>{
   res.render("listings/new.ejs");
});
router.post("/new",wrapasync(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400 , "bad request");
    }
    console.log(req.body.listing);
    await new Listing(req.body.listing).save();
    res.redirect("/listings");
})
);
//show route
router.get("/:id" , wrapasync(async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));
//edit route
router.get("/:id/edit" ,wrapasync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    } 
    console.log(listing , "in edit");
    res.render("listings/edit.ejs", {listing});
}));
//update route
router.put("/:id", wrapasync(async(req,res)=>{
    if(!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    let {id} = req.params;
    console.log(req.body.listing , "in update");
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true});
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id/delete" ,wrapasync(async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    
    res.redirect("/listings");
}));

// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if(error) {
//         throw new ExpressError(400, error.details.map(el => el.message).join(','));
//     } else {
//         next();
//     }
// };

module.exports = router;
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
};

// module.exports.new = ;

module.exports.show = async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error" , "listing not found");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", {listing, curruser: req.user});
};
module.exports.create = async(req,res)=>{
    console.log(req.body ,"from new");
    if(!req.body.listing){
        req.flash("error" , "not able to add listing");
        throw new ExpressError(400 , "bad request , no listing data");
    }
    console.log(req.body.listing);
    let listing = new Listing(req.body.listing);
    if (req.file) {
        listing.image = req.file.path; // Save the uploaded file path
    }
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success" , "listing created successfully");
    res.redirect("/listings");
};

module.exports.edit = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    } 
    console.log(listing , "in edit");
    res.render("listings/edit.ejs", {listing});
};


module.exports.update = async(req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    let {id} = req.params;

    // Proceed with the update if the user is the owner
      await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted sucessfully");
     res.redirect("/listings");
};



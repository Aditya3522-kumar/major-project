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
    // console.log(req.body ,"from new");
    if(!req.body.listing){
        req.flash("error" , "not able to add listing");
        throw new ExpressError(400 , "bad request , no listing data");
    }
    // console.log(req.body.listing);
    let listing = new Listing(req.body.listing);
    if (req.file) {
        listing.image.url = req.file.path; // Save the uploaded file path
        listing.image.filename = req.file.filename;
        // listing.image.public_id = req.file.public_id;
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
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/uploads/", "/uploads/h_100,w_550/");
    console.log(listing , "in edit");
    res.render("listings/edit.ejs", {listing , originalimageurl});
};


module.exports.update = async(req, res) => {
    console.log(req.body.listing , "from update");
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    let {id} = req.params;

    // Proceed with the update if the user is the owner
      let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

      if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.image = {url,filename};
      await updatedListing.save();
      }
      
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted sucessfully");
     res.redirect("/listings");
};



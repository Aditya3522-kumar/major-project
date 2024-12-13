const express = require("express");
const router = express.Router({mergeParams: true});
let wrapasync = require("../utils/wrapasync.js");
const isLoggedIn = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingcontroller = require("../controller/listingcontroller.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

//index route
router.get("/" , listingcontroller.index);
//create route
router.get("/new" , isLoggedIn,(req,res)=>{   
    console.log(req.body ,"from new1");
    res.render("listings/new.ejs");
});
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
router.post("/new", isLoggedIn, wrapasync(listingcontroller.create));

//show route
router.get("/:id" , wrapasync(listingcontroller.show));
//update route
router.put("/:id", wrapasync(listingcontroller.update));
//edit route
router.get("/:id/edit" ,isLoggedIn, isOwner, wrapasync(listingcontroller.edit));
//Delete route
router.delete("/:id/delete", isLoggedIn, isOwner,wrapasync(listingcontroller.destroy));

module.exports = router;
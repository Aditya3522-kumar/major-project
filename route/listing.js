const express = require("express");
const router = express.Router({mergeParams: true});
let wrapasync = require("../utils/wrapasync.js");
const isLoggedIn = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingcontroller = require("../controller/listingcontroller.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

//index route
router.get("/" , listingcontroller.index);
//create route
router.get("/new" , isLoggedIn,(req,res)=>{   
    // console.log(req.body ,"from new1");
    res.render("listings/new.ejs");
});

//create route 2
router.post("/new", isLoggedIn, upload.single("listing[image.url]"),
 wrapasync(listingcontroller.create));

//show route
router.get("/:id" , wrapasync(listingcontroller.show));
//update route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image.url]"), wrapasync(listingcontroller.update));
//edit route
router.get("/:id/edit" ,isLoggedIn, isOwner, wrapasync(listingcontroller.edit));
//Delete route
router.delete("/:id/delete", isLoggedIn, isOwner,wrapasync(listingcontroller.destroy));

module.exports = router;
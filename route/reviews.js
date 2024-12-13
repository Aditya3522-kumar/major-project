const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
// const Review = require("../models/reviews.js");
const isLoggedIn = require("../middleware.js");
// const Listing = require("../models/listing.js");
const {isReviewAuthor} = require("../middleware.js");
const reviewcontroller = require("../controller/reviewcontroller.js");

// Create a review
router.post("/:id/reviews", isLoggedIn, wrapasync(reviewcontroller.create));
//delete a review
router.delete("/:id/reviews/:reviewId", isLoggedIn,isReviewAuthor, wrapasync(reviewcontroller.destroy));
module.exports = router;


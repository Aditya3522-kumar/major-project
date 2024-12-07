const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const listings = require("./route/listing.js");
app.use(methodOverride('_method'));
// let wrapasync = require("./utils/wrapasync.js");
let ExpressError = require("./utils/ExpressError.js");
// const Review = require("./models/reviews.js");
const reviews = require("./route/reviews.js");



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log("not connected" , err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);


//this matches all route if nothing matched this will be called.
app.all("*" , (req,res,next)=>{
 next(new ExpressError(406,"did not matched any route"));
});
//custom error handling middleware.
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "error occurred" } = err;
    res.status(statuscode).render("error.ejs", { message });
});


app.listen(8000,()=>{
    console.log("server is listening to 8000");
});
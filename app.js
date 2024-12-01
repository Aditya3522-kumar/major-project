const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
app.use(methodOverride('_method'));
let wrapasync = require("./utils/wrapasync.js");
let ExpressError = require("./utils/ExpressError.js");


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
app.get("/",(req,res)=>{
    res.send("hii i am root");
});
//index route
app.get("/listings" , async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
});
//create route
app.get("/listings/new" , (req,res)=>{
   res.render("listings/new.ejs");
});
app.post("/listings/new",wrapasync(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400 , "bad request");
    }
    console.log(req.body.listing);
    await new Listing(req.body.listing).save();
    res.redirect("/listings");
})
);
//show route
app.get("/listings/:id" , wrapasync(async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    console.log("deu to editing");
    console.log(listing.image.url);
    res.render("listings/show.ejs", {listing});
}));
//edit route
app.get("/listings/:id/edit" ,wrapasync(async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));
//update route
app.put("/listing/:id" , async(req,res)=>{
    let {id} = req.params;
     let edited = await Listing.findByIdAndUpdate(id,req.body.listing ,{new:true}).then(()=>{
        res.redirect(`/listings/${id}`);
        // res.send("edit sucess");
    });
    console.log(edited);
});
//Delete route
app.delete("/listings/:id/delete" ,wrapasync(async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
}));
//this matches all route if nothing matched this will be called.
app.all("*" , (req,res,next)=>{
 next(new ExpressError(406,"error msg"));
});
//custom error handling middleware.
app.use((err,req,res,next)=>{
let {statuscode=500 , message="error occured"} = err;
res.render("error.ejs" , { message });
// res.status(statuscode).send(message);
});

app.listen(8000,()=>{
    console.log("server is listening to 8000");
});
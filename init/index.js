const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

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

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    await Review.deleteMany({});


    console.log("data initialised");

};
initDB();
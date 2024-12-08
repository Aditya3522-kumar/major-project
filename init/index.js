const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);

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
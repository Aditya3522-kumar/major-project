const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// const MONGO_URL = process.env.MONGO_URL;
// console.log(MONGO_URL);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // Clear existing data
  await Listing.deleteMany({});
  //  initData.data = initData.data.map((obj)=>({...obj,owner:'6756edab6730774ada229790'}))

  // Insert listings
  await Listing.insertMany(initData.data);
  
  console.log("listings inserted");
};

initDB().then(() => {
  mongoose.connection.close();
});
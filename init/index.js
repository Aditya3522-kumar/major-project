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

// Sample reviews data
const sampleReviews = [
  {
    comment: "Amazing place, beautiful views!",
    rating: 5,
  },
  {
    comment: "Good location but a bit expensive",
    rating: 4,
  },
  {
    comment: "Decent stay, could be better maintained",
    rating: 3,
  },
  {
    comment: "Wonderful experience, highly recommended!",
    rating: 5,
  },
  {
    comment: "Nice spot for a weekend getaway",
    rating: 4,
  }
];

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
   initData.data = initData.data.map((obj)=>({...obj,owner:'6756edab6730774ada229790'}))

  // Insert listings
  await Listing.insertMany(initData.data);
  console.log("listings inserted");
  
  // Add some reviews to each listing
  // for (let listing of listings) {
    // Randomly select 2-4 reviews for each listing
    // const numReviews = Math.floor(Math.random() * 3) + 2;
    // const reviews = [];
    
    // for (let i = 0; i < numReviews; i++) {
    //   const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
    //   const review = new Review(randomReview);
    //   await review.save();
    //   reviews.push(review);
    // }
    
  //   // Update listing with reviews
  //   listing.reviews = reviews;
  //   await listing.save();
  // }

  // console.log("data was initialized with reviews");
};

initDB().then(() => {
  mongoose.connection.close();
});
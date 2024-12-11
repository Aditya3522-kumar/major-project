const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./reviews.js");

let listingSchema = new Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  image:{
    // required:true,
    filename:{
        type:String,
    },
    url:{
        type:String,
        // required:true,
        default:"https://r1imghtlak.ibcdn.com/13fbd69e5d7211eb8d130242ac110002.jpg?downsize=1920:1080",
        set:(v)=> v===""?"https://r1imghtlak.ibcdn.com/13fbd69e5d7211eb8d130242ac110002.jpg?downsize=1920:1080":v
    },

//    type:String,

  },
  price:{
    type:Number,
    required:true,
    default:1000,
  },
  location:{
    type:String,
    required:true,
  },
  country:{
    type:String,
    required:true,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    },
  ],

  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;
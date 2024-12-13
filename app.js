const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const listingrouter = require("./route/listing.js");
app.use(methodOverride('_method'));
let ExpressError = require("./utils/ExpressError.js");
const reviewrouter = require("./route/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./models/user.js");
const userrouter = require("./route/user.js");
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const sessionOptions = {
    secret:"secret" ,
    resave:false , 
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const MONGO_URL = process.env.MONGO_URL;	


main().then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log("not connected" , err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log(res.locals.currUser);
    next();
});

app.get("/demouser" , async (req,res)=>{
    const fakeUser = new User({
        email:"student@gmail.com",
        username:"delta-student",
    });

    let registeredUser = await user.register(fakeUser , "helloworld");
    res.send(registeredUser);
  })

app.use("/listings" , listingrouter);
app.use("/listings" , reviewrouter);
app.use("/" , userrouter);

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
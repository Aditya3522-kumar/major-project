const express = require("express");
let app = express();
let ExpressError = require("./ExpressError");
// app.use((req,res)=>{
//     let { query }=req.query;
//     console.log(query);
//     console.log("hi i a middleware");
//     res.send("middleware finished");
// });
app.use("/api" ,(req,res,next)=>{
  console.log("api middleware");
  next();
});

app.get("/admin" , (req,res)=>{
  throw new ExpressError(430 , "acces to admin is forbidden");
});

app.get("/adam" , (req,res)=>{
  throw new ExpressError(430 , "acces to adam is forbidden");
});

 app.get("/",(req,res)=>{
    res.send("i am root");
 });
 app.get("/api",(req,res)=>{
   res.send("i  am api route");
})

 app.get("/random",(req,res)=>{
    res.send("i am random");
 });
  app.listen(8080,()=>{
    console.log("listening on port 8080");
  })

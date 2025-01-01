if(process.env.NODE_ENV !="production"){require("dotenv").config();} 
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const Listing = require("./models/listing.js");
const { listingSchema ,reviewSchema} = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const app = express();
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/reviews.js");
const userRouter= require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy =require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;
// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Middleware
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
 // Only necessary if you're using layouts, but it's removed from usage here.

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7*24*60*1000,
    httpOnly:true,

  }

};


// Route Mounting

app.use(session (sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>
{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);











// Catch-all Route
app.all("*", (req, res, next) => next(new ExpressError(404, "Page Not Found")));

// Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("Error", { statusCode, message }); // Manual render of error page
});

// Start Server
app.listen(8080, () => console.log("Server is listening on port 8080"));

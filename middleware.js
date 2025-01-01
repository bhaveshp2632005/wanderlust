const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing");
const Review = require("./models/review");
// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the URL user was trying to access
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

// Middleware to save the redirect URL for logged-out users
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Middleware to check if the logged-in user is the owner of a listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission to edit this listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
  if (!req.body.listing) {
    throw new ExpressError("Invalid or missing listing data", 400);
  }
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errorMessage, 400);
  }
  next();
};

// Middleware to validate review data using Joi schema
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errorMessage, 400);
  }
  next();
};
module.exports.ReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    try {
      const review= await ReviewfindById(reviewId);
      if (!review) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
      }
      if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing!");
        return res.redirect(`/listings/${id}`);
      }
      next();
    } catch (err) {
      next(err);
    }
  };

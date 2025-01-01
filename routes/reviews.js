const express = require("express");
const router = express.Router({ mergeParams: true }); // Merge params to access :id from the parent route
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, ReviewAuthor } = require("../middleware.js");
const { postReview } = require("../controllers/reviews.js");

// Route to post a new review
router.post("/", isLoggedIn, validateReview, wrapAsync(postReview));

// Route to delete a review
router.delete("/:reviewId", isLoggedIn, ReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review itself
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;

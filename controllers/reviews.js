const Listing = require("../models/listing"); // Replace with the correct path
const Review = require("../models/review");   // Replace with the correct path

module.exports.postReview = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${req.params.id}`);
  } catch (e) {
    console.error("Error posting review:", e.message);
    next(e); // Pass the error to an error-handling middleware
  }
};


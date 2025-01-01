const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

// Utility function for validating ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Error handling function
const handleError = (req, res, message, redirectPath = "/listings") => {
  req.flash("error", message);
  return res.redirect(redirectPath);
};

// Get all listings
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (error) {
    handleError(req, res, "Failed to retrieve listings");
  }
};

// Show a single listing
module.exports.show = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return handleError(req, res, "Invalid Listing ID");

  try {
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: { path: "author" },
    });
    if (!listing) return handleError(req, res, "Listing not found");
    
    res.render("listings/show", { listing });
  } catch (error) {
    handleError(req, res, "Error fetching listing details");
  }
};

// Create a new listing
module.exports.createListing = async (req, res) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    handleError(req, res, "Failed to create listing");
  }
};

// Edit a listing
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return handleError(req, res, "Invalid Listing ID");

  try {
    const listing = await Listing.findById(id);
    if (!listing) return handleError(req, res, "Listing not found");
    
    res.render("listings/edit", { listing });
  } catch (error) {
    handleError(req, res, "Error fetching listing for editing");
  }
};

// Update a listing
// Update a listing
module.exports.updateListing = async (req, res) => {
  let {id}=req.params;
 let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
 let url = req.file.path;
 let filename = req.file.filename;
 listing.image={filename, url};
 await listing.save();
 req.flash("success","listing updated !");
  res.redirect(`/listings/${id}`);


};


// Delete a listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return handleError(req, res, "Invalid Listing ID");

  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) return handleError(req, res, "Listing not found");

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (error) {
    handleError(req, res, "Error deleting listing");
  }
};

// Delete a review from a listing
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  try {
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    handleError(req, res, "Error deleting review");
  }
};

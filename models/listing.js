const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Define the schema for a listing
const listingSchema = new Schema({
  // Title of the listing (required)
  title: {
    type: String,
    required: [true, "Title is required"], // Custom error message for validation
  },

  // Description of the listing (optional)
  description: {
    type: String,
  },

  // Image URL with default fallback
  image: {
    filename: { type: String },
    url: { type: String},
  },
  

  // Price of the listing (optional)
  price: {
    type: Number,
    min: [0, "Price must be a positive number"], // Validation for non-negative values
  },

  // Location and country of the listing (optional)
  location: {
    type: String,
  },
  country: {
    type: String,
  },

  // Array of review references
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  // Reference to the owner of the listing
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner is required"], // Ensure every listing has an owner
  },
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    // Remove all reviews associated with the deleted listing
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Create and export the Listing model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

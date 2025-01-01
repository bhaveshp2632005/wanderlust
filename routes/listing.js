const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // Use storage directly here

// Index and Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Index Route
  .post(
    isLoggedIn,
    upload.single("image"), // Add multer middleware for handling file upload
    validateListing,
    wrapAsync(listingController.createListing)
  ); // Create Route

// New Route - Render form to create a new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// Show, Edit, Update, and Delete Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.show)) // Show Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"), // Include multer middleware for updating images
    validateListing,
    wrapAsync(listingController.updateListing) // Update Route
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete Route

// Edit Route - Render form to edit a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing) // Render the edit form
);

module.exports = router;

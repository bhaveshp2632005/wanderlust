const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Import your User model
const wrapAsync = require("../utils/wrapAsync"); // For handling async errors
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const { signup, login, renderLoginForm, logout } = require("../controllers/user.js");
// GET Signup Form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs"); // Ensure this file exists in the 'views/users' folder
});

// POST Signup Form
router.post(
  "/signup",
  wrapAsync(signup)
);

router.get("/login",renderLoginForm
);
router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);
router.get("/logout",logout)
module.exports = router;

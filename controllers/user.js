const User = require('../models/user'); // Adjust path as per your project structure
const passport = require('passport');

module.exports.signup=async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome to WanderLust, ${username}!`);
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}    
module.exports.login=async(req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    return res.redirect(redirectUrl);
  }
 module.exports.logout=(req,res)=>{
    req.logout((err)=>{
      if(err){
       return next(err);
      }
      req.flash("success","you are logged out! ");
      res.redirect("/listings");
    })
  }
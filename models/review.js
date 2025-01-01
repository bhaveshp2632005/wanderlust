const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: { type: String, required: true }, // Changed "Comment" to lowercase and made it required
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Ensure that rating is required
  },
  createdAt: {
    type: Date,
    default: Date.now, // Use function instead of invoking Date.now()
  },
  author:{
    type: Schema.Types.ObjectId,
    ref:"User",

},

});

module.exports = mongoose.model("Review", reviewSchema);

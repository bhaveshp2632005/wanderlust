const Joi = require("joi");
const review = require("./models/review");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null), // Allows empty or null image URLs
  }).required(),
});

module.exports = { listingSchema };

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),  // Ensure the rating is within 1-5 range
    comment: Joi.string().required(),  // Changed 'Comment' to lowercase 'comment'
  }).required(),
});

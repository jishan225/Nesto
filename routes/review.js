const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggendIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//validate review
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//post reviews route
router.post("/", isLoggendIn, validateReview, wrapAsync(reviewController.postReview));

//delete review route
router.delete("/:reviewId", isLoggendIn, isReviewAuthor, wrapAsync(reviewController.deleteListing));

module.exports = router;

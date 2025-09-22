const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });

//validation Listing schema
const validationListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validationListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
  )

  //New ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);  

router
  .route("/:id")
  .get( wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validationListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

//Index route
// router.get("/", wrapAsync(listingController.index));



//SHOW ROUTE
// router.get("/:id", wrapAsync(listingController.showListings));

//Create Route
// router.post(
//   "/",
//   validationListing,
//   isLoggendIn,
//   wrapAsync(listingController.createListing)
// );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//Update route
// router.put(
//   "/:id",
//   isLoggendIn,
//   isOwner,
//   wrapAsync(listingController.updateListing)
// );

//Delete Route
// router.delete(
//   "/:id",
//   isLoggendIn,
//   isOwner,
//   wrapAsync(listingController.deleteListing)
// );

module.exports = router;

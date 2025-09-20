const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggendIn, isOwner } = require("../middleware.js");

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

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings", { allListings });
  })
);

//New ROUTE
router.get("/new", isLoggendIn, (req, res) => {
  res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
  .populate('reviews')
  .populate({
    path: 'reviews',
    populate: { path: 'author' }
  })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  validationListing,
  isLoggendIn,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggendIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
router.put(
  "/:id",
  isLoggendIn,
  isOwner,
  wrapAsync(async (req, res) => {
    try {
      let { id } = req.params;

      // Convert string URL to proper image object structure
      if (
        req.body.Listing.image &&
        typeof req.body.Listing.image === "string"
      ) {
        req.body.Listing.image = {
          filename: "listingimage",
          url: req.body.Listing.image,
        };
      }

      console.log("Update data:", req.body.Listing); // Debug log
      await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
      req.flash("success", "Listing Updated!");
      res.redirect(`/listings/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).send("Server error");
    }
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggendIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;

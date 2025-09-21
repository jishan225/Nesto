const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
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
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
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
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
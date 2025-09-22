const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const { checkIn, checkOut, guests } = req.body;

  const days =
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  if (days <= 0) {
    req.flash("error", "Invalid check-in/check-out dates!");
    return res.redirect(`/listings/${id}`);
  }

  const totalPrice = days * listing.price;

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
    guests,
    totalPrice,
  });

  await booking.save();

  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${id}`);
};

module.exports.showBookings = async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({ listing: id }).populate("user");
  const listing = await Listing.findById(id);
  
  // Fixed render path - points to actual template file
  res.render("booking/index.ejs", { bookings, listing });
};

module.exports.showBookingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  
  // This renders your existing booking form
  res.render("booking/booking.ejs", { listing });
};


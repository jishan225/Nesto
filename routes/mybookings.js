
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const Booking = require("../models/booking");

// GET /my-bookings — list current user’s bookings
router.get("/mybookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/mybookings.ejs", { bookings });
});

module.exports = router;

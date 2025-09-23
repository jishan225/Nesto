const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// Show booking form
router.get("/new", isLoggedIn, bookingController.showBookingForm);

// Create booking
router.post("/", isLoggedIn, bookingController.createBooking);

module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// Put specific routes BEFORE parameterized ones
router.get("/new", isLoggedIn, wrapAsync(bookingController.showBookingForm));

// POST route (no conflict)
router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));

// This should go LAST (most general route)
router.get("/", isLoggedIn, wrapAsync(bookingController.showBookings));

module.exports = router;


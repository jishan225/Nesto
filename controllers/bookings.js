const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

// Show booking form
module.exports.showBookingForm = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];

        res.render("listings/booking.ejs", { 
            listing,
            today,
            tomorrow
        });
    } catch (error) {
        console.error('Show booking form error:', error);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};

// Create new booking (Store in database)
module.exports.createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, guests } = req.body;

        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // Basic validation
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date().setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            req.flash("error", "Check-in date cannot be in the past!");
            return res.redirect(`/listings/${id}/bookings/new`);
        }

        if (checkOutDate <= checkInDate) {
            req.flash("error", "Check-out date must be after check-in date!");
            return res.redirect(`/listings/${id}/bookings/new`);
        }

        // Calculate total price
        const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalPrice = days * listing.price;

        // Create and save booking to database
        const booking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: parseInt(guests),
            totalPrice
        });

        await booking.save(); // Save to database

        console.log(`✅ Booking saved to database:`, {
            bookingId: booking._id,
            listingTitle: listing.title,
            user: req.user.username,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guests,
            totalPrice: totalPrice
        });

        req.flash("success", "Booking confirmed and saved successfully! 🎉");
        res.redirect(`/listings/${id}`); // Redirect back to listing

    } catch (error) {
        console.error('Create booking error:', error);
        req.flash("error", "Failed to save booking. Please try again.");
        res.redirect(`/listings/${id}/bookings/new`);
    }
};

// List all bookings for the logged-in user
module.exports.showMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 });

    // IMPORTANT: Path must match your real file name/location
    // Your path: view/bookings/mybookings.ejs
    res.render("bookings/mybookings.ejs", { bookings });
  } catch (error) {
    console.error("Load my bookings error:", error);
    req.flash("error", "Failed to load bookings.");
    res.redirect("/listings");
  }
};


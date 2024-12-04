const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Define routes for Booking
router.post('/', bookingController.createBooking); // Create a new booking
router.get('/', bookingController.getAllBookings); // Get all bookings
router.get('/:id', bookingController.getBookingById); // Get a booking by ID
router.put('/:id', bookingController.updateBooking); // Update a booking by ID
router.delete('/:id', bookingController.deleteBooking); // Delete a booking by ID

module.exports = router;

const Booking = require('../models/booking');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};

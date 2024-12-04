const Booking = require('../models/booking');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Get clientId from the authenticated user (from JWT token)
    const clientId = req.user.id;

    // Destructure and validate request body fields
    const { serviceId, date, status } = req.body;
    if (!serviceId || !date || !status) {
      return res.status(400).json({ message: 'All fields are required: serviceId, date, status' });
    }

    // Create a new booking
    const booking = new Booking({
      clientId,
      serviceId,
      date,
      status,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get all bookings - Admin only
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('clientId serviceId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('clientId serviceId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error.message);
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// Update a booking - Admin or the client who created the booking
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow updating if the current user is admin or the booking owner
    if (req.user.role !== 'Admin' && req.user.id !== booking.clientId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this booking' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error.message);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// Delete a booking - Admin or the client who created the booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow deleting if the current user is admin or the booking owner
    if (req.user.role !== 'Admin' && req.user.id !== booking.clientId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error.message);
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

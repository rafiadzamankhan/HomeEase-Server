const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Get all bookings for a user
router.get('/user/:userId', bookingController.getUserBookings);

// Get all bookings for a provider
router.get('/provider-email/:email', bookingController.getBookingsByProviderEmail);

// Update booking status
router.put('/:id/status', bookingController.updateBookingStatus);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);
// Get all bookings by service receiver email
router.get('/receiver/:email', bookingController.getBookingsByReceiverEmail);

// Get all bookings by service provider email
router.get('/provider/:email', bookingController.getBookingsByProviderEmail);

router.patch('/:id', bookingController.updateBooking);


module.exports = router;
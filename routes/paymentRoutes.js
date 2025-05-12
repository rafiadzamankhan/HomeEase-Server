const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment intent
router.post('/intent', paymentController.createPaymentIntent);

// Confirm payment and create booking
router.post('/confirm', paymentController.confirmPayment);

// Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// Get payments by user ID
router.get('/user/:userId', paymentController.getPaymentsByUser);

router.post('/', paymentController.createPayment);

// Get payment by booking ID
router.get('/booking/:bookingId', paymentController.getPaymentByBooking);

module.exports = router;
require('dotenv').config()
const PaymentModel = require('../models/paymentModel');
const BookingModel = require('../models/bookingModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentController = {
  // Create payment intent with Stripe
  createPaymentIntent: async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        payment_method_types: ['card']
      });

      res.status(200).json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Payment intent error:', error);
      res.status(500).json({ error: error.message });
    }
  },
  

  // Confirm payment and create booking
  confirmPayment: async (req, res) => {
    try {
      const { bookingData, paymentIntentId, paymentMethod } = req.body;

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      // Create booking
      const booking = await BookingModel.createBooking({
        ...bookingData,
        status: 'confirmed'
      });

      // Create payment record
      const payment = await PaymentModel.createPayment({
        bookingId: booking.insertedId,
        userId: bookingData.userId,
        providerId: bookingData.providerId,
        amount: bookingData.totalAmount,
        transactionId: paymentIntent.id,
        paymentMethod: 'card',
        status: 'completed'
      });

      res.status(201).json({
        booking,
        payment,
        message: 'Payment and booking confirmed'
      });

    } catch (error) {
      console.error('Payment confirmation error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const payment = await PaymentModel.getPaymentById(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get payments by user ID
  getPaymentsByUser: async (req, res) => {
    try {
      const payments = await PaymentModel.getPaymentsByUser(req.params.userId);
      res.status(200).json(payments);
    } catch (error) {
      console.error('Get user payments error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get payment by booking ID
  getPaymentByBooking: async (req, res) => {
    try {
      const payment = await PaymentModel.getPaymentsByBooking(req.params.bookingId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found for this booking" });
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error('Get booking payment error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  createPayment: async (req, res) => {
    try {
      const paymentData = req.body;
      const result = await PaymentModel.createPayment(paymentData);
      res.status(201).send(result);
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).send({ error: error.message });
    }
  },
};

module.exports = paymentController;
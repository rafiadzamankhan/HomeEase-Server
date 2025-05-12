const BookingModel = require("../models/bookingModel");

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const bookingData = req.body;
      const result = await BookingModel.createBooking(bookingData);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getBookingById: async (req, res) => {
    try {
      const id = req.params.id;
      const booking = await BookingModel.getBookingById(id);
      if (booking) {
        res.status(200).json(booking);
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserBookings: async (req, res) => {
    try {
      const userId = req.params.userId;
      const bookings = await BookingModel.getBookingsByUser(userId);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProviderBookings: async (req, res) => {
    try {
      const providerId = req.params.providerId;
      const bookings = await BookingModel.getBookingsByProvider(providerId);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateBookingStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const result = await BookingModel.updateBookingStatus(id, status);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await BookingModel.deleteBooking(id);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  updateBooking: async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const result = await BookingModel.updateBooking(id, updateData);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  getBookingsByReceiverEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const bookings = await BookingModel.getBookingsByReceiverEmail(email);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getBookingsByProviderEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const bookings = await BookingModel.getBookingsByProviderEmail(email);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookingController;

const ServiceModel = require("../models/serviceModel");

const serviceController = {
  getAllServices: async (req, res) => {
    try {
      const result = await ServiceModel.getAllServices();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getServiceById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await ServiceModel.getServiceById(id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getServiceByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await ServiceModel.getServicesByEmail(email);
      // console.log('Email:', email, 'Result:', result);

      if (result && result.length > 0) {
        // Check for array length
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "No services found for this email" });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },

  createService: async (req, res) => {
    try {
      const service = req.body;
      const result = await ServiceModel.createService(service);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteService: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await ServiceModel.deleteService(id);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateService: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      if (!id || !updatedData) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Both ID and update data are required",
        });
      }

      const result = await ServiceModel.updateService(id, updatedData);

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Service not found",
          details: `No service found with ID: ${id}`,
        });
      }

      res.status(200).json({
        message: "Service updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Detailed update error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  // Add these methods to the serviceController object

  getReviewsByReviewerEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await ServiceModel.getReviewsByReviewerEmail(email);

      if (result && result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "No reviews found for this reviewer" });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },

  updateReviewByReviewerEmail: async (req, res) => {
    try {
      const { serviceId, email } = req.params;
      const updatedReview = req.body;

      if (!serviceId || !email || !updatedReview) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Service ID, reviewer email, and update data are required",
        });
      }

      const result = await ServiceModel.updateReviewByReviewerEmail(
        serviceId,
        email,
        updatedReview
      );

      res.status(200).json({
        message: "Review updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },

  deleteReviewByReviewerEmail: async (req, res) => {
    try {
      const { serviceId, email } = req.params;

      if (!serviceId || !email) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Both service ID and reviewer email are required",
        });
      }

      const result = await ServiceModel.deleteReviewByReviewerEmail(
        serviceId,
        email
      );

      res.status(200).json({
        message: "Review deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },
};

module.exports = serviceController;

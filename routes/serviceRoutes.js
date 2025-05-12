const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// Get all services
router.get("/", serviceController.getAllServices);

// Get a single service by ID
router.get("/:id", serviceController.getServiceById);
router.get("/my/:email", serviceController.getServiceByEmail);
// Create a new service
router.post("/", serviceController.createService);

// Delete a service
router.delete("/:id", serviceController.deleteService);

// Update a service
router.put("/:id", serviceController.updateService);

// Add these routes to serviceRoutes.js

// Get all reviews by reviewer email
router.get("/reviews/:email", serviceController.getReviewsByReviewerEmail);

// Update a review by service ID and reviewer email
router.put(
  "/:serviceId/reviews/:email",
  serviceController.updateReviewByReviewerEmail
);

// Delete a review by service ID and reviewer email
router.delete(
  "/:serviceId/reviews/:email",
  serviceController.deleteReviewByReviewerEmail
);

module.exports = router;

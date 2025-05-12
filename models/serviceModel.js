const { connectToDatabase, getObjectId } = require("../config/db");

class ServiceModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection("homeEaseServices");
  }

  static async getAllServices() {
    const collection = await this.getCollection();
    return collection.find().toArray();
  }

  static async getServiceById(id) {
    try {
      const collection = await this.getCollection();
      return collection.findOne({ _id: getObjectId(id) });
    } catch (error) {
      console.error("Invalid ID format:", id);
      return null;
    }
  }

  static async getServicesByEmail(email) {
    const collection = await this.getCollection();
    return collection.find({ email }).toArray();
  }

  static async createService(service) {
    const collection = await this.getCollection();
    return collection.insertOne(service);
  }

  static async deleteService(id) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: getObjectId(id) });
  }

  // In serviceModel.js - update the updateService method
  static async updateService(id, updatedData) {
    try {
      const collection = await this.getCollection();
      // Remove _id from updatedData if present to prevent modification of immutable field
      const { _id, ...updatePayload } = updatedData;

      const result = await collection.updateOne(
        { _id: getObjectId(id) },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new Error("No service found with that ID");
      }

      return {
        success: true,
        ...result,
        updatedService: await this.getServiceById(id), // Return the updated document
      };
    } catch (error) {
      console.error("Update service error:", error);
      throw error; // Re-throw for controller to handle
    }
  }
  // Add these methods to the ServiceModel class in serviceModel.js

  static async getReviewsByReviewerEmail(email) {
    const collection = await this.getCollection();
    return collection
      .aggregate([
        { $unwind: "$reviews" },
        { $match: { "reviews.reviewerEmail": email } },
        {
          $project: {
            serviceId: "$_id",
            serviceName: "$name",
            review: "$reviews",
            _id: 0,
          },
        },
      ])
      .toArray();
  }

  static async updateReviewByReviewerEmail(
    serviceId,
    reviewerEmail,
    updatedReview
  ) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      {
        _id: getObjectId(serviceId),
        "reviews.reviewerEmail": reviewerEmail,
      },
      { $set: { "reviews.$": updatedReview } }
    );

    if (result.matchedCount === 0) {
      throw new Error("No matching review found");
    }

    return result;
  }

  static async deleteReviewByReviewerEmail(serviceId, reviewerEmail) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: getObjectId(serviceId) },
      { $pull: { reviews: { reviewerEmail } } }
    );

    if (result.matchedCount === 0) {
      throw new Error("No matching review found");
    }

    return result;
  }
}

module.exports = ServiceModel;

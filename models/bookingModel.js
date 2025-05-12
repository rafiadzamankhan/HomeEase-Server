const { connectToDatabase, getObjectId } = require('../config/db');

class BookingModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection('bookings');
  }

  static async createBooking(bookingData) {
    const collection = await this.getCollection();
    return collection.insertOne(bookingData);
  }

  static async getBookingById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: getObjectId(id) });
  }

  static async getBookingsByUser(userId) {
    const collection = await this.getCollection();
    return collection.find({ userId: getObjectId(userId) }).toArray();
  }

  static async getBookingsByProvider(providerId) {
    const collection = await this.getCollection();
    return collection.find({ providerId: getObjectId(providerId) }).toArray();
  }

  static async updateBookingStatus(id, status) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(id) },
      { $set: { status } }
    );
  }

  static async deleteBooking(id) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: getObjectId(id) });
  }
  static async updateBooking(id, updateData) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(id) },
      { $set: updateData }
    );
  }
  static async getBookingsByReceiverEmail(email) {
    const collection = await this.getCollection();
    return collection.find({ serviceRecieverEmail: email }).toArray();
  }
  static async getBookingsByProviderEmail(email) {
    const collection = await this.getCollection();
    return collection.find({ serviceProviderEmail: email }).toArray();
  }
}

module.exports = BookingModel;
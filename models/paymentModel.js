const { connectToDatabase, getObjectId } = require('../config/db');

class PaymentModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection('payments');
  }

  static async createPayment(paymentData) {
    const collection = await this.getCollection();
    return collection.insertOne(paymentData);
  }

  static async getPaymentById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: getObjectId(id) });
  }

  static async getPaymentsByUser(userId) {
    const collection = await this.getCollection();
    return collection.find({ userId: getObjectId(userId) }).toArray();
  }

  static async getPaymentsByBooking(bookingId) {
    const collection = await this.getCollection();
    return collection.findOne({ bookingId: getObjectId(bookingId) });
  }

  static async updatePaymentStatus(id, status) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(id) },
      { $set: { status } }
    );
  }
}

module.exports = PaymentModel;
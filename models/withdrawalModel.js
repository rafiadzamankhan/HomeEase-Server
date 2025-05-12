const { connectToDatabase, getObjectId } = require("../config/db");

class WithdrawalModel {
  static async getCollection() {
    const db = await connectToDatabase();
    return db.collection("withdrawalRequests");
  }

  static async createWithdrawalRequest(request) {
    const collection = await this.getCollection();
    return collection.insertOne({
      ...request,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static async getWithdrawalsByEmail(email) {
    const collection = await this.getCollection();
    return collection.find({ email }).sort({ createdAt: -1 }).toArray();
  }

  static async getAllWithdrawals() {
    const collection = await this.getCollection();
    return collection.find().sort({ createdAt: -1 }).toArray();
  }

  static async updateWithdrawalStatus(id, status) {
    const collection = await this.getCollection();
    return collection.updateOne(
      { _id: getObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );
  }
}

module.exports = WithdrawalModel;
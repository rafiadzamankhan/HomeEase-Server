const WithdrawalModel = require("../models/withdrawalModel");
const UserModel = require("../models/userModel");
const { getObjectId } = require("../config/db"); // Add this import

const withdrawalController = {
  createWithdrawalRequest: async (req, res) => {
    try {
      const { email, amount, paymentMethod } = req.body;
      
      // Validate amount
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).send({ error: "Invalid amount" });
      }

      // Check user balance
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      if (user.balance < amount) {
        return res.status(400).send({ error: "Insufficient balance" });
      }

      // Create withdrawal request
      const result = await WithdrawalModel.createWithdrawalRequest({
        email,
        amount,
        paymentMethod,
        name: user.name
      });

      res.status(201).send(result);
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      res.status(500).send({ error: error.message });
    }
  },

  getUserWithdrawals: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await WithdrawalModel.getWithdrawalsByEmail(email);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getAllWithdrawals: async (req, res) => {
    try {
      const result = await WithdrawalModel.getAllWithdrawals();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateWithdrawalStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Get the withdrawal request first
      const collection = await WithdrawalModel.getCollection();
      const withdrawalRequest = await collection.findOne({ _id: getObjectId(id) });
      
      if (!withdrawalRequest) {
        return res.status(404).send({ error: "Withdrawal request not found" });
      }

      // Update withdrawal status
      const result = await WithdrawalModel.updateWithdrawalStatus(id, status);

      // If approved, deduct from user's balance
      if (status === "approved") {
        await UserModel.updateUserBalance(
          withdrawalRequest.email, 
          -withdrawalRequest.amount
        );
      }

      res.send(result);
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      res.status(500).send({ 
        error: "Failed to update withdrawal status",
        details: error.message 
      });
    }
  }
};

module.exports = withdrawalController;
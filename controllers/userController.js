const UserModel = require("../models/userModel");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const result = await UserModel.getAllUsers();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.getUserByEmail(email);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = req.body;
      const existingUser = await UserModel.getUserByEmail(user.email);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await UserModel.createUser(user);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await UserModel.deleteUser(id);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const userEmail = req.params.email;
      const { role } = req.body;
      const result = await UserModel.updateUserRole(userEmail, role);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  checkAdminStatus: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.checkAdminStatus(email);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  checkProviderStatus: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.checkProviderStatus(email);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  updateUserBalance: async (req, res) => {
    try {
      const email = req.params.email;
      const { amount } = req.body;
      
      // Validate amount is a number
      if (typeof amount !== 'number') {
        return res.status(400).send({ error: "Amount must be a number" });
      }
      
      const result = await UserModel.updateUserBalance(email, amount);
      res.send(result);
    } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).send({ error: error.message });
    }
  },

  getUserBalance: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await UserModel.getUserBalance(email);
      res.send({ balance: result });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  updateProfilePicture: async (req, res) => {
    try {
      const email = req.params.email;
      const { photoUrl } = req.body;

      if (!photoUrl) {
        return res.status(400).send({ error: "Photo URL is required" });
      }

      const result = await UserModel.updateProfilePicture(email, photoUrl);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};

module.exports = userController;

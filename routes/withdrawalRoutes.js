const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

// Withdrawal routes
router.post('/', withdrawalController.createWithdrawalRequest);
router.get('/user/:email', withdrawalController.getUserWithdrawals);
router.get('/', withdrawalController.getAllWithdrawals);
router.put('/:id', withdrawalController.updateWithdrawalStatus);

module.exports = router;
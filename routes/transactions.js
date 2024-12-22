const express = require('express');
const transactionsController = require('../controllers/transactions');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticateToken, transactionsController.createTransaction);
router.get('/', authenticateToken, transactionsController.getAllTransactions);
router.get('/:id', authenticateToken, transactionsController.getTransactionById);
router.put('/:id', authenticateToken, transactionsController.updateTransaction);
router.delete('/:id', authenticateToken, transactionsController.deleteTransaction);

module.exports = router;

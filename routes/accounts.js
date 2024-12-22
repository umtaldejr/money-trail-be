const express = require('express');
const accountController = require('../controllers/accounts');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticateToken, accountController.createAccount);
router.get('/', authenticateToken, accountController.getAllAccounts);
router.get('/:id', authenticateToken, accountController.getAccountById);
router.put('/:id', authenticateToken, accountController.updateAccount);
router.delete('/:id', authenticateToken, accountController.deleteAccount);

module.exports = router;

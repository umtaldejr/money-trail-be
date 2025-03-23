const express = require('express');
const usersController = require('../controllers/users');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/', usersController.createUser);
router.get('/', authenticateToken, usersController.getAllUsers);
router.get('/:id', authenticateToken, usersController.getUserById);
router.put('/:id', authenticateToken, usersController.updateUser);
router.delete('/:id', authenticateToken, usersController.deleteUser);

module.exports = router;

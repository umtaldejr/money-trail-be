const express = require('express');
const categoriesController = require('../controllers/categories');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticateToken, categoriesController.createCategory);
router.get('/', authenticateToken, categoriesController.getAllCategories);
router.get('/:id', authenticateToken, categoriesController.getCategoryById);
router.put('/:id', authenticateToken, categoriesController.updateCategory);
router.delete('/:id', authenticateToken, categoriesController.deleteCategory);

module.exports = router;

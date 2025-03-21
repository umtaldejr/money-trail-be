const { v4: uuidv4 } = require('uuid');
const { categories } = require('../db');

exports.createCategory = (req, res) => {
  const { name, parentId } = req.body;
  const userId = req.user.id;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (parentId) {
    const parentCategory = categories.find(cat => cat.id === parentId && cat.userId === userId);
    if (!parentCategory) {
      return res.status(404).json({ error: 'Parent category not found or access denied' });
    }
  }
  const newCategory = { id: uuidv4(), name, userId, parentId: parentId || null };
  categories.push(newCategory);
  res.status(201).json(newCategory);
};

exports.getAllCategories = (req, res) => {
  const userId = req.user.id;
  const userCategories = categories.filter(cat => cat.userId === userId);
  res.json(userCategories);
};

exports.getCategoryById = (req, res) => {
  const userId = req.user.id;
  const category = categories.find(cat => cat.id === req.params.id && cat.userId === userId);
  if (!category) {
    return res.status(404).json({ error: 'Category not found or access denied' });
  }
  res.json(category);
};

exports.updateCategory = (req, res) => {
  const { name, parentId } = req.body;
  const userId = req.user.id;
  const categoryIndex = categories.findIndex(cat => cat.id === req.params.id && cat.userId === userId);
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found or access denied' });
  }
  if (parentId && parentId !== req.params.id) {
    const parentCategory = categories.find(cat => cat.id === parentId && cat.userId === userId);
    if (!parentCategory) {
      return res.status(404).json({ error: 'Parent category not found or access denied' });
    }
    categories[categoryIndex].parentId = parentId;
  }
  if (name) categories[categoryIndex].name = name;
  res.json(categories[categoryIndex]);
};

exports.deleteCategory = (req, res) => {
  const userId = req.user.id;
  const categoryIndex = categories.findIndex(cat => cat.id === req.params.id && cat.userId === userId);
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found or access denied' });
  }
  const categoryId = req.params.id;
  const recursiveDelete = (id) => {
    const children = categories.filter(cat => cat.parentId === id && cat.userId === userId);
    for (const child of children) {
      recursiveDelete(child.id);
    }
    const index = categories.findIndex(cat => cat.id === id && cat.userId === userId);
    if (index !== -1) categories.splice(index, 1);
  };
  recursiveDelete(categoryId);
  res.status(204).send();
};

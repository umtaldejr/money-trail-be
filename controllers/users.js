const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { users } = require('../db');

exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), email, password: hashedPassword };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, email: newUser.email });
};

exports.getAllUsers = (req, res) => {
  const safeUsers = users.map(({ id, email }) => ({ id, email }));
  res.json(safeUsers);
};

exports.getUserById = (req, res) => {
  const userId = req.user.id;
  if (userId !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const user = users.find(user => user.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, email: user.email });
};

exports.updateUser = async (req, res) => {
  const userId = req.user.id;
  if (userId !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { email, password } = req.body;
  const userIndex = users.findIndex(user => user.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  const existingUser = users.find(user => user.email === email && user.id !== req.params.id);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const updatedUser = {
    ...users[userIndex],
    ...(email && { email }),
    ...(password && { password: await bcrypt.hash(password, 10) })
  };
  users[userIndex] = updatedUser;
  res.json({ id: updatedUser.id, email: updatedUser.email });
};

exports.deleteUser = (req, res) => {
  const userId = req.user.id;
  if (userId !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const userIndex = users.findIndex(user => user.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(userIndex, 1);
  res.status(204).send();
};

exports.findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

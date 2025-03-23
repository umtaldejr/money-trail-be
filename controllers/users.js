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
  const newUser = {
    id: uuidv4(),
    email,
    password: await bcrypt.hash(password, 10),
  };
  users.push(newUser);
  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...safeUser } = newUser;
  res.status(201).json(safeUser);
};

exports.getAllUsers = (req, res) => {
  const safeUsers = users
    .filter(user => user.id === req.user.id)
    // eslint-disable-next-line no-unused-vars
    .map(({ password: _password, ...safeUser }) => safeUser);
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
  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...safeUser } = user;
  res.json(safeUser);
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
  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...safeUser } = updatedUser;
  res.json(safeUser);
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

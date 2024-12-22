const { v4: uuidv4 } = require('uuid');
const { accounts } = require('../db');

exports.createAccount = async (req, res) => {
  const { name, type, balance } = req.body;
  const userId = req.user.id;
  if (!name || !type || balance === undefined) {
    return res.status(400).json({ error: 'Name, type, and balance are required' });
  }
  const newAccount = { id: uuidv4(), name, type, balance: parseFloat(balance), userId };
  accounts.push(newAccount);
  res.status(201).json(newAccount);
};

exports.getAllAccounts = (req, res) => {
  const userId = req.user.id;
  const userAccounts = accounts.filter(acc => acc.userId === userId);
  res.json(userAccounts);
};

exports.getAccountById = (req, res) => {
  const userId = req.user.id;
  const account = accounts.find(acc => acc.id === req.params.id && acc.userId === userId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found or access denied' });
  }
  res.json(account);
};

exports.updateAccount = async (req, res) => {
  const { name, type, balance } = req.body;
  const userId = req.user.id;
  const accountIndex = accounts.findIndex(acc => acc.id === req.params.id && acc.userId === userId);
  if (accountIndex === -1) {
    return res.status(404).json({ error: 'Account not found or access denied' });
  }
  const updatedAccount = {
    ...accounts[accountIndex],
    ...(name && { name }),
    ...(type && { type }),
    ...(balance !== undefined && { balance: parseFloat(balance) }),
  };
  accounts[accountIndex] = updatedAccount;
  res.json(updatedAccount);
};

exports.deleteAccount = (req, res) => {
  const userId = req.user.id;
  const accountIndex = accounts.findIndex(acc => acc.id === req.params.id && acc.userId === userId);
  if (accountIndex === -1) {
    return res.status(404).json({ error: 'Account not found or access denied' });
  }
  accounts.splice(accountIndex, 1);
  res.status(204).send();
};

const { v4: uuidv4 } = require('uuid');
const { transactions, accounts } = require('../db');

exports.createTransaction = async (req, res) => {
  const { accountId, amount, type, categoryId } = req.body;
  const userId = req.user.id;
  if (!accountId || !amount || !type) {
    return res.status(400).json({ error: 'Account ID, amount, and type are required' });
  }
  const account = accounts.find(acc => acc.id === accountId && acc.userId === userId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found or access denied' });
  }
  if (categoryId) {
    const category = categories.find(cat => cat.id === categoryId && cat.userId === userId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found or access denied' });
    }
  }
  const transaction = {
    id: uuidv4(),
    type,
    amount: parseFloat(amount),
    date: new Date(),
    userId,
    accountId,
    categoryId: categoryId || null,
  };
  transactions.push(transaction);
  res.status(201).json(transaction);
};

exports.getAllTransactions = (req, res) => {
  const userId = req.user.id;
  const userTransactions = transactions.filter(tx => tx.userId === userId);
  res.json(userTransactions);
};

exports.getTransactionById = (req, res) => {
  const userId = req.user.id;
  const transaction = transactions.find(tx => tx.id === req.params.id && tx.userId === userId);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found or access denied' });
  }
  res.json(transaction);
};

exports.updateTransaction = async (req, res) => {
  const { amount, type, accountId, categoryId } = req.body;
  const userId = req.user.id;
  const transactionIndex = transactions.findIndex(tx => tx.id === req.params.id && tx.userId === userId);
  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found or access denied' });
  }
  const transaction = transactions[transactionIndex];
  if (accountId) {
    const account = accounts.find(acc => acc.id === accountId && acc.userId === userId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found or access denied' });
    }
  }
  if (categoryId) {
    const category = categories.find(cat => cat.id === categoryId && cat.userId === userId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found or access denied' });
    }
  }
  const updatedTransaction = {
    ...transaction,
    ...(accountId && { accountId }),
    ...(categoryId && { categoryId }),
    ...(amount !== undefined && { amount: parseFloat(amount) }),
    ...(type && { type }),
  };
  transactions[transactionIndex] = updatedTransaction;
  res.json(updatedTransaction);
};

exports.deleteTransaction = (req, res) => {
  const userId = req.user.id;
  const transactionIndex = transactions.findIndex(tx => tx.id === req.params.id && tx.userId === userId);
  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found or access denied' });
  }
  transactions.splice(transactionIndex, 1);
  res.status(204).send();
};

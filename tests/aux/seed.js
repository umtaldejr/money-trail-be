const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { users, accounts, categories, transactions } = require('../../db');

const USER_CREDENTIALS = {
  email: 'test1@example.com',
  password: 'password123',
};

const seedUsers = async () => {
  const usersArray = [
    {
      id: uuidv4(),
      email: USER_CREDENTIALS.email,
      password: await bcrypt.hash(USER_CREDENTIALS.password, 10)
    },
    {
      id: uuidv4(),
      email: 'test2@example.com',
      password: await bcrypt.hash('password456', 10)
    },
    {
      id: uuidv4(),
      email: 'test3@example.com',
      password: await bcrypt.hash('password789', 10)
    }
  ];

  users.push(...usersArray);
  return usersArray;
};

const seedAccounts = () => {
  const accountsArray = [
    {
      id: uuidv4(),
      userId: users[0].id,
      name: 'Main Account',
      type: 'savings',
      balance: 1000
    },
    {
      id: uuidv4(),
      userId: users[0].id,
      name: 'Emergency Fund',
      type: 'savings',
      balance: 3000
    },
    {
      id: uuidv4(),
      userId: users[1].id,
      name: 'Secondary Account',
      type: 'checking',
      balance: 500
    }
  ];

  accounts.push(...accountsArray);
  return accountsArray;
};

const seedCategories = () => {
  const categoryArray = [
    { id: uuidv4(), name: 'Food', userId: users[0].id, parentId: null },
    { id: uuidv4(), name: 'Groceries', userId: users[0].id, parentId: null },
    { id: uuidv4(), name: 'Food', userId: users[1].id, parentId: null },
    { id: uuidv4(), name: 'Groceries', userId: users[1].id, parentId: null },
  ];

  categories.push(...categoryArray);
  return categoryArray;
};

const seedTransactions = () => {
  const transactionsArray = [
    {
      id: uuidv4(),
      accountId: accounts[0].id,
      amount: 100,
      type: 'deposit',
      userId: accounts[0].userId,
      date: new Date()
    },
    {
      id: uuidv4(),
      accountId: accounts[1].id,
      amount: 200,
      type: 'withdrawal',
      userId: accounts[1].userId,
      date: new Date()
    },
    {
      id: uuidv4(),
      accountId: accounts[2].id,
      amount: 300,
      type: 'deposit',
      userId: accounts[2].userId,
      date: new Date()
    }
  ];

  transactions.push(...transactionsArray);
  return transactionsArray;
};

module.exports = { seedUsers, seedAccounts, seedCategories, seedTransactions, USER_CREDENTIALS };

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { users, accounts } = require('../../db');

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

module.exports = { seedUsers, seedAccounts, USER_CREDENTIALS };

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { users } = require('../../db');

const seedUsers = async () => {
  const usersArray = [
    {
      id: uuidv4(),
      email: 'test1@example.com',
      password: await bcrypt.hash('password123', 10)
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

module.exports = { seedUsers };

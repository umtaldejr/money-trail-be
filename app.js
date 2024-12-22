const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

module.exports = app;

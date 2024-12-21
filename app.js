const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/users', usersRoutes);

module.exports = app;

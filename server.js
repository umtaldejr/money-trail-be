const app = require('./app')

const port = process.env.PORT || 3000;

const server = app.listen(port)
  .on('listening', () => {
    console.log(`Server is running on http://localhost:${port}`);
  })
  .on('error', (err) => {
    console.error('Error occurred:', err);
  })
  .on('close', () => {
    console.log('Server closed');
  });

module.exports = server;

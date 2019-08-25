// Connnect all endpoints here

module.exports = function (app, router) {
  app.use('/api/users', require('./users.js'));
  app.use('/api/users/:name', require('./user.js'));
  app.use('/api/messages', require('./messages.js'));
}

const app = require('./app');
const config = require('./config');
const port = parseInt(config.server.port, 10);

app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});

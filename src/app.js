const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
// Services
const UserServices = require('./services/UserServices');
const CoinsServices = require('./services/CoinsServices');

class App {
  app;
  constructor() {
    this.app = express();
    this.config();
    this.addServices();
    this.mongoSetup();
  }

  config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  mongoSetup() {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.mongoDataBase.URL, config.mongoDataBase.options);
  }

  addServices() {
    UserServices.routes(this.app);
    CoinsServices.routes(this.app);
  }
}

module.exports = new App().app;

const JWT = require('jsonwebtoken');
const User = require('../models/UserModel');
const HttpCode = require('./HttpCodes');
const config = require('../config');

const authentication = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = JWT.verify(token, config.auth.token_key);
    const user = await User.findOne({ _id: data._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res
      .status(HttpCode.UNAUTHORIZED)
      .json({ error: 'Not authorized to access this resource' });
  }
};

module.exports = authentication;

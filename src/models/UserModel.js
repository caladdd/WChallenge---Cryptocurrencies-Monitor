const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const config = require('../config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please add a name'],
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
    unique: [true, 'User name already exists'],
    require: [true, 'Please add userName'],
  },
  password: {
    type: String,
    minLength: [8, 'Please provide a longer password (min 8 characters)'],
  },
  favoriteCoin: {
    type: String,
  },
  coins: {
    type: Array,
  },
  status: { type: String, default: true },
  tokens: [{ token: { type: String, required: true } }],
});

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = JWT.sign({ _id: user._id }, config.auth.token_key, {
    expiresIn: '1h',
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

/**
 * Remove token from database
 * @param token
 * @returns {Promise<void|Promise|*>}
 */
userSchema.methods.removeAuthToken = async function (token) {
  // Remove an auth token for the user
  const user = this;
  user.tokens = user.tokens.filter((t) => t.token !== token);
  return user.save();
};

/**
 * Check if password match with database password
 * @param password
 * @returns {Promise<Promise|any>}
 */
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password).then((res) => {
    return Promise.resolve(res);
  });
};

module.exports = mongoose.model('User', userSchema);

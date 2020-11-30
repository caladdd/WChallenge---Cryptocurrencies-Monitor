const dotenv = require('dotenv');
dotenv.config();

const config = {
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
    protocol: 'http',
  },
  mongoDataBase: {
    URL: process.env.MONGO_URL,
    options: {
      poolSize: 5,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  },
  auth: {
    token_key: process.env.TOKEN_KEY,
  },
};

module.exports = config;

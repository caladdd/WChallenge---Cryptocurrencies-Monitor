// Controller
const CoinsController = require('../controllers/CoinsController');
// Helpers
const ResponseOperation = require('../helpers/ResponseOperation');
const HttpCode = require('../helpers/HttpCodes');
const authentication = require('../helpers/AuthenticationFunction');

class CoinsServices {
  static routes(app) {
    app.get('/api/coins', authentication, (req, res) => {
      try {
        this.getCoins(req, res);
      } catch (e) {
        return this.response(
          res,
          new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
            msf: 'Incorrect params',
          })
        );
      }
    });

    app.post('/api/addcoin', authentication, (req, res) => {
      try {
        this.addCoin(req, res);
      } catch (e) {
        return this.response(
          res,
          new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
            msf: 'Incorrect params',
          })
        );
      }
    });

    app.get('/api/topcoins', authentication, (req, res) => {
      try {
        this.topCoins(req, res);
      } catch (e) {
        return this.response(
          res,
          new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
            msf: 'Incorrect params',
          })
        );
      }
    });
  }

  static getCoins(req, res) {
    const controller = new CoinsController();
    const {
      query: { limit = 10, page = 1 },
      user: { favoriteCoin },
    } = req;
    controller
      .listCoins(limit, page, favoriteCoin)
      .then((result) => this.response(res, result))
      .catch((result) => this.response(res, result));
  }

  static addCoin(req, res) {
    const controller = new CoinsController();

    const {
      user: { _id: userId },
      body: { coinId },
    } = req;
    controller
      .addCoin(userId, coinId)
      .then((result) => this.response(res, result))
      .catch((result) => this.response(res, result));
  }

  static topCoins(req, res) {
    const controller = new CoinsController();

    const {
      user: { _id: userId },
    } = req;
    controller
      .topCoins(userId)
      .then((result) => this.response(res, result))
      .catch((result) => this.response(res, result));
  }

  static response(res, result) {
    res.status(result.statusCode).json(result);
  }
}

module.exports = CoinsServices;

// Controller
const UserController = require('../controllers/UserController');
// Helpers
const ResponseOperation = require('../helpers/ResponseOperation');
const HttpCode = require('../helpers/HttpCodes');
const authentication = require('../helpers/AuthenticationFunction');

class UserServices {
  static routes(app) {
    app.post('/api/signup', (req, res) => {
      try {
        this.create(req, res);
      } catch (e) {
        return this.response(
          res,
          new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
            msf: 'Incorrect params',
          })
        );
      }
    });

    app.post('/api/signin', (req, res) => {
      try {
        this.signin(req, res);
      } catch (e) {
        return this.response(
          res,
          new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
            msf: 'Incorrect params',
          })
        );
      }
    });

    app.put('/api/signout', authentication, (req, res) => {
      try {
        this.signout(req, res);
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

  static create(req, res) {
    const controller = new UserController();
    const userData = {
      name: req.body.name,
      lastName: req.body.lastName,
      userName: req.body.userName,
      password: req.body.password,
      favoriteCoin: req.body.favoriteCoin,
    };
    controller
      .createUser(userData)
      .then((result) => this.response(res, result))
      .catch((result) => this.response(res, result));
  }

  static signin(req, res) {
    const controller = new UserController();

    const userData = {
      userName: req.body.userName,
      password: req.body.password,
    };
    controller
      .signIn(userData)
      .then((result) => this.response(res, result))
      .catch((result) => this.response(res, result));
  }

  static signout(req, res) {
    const controller = new UserController();

    const userData = {
      userName: req.user.userName,
    };
    controller
      .signOut(userData, req.token)
      .then((result) => this.response(res, result))
      .catch((result) => this.response(res, result));
  }

  static response(res, result) {
    res.status(result.statusCode).json(result);
  }
}

module.exports = UserServices;

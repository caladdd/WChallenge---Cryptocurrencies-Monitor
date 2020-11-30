// Models
const User = require('../models/UserModel');
// Helpers
const ResponseOperation = require('../helpers/ResponseOperation');
const HttpCode = require('../helpers/HttpCodes');

class userController {
  /**
   * Return success if userName does not exist in the Database
   * @param userData all data necessary to create an user
   * @returns {Promise<ResponseOperation>}
   */
  async createUser(userData) {
    const recordedUser = new User(userData);
    return recordedUser
      .save()
      .then(async (newUser) => {
        const token = await recordedUser.generateAuthToken();
        newUser.password = undefined;
        return Promise.resolve(
          new ResponseOperation(true, HttpCode.CREATED, [newUser, token])
        );
      })
      .catch((err) => {
        return Promise.reject(
          new ResponseOperation(false, HttpCode.INTERNAL_ERROR, null, err)
        );
      });
  }

  /**
   * Check if the password math with password of UserName, and create a token and save it in the database
   * @param user data necessary for login (userName, password)
   * @returns {Promise<T>}
   */
  async signIn(user) {
    return User.find({ userName: user.userName })
      .exec()
      .then(async (oldUsers) => {
        if (oldUsers.length === 0) {
          return Promise.reject(
            new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
              msg: 'The userName is not registered.',
            })
          );
        }
        const oldUser = oldUsers[0];
        return oldUser.validatePassword(user.password).then(async (valid) => {
          if (valid) {
            const token = await oldUser.generateAuthToken();
            oldUser.password = undefined;
            return Promise.resolve(
              new ResponseOperation(true, HttpCode.OK, [oldUser, token])
            );
          } else {
            return Promise.reject(
              new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
                msg: 'Incorrect Password',
              })
            );
          }
        });
      })
      .catch((err) => {
        return Promise.reject(
          new ResponseOperation(false, HttpCode.BAD_REQUEST, null, err)
        );
      });
  }

    /**
     * Remove token from database and remove permission in services that need it
     * @param user information of user that is login
     * @param token
     * @returns {Promise<T>}
     */
  async signOut(user, token) {
    return User.find({ userName: user.userName })
      .exec()
      .then(async (oldUsers) => {
        if (oldUsers.length === 0) {
          return Promise.reject(
            new ResponseOperation(false, HttpCode.BAD_REQUEST, null, {
              msg: 'The email is not registered.',
            })
          );
        }
        const oldUser = oldUsers[0];
        return oldUser.removeAuthToken(token).then(() => {
          return Promise.resolve(
            new ResponseOperation(true, HttpCode.OK, oldUser)
          );
        });
      })
      .catch((error) => {
        return Promise.reject(
          new ResponseOperation(false, HttpCode.INTERNAL_ERROR, null, error)
        );
      });
  }
}

module.exports = userController;

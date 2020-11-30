const axios = require('axios');
// Models
const User = require('../models/UserModel');
// Helpers
const ResponseOperation = require('../helpers/ResponseOperation');
const HttpCode = require('../helpers/HttpCodes');
const constants = require('../helpers/constants');

class CoinsController {
    /**
     * Return a list of coins from coingecko
     * @param limit maximum number of coins returned in the list
     * @param page number of page
     * @param favoriteCoin favorite coin of the user that is login
     * @returns {Promise<ResponseOperation>}
     */
  async listCoins(limit, page, favoriteCoin) {
    const requestCoinList = {
      method: 'GET',
      url: constants.coinsUrl.getCoinsList,
    };
    const coins = await axiosRequest(requestCoinList);
    const coinsLength = coins.length;
    return Promise.all(
      coins.slice((page - 1) * limit, page * limit).map(async (coin) => {
        const { id } = coin;
        const requestCoin = {
          method: 'GET',
          url: `${constants.coinsUrl.getCoinDetail}${id}`,
        };
        const coinData = await axiosRequest(requestCoin);
        const {
          symbol,
          name,
          image: { large: image },
          market_data: { current_price: price, last_updated: lastUpdate },
        } = coinData;
        return {
          symbol,
          name,
          currentPrice: price[favoriteCoin],
          image,
          lastUpdate,
        };
      })
    )
      .then((allCoins) => {
        return Promise.resolve(
          new ResponseOperation(true, HttpCode.CREATED, {
            pages: Math.ceil(coinsLength / limit),
            coins: allCoins,
          })
        );
      })
      .catch((err) => {
        return Promise.reject(
          new ResponseOperation(false, HttpCode.BAD_GATEWAY, null, err)
        );
      });
  }

    /**
     * Add a coin into a list for an user
     * @param userId id of the user
     * @param coinId coin id, this id is took from the coin list
     * @returns {Promise<T>}
     */
  async addCoin(userId, coinId) {
    const requestCoinList = {
      method: 'GET',
      url: constants.coinsUrl.getCoinsList,
    };
    const coins = await axiosRequest(requestCoinList);
    const coinsLength = coins.filter(function (e) {
      return e.id === coinId;
    });
    if (coinsLength.length !== 1) {
      return Promise.reject(
        new ResponseOperation(
          false,
          HttpCode.INTERNAL_ERROR,
          null,
          'Coin id does not exists'
        )
      );
    }
    return User.updateOne({ _id: userId }, { $addToSet: { coins: [coinId] } })
      .then((userUpdated) => {
        return Promise.resolve(
          new ResponseOperation(true, HttpCode.OK, userUpdated)
        );
      })
      .catch((err) => {
        return Promise.reject(
          new ResponseOperation(false, HttpCode.INTERNAL_ERROR, null, err)
        );
      });
  }

    /**
     * Return a list with the top coins of an user
     * @param userId
     * @returns {Promise<undefined|T>}
     */
  async topCoins(userId) {
    let fCoin;
    return User.find({ _id: userId })
      .then((user) => {
        const { coins, favoriteCoin } = user[0];
        fCoin = favoriteCoin;
        return Promise.all(
          coins.map(async (coin) => {
            const requestCoin = {
              method: 'GET',
              url: `${constants.coinsUrl.getCoinDetail}${coin}`,
            };
            const coinData = await axiosRequest(requestCoin);
            const {
              symbol,
              name,
              image: { large: image },
              market_data: {
                current_price: { usd, eur, ars },
                last_updated: lastUpdate,
              },
            } = coinData;
            return {
              symbol,
              name,
              ars,
              usd,
              eur,
              image,
              lastUpdate,
            };
          })
        );
      })
      .then((myTopCoins) => {
        myTopCoins.sort((a, b) => a[fCoin] - b[fCoin]);
        return Promise.resolve(
          new ResponseOperation(true, HttpCode.OK, myTopCoins)
        );
      })
      .catch((err) => {
        return Promise.reject(
          new ResponseOperation(false, HttpCode.INTERNAL_ERROR, null, err)
        );
      });
  }
}

async function axiosRequest(request) {
  const result = await axios({
    ...request,
  });
  return result.data;
}

module.exports = CoinsController;

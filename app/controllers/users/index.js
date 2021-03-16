/* eslint-disable no-console */
import UserServices from '../../services/user/index';
import { constants, Helper, ChainGateway } from '../../utils';
import dx from '../../utils/api';

const {
  CREATE_USER_SUCCESSFULLY,
  LOGIN_USER_SUCCESSFULLY,
  CREATE_WALLET_SUCCESSFULLY,
} = constants;
const { successResponse } = Helper;

const apikey = process.env.CHNAGE_GATEWAY_API_KEY;

/**
 *  Contains several methods to manage user controllers
 *  @class UserControllers
 */
class UserControllers {
  /**
     * Create user controller.
     * @memberof UserControllers
     * @param { req, res, next } req - The username of the user.
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async createUser(req, res, next) {
    try {
      const data = await UserServices.createUser(req.body);
      successResponse(res, { data, message: CREATE_USER_SUCCESSFULLY, code: 201 });
    } catch (error) {
      logger.error(error, 'ERROR');
      next(error);
    }
  }

  /**
     * Login controller.
     * @memberof UserControllers
     * @param { req, res, next } req - The username of the user.
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async loginUser(req, res, next) {
    try {
      const data = await UserServices.loginUser(req.body);
      successResponse(res, { data, message: LOGIN_USER_SUCCESSFULLY });
    } catch (error) {
      logger.error(error, 'ERROR');
      next(error);
    }
  }

  /**
     * Create wallet password
     * Login controller.
     * @memberof UserControllers
     * @param { req, res, next } req - The username of the user.
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async createWalletAddress(req, res, next) {
    try {
      const password = Helper.generateVerificationToken();
      const token = req.headers.authorization;
      const { id } = Helper.verifyToken(token, process.env.CRYPTO_SECRET);
      await UserServices.saveEthPassword(password, id);
      const data = await ChainGateway.createEthWalletAddress(password, apikey);
      await UserServices.saveWalletAddress(id, 'eth', data.ethereumaddress);
      successResponse(res, { data, message: CREATE_WALLET_SUCCESSFULLY, code: 201 });
    } catch (error) {
      logger.error(error, 'ERROR');
      next(error);
    }
  }

  /**
     * Login controller.
     * @memberof UserControllers
     * @param { req, res, next } req - The username of the user.
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async getBal(req, res) {
    try {
      const data = await dx.makeRequest('/getEthereumBalance', {
        ethereumaddress: '0x9993e504cb62541361c7798575d33fd24cfbf618'
      }, 'POST');
      res.json(data);
    } catch (error) {
      console.log(error.response);
      console.log(error);
    }
  }

  /**
     * Login controller.
     * @memberof UserControllers
     * @param { req, res, next } req - The username of the user.
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async sendEth(req, res) {
    try {
      const data = await dx.makeRequest('/sendEthereum', req.body, 'POST');
      res.json(data);
    } catch (error) {
      console.log(error.response);
      console.log(error);
    }
  }
}

export default UserControllers;

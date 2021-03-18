import { constants, Helper, Request, DBError, ApiError } from '../../utils';
import UserServices from '../../services/user';

const { BALANCE_PARAM, CREATE_WALLET_SUCCESSFULLY,
  TX_HISTORY_PARAM, BALANCE_FETCHED, GET_BALANCE_ERROR,
  GET_BALANCE_ERROR_MSG, CREATE_ETH_ADDRESS_ERROR,
  CREATE_ETH_ADDRESS_ERROR_MSG, NEW_ADDRESS, SEND_ETHER, TX_SUCCESS,
  ETH_TRANSFER_ERROR, ETH_TRANSFER_ERROR_MSG, TX_HISTORY_FETCHED,
  TX_HISTORY_ERROR, TX_HISTORY_ERROR_MSG, DOLLAR_RATE_PARAM } = constants;
const { successResponse, moduleErrLogMessager, errorResponse } = Helper;

/**
 *  Contains several methods to manage user controllers
 *  @class WalletController
 */
class WalletController {
  /**
     * Get user wallet balance
     * @memberof WalletController
     * @param { req, res, next } req - The username of the user.
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async getBalance(req, res, next) {
    try {
      BALANCE_PARAM.address = req.wallet.address;
      const [{ result }, { result: { ethusd } }] = await Promise.all(
        [Request.makeEtherScanRequest(BALANCE_PARAM),
          Request.makeEtherScanRequest(DOLLAR_RATE_PARAM)]
      );
      successResponse(res, {
        message: BALANCE_FETCHED,
        data: {
          balance: result / 1e18,
          balanceInDollars: (result / 1e18) * ethusd,
          ethPrice: ethusd
        },
      });
    } catch (error) {
      const dbError = new DBError({
        status: GET_BALANCE_ERROR,
        message: error.message,
      });
      moduleErrLogMessager(dbError);
      next(new ApiError({ message: GET_BALANCE_ERROR_MSG }));
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
  static async createWallet(req, res, next) {
    try {
      const password = Helper.generateVerificationToken();
      const data = await Request.makeChainGateRequest(NEW_ADDRESS, {
        password,
      });
      await Promise.all([
        UserServices.saveEthPassword(password, req.data.id),
        UserServices.saveWalletAddress(
          req.data.id,
          'eth',
          data.ethereumaddress
        ),
      ]);
      successResponse(res, {
        message: CREATE_WALLET_SUCCESSFULLY,
        code: 201,
      });
    } catch (e) {
      e.status = CREATE_ETH_ADDRESS_ERROR;
      moduleErrLogMessager(e);
      const apiError = new ApiError({
        status: 500,
        message: CREATE_ETH_ADDRESS_ERROR_MSG,
      });
      next(apiError);
    }
  }

  /**
     * Sends eth
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof WalletMiddleware
     *
     */
  static async sendEth(req, res, next) {
    try {
      const transferObj = {
        ...req.body,
        from: req.wallet.address,
        password: req.user.eth_address_password,
        amount: Number(req.body.amount),
      };
      const { ok, ...data } = await Request.makeChainGateRequest(
        SEND_ETHER,
        transferObj
      );
      return ok === true
        ? successResponse(res, { message: TX_SUCCESS, data })
        : errorResponse(res, res, new ApiError({
          status: 400,
          message: data.description,
        }));
    } catch (e) {
      e.status = ETH_TRANSFER_ERROR;
      moduleErrLogMessager(e);
      const apiError = new ApiError({
        status: 500,
        message: ETH_TRANSFER_ERROR_MSG,
      });
      next(apiError);
    }
  }

  /**
     * Sends eth
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof WalletMiddleware
     *
     */
  static async getEthTx(req, res, next) {
    try {
      TX_HISTORY_PARAM.address = req.wallet.address;
      const [{ result }, { result: { ethusd } }] = await Promise.all(
        [Request.makeEtherScanRequest(TX_HISTORY_PARAM),
          Request.makeEtherScanRequest(DOLLAR_RATE_PARAM)]
      );
      successResponse(res, {
        message: TX_HISTORY_FETCHED, data: Request.formatEth(result, ethusd) });
    } catch (e) {
      e.status = TX_HISTORY_ERROR;
      moduleErrLogMessager(e);
      const apiError = new ApiError({
        status: 500,
        message: TX_HISTORY_ERROR_MSG,
      });
      next(apiError);
    }
  }
}

export default WalletController;

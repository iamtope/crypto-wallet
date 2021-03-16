import WalletService from '../../services/wallet';
import { ApiError, Helper, constants, Request } from '../../utils';
import { txSchema } from '../../validations/tx';

const { fetchUserWallet } = WalletService;
const { errorResponse, moduleErrLogMessager } = Helper;
const { BALANCE_PARAM, TX_VALIDATION_ERROR, NO_WALLET,
  WALLET_VALIDATION_ERROR, WALLET_VALIDATION_ERROR_MSG, WALLET_CREATED_ALREADY,
  LOW_FUND, BALANCE_VALIDATION_ERROR } = constants;

/**
 *  Contains several methods to manage wallet middleware
 *  @class WalletMiddleware
 */
export default class WalletMiddleware {
  /**
     * Validates presence of wallet
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof WalletMiddleware
     *
     */
  static async checkIfUserHasWallet(req, res, next) {
    try {
      const data = await fetchUserWallet(req.data.id);
      req.wallet = data;
      return data ? next() : errorResponse(
        req,
        res,
        new ApiError({
          status: 404,
          message: NO_WALLET
        })
      );
    } catch (e) {
      e.status = WALLET_VALIDATION_ERROR;
      moduleErrLogMessager(e);
      const apiError = new ApiError({
        status: 500,
        message: WALLET_VALIDATION_ERROR_MSG
      });
      errorResponse(req, res, apiError);
    }
  }

  /**
     * Validates presence of wallet
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof WalletMiddleware
     *
     */
  static async checkIfNoWallet(req, res, next) {
    try {
      const data = await fetchUserWallet(req.data.id);
      return data ? errorResponse(
        req,
        res,
        new ApiError({
          status: 409,
          message: WALLET_CREATED_ALREADY
        })
      ) : next();
    } catch (e) {
      e.status = WALLET_VALIDATION_ERROR;
      moduleErrLogMessager(e);
      const apiError = new ApiError({
        status: 500,
        message: WALLET_VALIDATION_ERROR_MSG
      });
      errorResponse(req, res, apiError);
    }
  }

  /**
     * Validates presence of enough eth
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof WalletMiddleware
     *
     */
  static async checkIfHasEnoughBalance(req, res, next) {
    try {
      BALANCE_PARAM.address = req.wallet.address;
      const { result } = await Request.makeEtherScanRequest(BALANCE_PARAM);
      return result / 1e18 >= req.body.amount ? next() : errorResponse(
        req,
        res,
        new ApiError({
          status: 403,
          message: LOW_FUND
        })
      );
    } catch (e) {
      e.status = BALANCE_VALIDATION_ERROR;
      moduleErrLogMessager(e);
      const apiError = new ApiError({
        status: 500,
        message: WALLET_VALIDATION_ERROR_MSG
      });
      errorResponse(req, res, apiError);
    }
  }

  /**
   * Validates user's pin credentials, with emphasis on the
   * existence of a pin
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof WalletMiddleware
   *
   */
  static async txValidator(req, res, next) {
    try {
      await txSchema.validateAsync(req.body);
      next();
    } catch (e) {
      e.status = TX_VALIDATION_ERROR;
      moduleErrLogMessager(e);
      errorResponse(
        req,
        res,
        new ApiError({ message: e.details[0].message.replace(
          /[\]["]/gi,
          ''
        ),
        status: 400 })
      );
    }
  }
}

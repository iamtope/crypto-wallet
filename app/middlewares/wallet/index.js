import WalletService from '../../services/wallet';
import {
  ApiError, Helper, constants, Request, BitcoinHelpers
} from '../../utils';
import { btcSchema, txSchema } from '../../validations/tx';

const { fetchEthUserWallet, fetchBtcUserWallet } = WalletService;
const { errorResponse, moduleErrLogMessager } = Helper;
const { BALANCE_PARAM, TX_VALIDATION_ERROR, NO_WALLET,
  WALLET_VALIDATION_ERROR, WALLET_VALIDATION_ERROR_MSG, WALLET_CREATED_ALREADY,
  LOW_FUND, BALANCE_VALIDATION_ERROR } = constants;
const { getNewTxInput, getTransactionFee } = BitcoinHelpers;
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
      const data = await fetchEthUserWallet(req.data.id);
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
      const data = await fetchEthUserWallet(req.data.id);
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
        new ApiError({
          message: e.details[0].message.replace(
            /[\]["]/gi,
            ''
          ),
          status: 400
        })
      );
    }
  }

  /**
    * Validates presence of btc wallet
    * @static
    * @param { Object } req - The request from the endpoint.
    * @param { Object } res - The response returned by the method.
    * @param { function } next - Calls the next handle.
    * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
    * @memberof WalletMiddleware
    *
    */
  static async checkIfUserHasBtcWallet(req, res, next) {
    try {
      const data = await fetchBtcUserWallet(req.data.id);
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
  static async checkIfNoBtcWallet(req, res, next) {
    try {
      const data = await fetchBtcUserWallet(req.data.id);
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
  static async btcValidator(req, res, next) {
    try {
      await btcSchema.validateAsync(req.body);
      next();
    } catch (e) {
      e.status = TX_VALIDATION_ERROR;
      moduleErrLogMessager(e);
      errorResponse(
        req,
        res,
        new ApiError({
          message: e.details[0].message.replace(
            /[\]["]/gi,
            ''
          ),
          status: 400
        })
      );
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
  static async checkIFUserHasEnoughBtc(req, res, next) {
    try {
      const { amount } = req.body;
      const satoshiToSend = amount * 100000000;
      /* we are going to use 2 as the output count because we're only sending the bitcoin to
      two addresses the receiver's address and our change address.
      */
      const outPutCount = 2;
      const newInput = await getNewTxInput(req.wallet.address);
      req.newInput = newInput;
      const {
        totalAmountAvailable, inputCount
      } = newInput;
      const fee = getTransactionFee(inputCount, outPutCount);
      req.fee = fee;
      if (totalAmountAvailable - satoshiToSend - fee < 0) {
        const error = new ApiError({
          status: 403,
          message: LOW_FUND
        });
        logger.error(error, 'ERROR');
        throw error;
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

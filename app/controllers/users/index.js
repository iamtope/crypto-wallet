import UserServices from '../../services/user';
import { constants, Helper, ApiError } from '../../utils';

const {
  CREATE_USER_SUCCESSFULLY,
  LOGIN_USER_SUCCESSFULLY,
  PIN_UPDATE_SUCCESS,
  CREATE_PIN_ERROR,
  CREATE_PIN_ERROR_MSG
} = constants;
const { successResponse, moduleErrLogMessager } = Helper;

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
  static async createTxPin(req, res, next) {
    try {
      await UserServices.updateTxPin(req.body.pin, req.data.id);
      successResponse(res, { message: PIN_UPDATE_SUCCESS });
    } catch (e) {
      e.status = CREATE_PIN_ERROR;
      moduleErrLogMessager(e);
      const apiError = new ApiError({
        status: 500,
        message: CREATE_PIN_ERROR_MSG,
      });
      next(apiError);
    }
  }
}

export default UserControllers;

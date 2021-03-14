import UserServices from '../../services/user/index';
import { constants, Helper } from '../../utils';

const {
  CREATE_USER_SUCCESSFULLY, LOGIN_USER_SUCCESSFULLY
} = constants;
const { successResponse } = Helper;

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
}

export default UserControllers;

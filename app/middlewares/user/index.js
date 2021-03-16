import UserServices from '../../services/user/index';
import { genericErrors, ApiError, constants, Helper } from '../../utils';
import { loginSchema, userSchema } from '../../validations/generic.validation';
import { walletPinSchema } from '../../validations/tx';

const {
  EMAIL_CONFLICT, USERNAME_ERROR, INVALID_CREDENTIALS,
  PHONE_ERROR, USER_PIN_VALIDATION_ERROR, INVALID_PIN,
  USER_PIN_VALIDATION_ERROR_MSG
} = constants;

const { errorResponse, moduleErrLogMessager } = Helper;

/**
 *  Contains several methods to manage user middlewares
 *  @class UserMiddlewares
 */
class UserMiddlewares {
  /**
     * Checks if email or username exist.
     * @memberof UserMiddlewares
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async checkIfUserExist(req, res, next) {
    try {
      const { email, username, phone_number } = req.body;
      const userByEmail = await UserServices.fetchUserByEmail(email);
      if (userByEmail) {
        const error = new ApiError({
          status: 409,
          message: EMAIL_CONFLICT,
        });
        logger.error(error, 'ERROR');
        throw error;
      }
      const userByUsername = await UserServices.fetchUserByUsername(username);
      if (userByUsername) {
        const error = new ApiError({
          status: 409,
          message: USERNAME_ERROR,
        });
        logger.error(error, 'ERROR');
        throw error;
      }
      const userByPhone = await UserServices.fetchUserByPhone(phone_number);
      if (userByPhone) {
        const error = new ApiError({
          status: 409,
          message: PHONE_ERROR,
        });
        logger.error(error, 'ERROR');
        throw error;
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  /**
     * validate sign up schema.
     * @memberof UserMiddlewares
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async signupSchema(req, res, next) {
    try {
      await userSchema.validateAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        message: error.details[0].message.replace(
          /[\]["]/gi,
          ''
        ),
      });
    }
  }

  /**
     * Checks if email or username exist.
     * @memberof UserMiddlewares
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async checkLoginDetails(req, res, next) {
    try {
      const { login_details, password } = req.body;
      const user = await UserServices.fetchUserByEmailOrUsername(login_details);
      if (!user) {
        const error = new ApiError({
          status: 404,
          message: INVALID_CREDENTIALS,
        });
        logger.error(error, 'ERROR');
        throw error;
      }
      if (!Helper.comparePassword(password, user.password)) {
        const error = genericErrors.inValidLogin;
        logger.error(error, 'ERROR');
        throw error;
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  /**
     * validate login up schema.
     * @memberof UserMiddlewares
     * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
     * with a user resource  or a DB Error.
     */
  static async loginSchema(req, res, next) {
    try {
      await loginSchema.validateAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        message: error.details[0].message.replace(
          /[\]["]/gi,
          ''
        ),
      });
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
   * @memberof UserMiddlewares
   *
   */
  static async pinUpdateValidator(req, res, next) {
    try {
      await walletPinSchema.validateAsync(req.body);
      next();
    } catch (e) {
      e.status = USER_PIN_VALIDATION_ERROR;
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

  /**
   * Validates user's pin credentials, with emphasis on the
   * correctness of a pin
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof UserMiddlewares
   *
   */
  static async checkIfCorrectPin(req, res, next) {
    try {
      const {
        transaction_pin, transaction_salt, ...user
      } = await UserServices.fetchUserByEmailOrUsername(
        req.data.email
      );
      req.user = user;
      if (!Helper.compareHash(req.body.pin, transaction_pin, transaction_salt)) {
        return errorResponse(
          req,
          res,
          new ApiError({ message: INVALID_PIN,
            status: 403 })
        );
      }
      next();
    } catch (e) {
      e.status = USER_PIN_VALIDATION_ERROR;
      moduleErrLogMessager(e);
      errorResponse(
        req,
        res,
        new ApiError({ message: USER_PIN_VALIDATION_ERROR_MSG,
          status: 500 })
      );
    }
  }
}

export default UserMiddlewares;

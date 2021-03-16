import { Helper, genericErrors } from '../../utils';

const { errorResponse, verifyToken, } = Helper;

/**
 * A collection of middleware methods used to verify the authenticity
 * of requests through protected routes.
 *
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * Checks for token in the authorization and x-access-token header properties.
   * @static
   * @private
   * @param {object} authorization - The headers object
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
   */
  static checkAuthorizationToken(authorization) {
    let bearerToken = null;
    if (authorization) {
      const token = authorization.split(' ')[1];
      bearerToken = token || authorization;
    }
    return bearerToken;
  }

  /**
   * Aggregates a search for the access token in a number of places.
   * @static
   * @private
   * @param {Request} req - The express request object.
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
   */
  static checkToken(req) {
    const {
      headers: { authorization }
    } = req;
    const bearerToken = AuthMiddleware.checkAuthorizationToken(authorization);
    return (
      bearerToken
      || req.headers['x-access-token']
      || req.headers.token
      || req.body.token
    );
  }

  /**
   * Verifies the validity of a user's access token or and the presence of it.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   *
   */
  static authenticate(req, res, next) {
    const token = AuthMiddleware.checkToken(req);
    if (!token) {
      return errorResponse(req, res, genericErrors.authRequired);
    }
    try {
      const decoded = verifyToken(token);
      req.data = decoded;
      next();
    } catch (err) {
      errorResponse(req, res, genericErrors.authRequired);
    }
  }
}

export default AuthMiddleware;

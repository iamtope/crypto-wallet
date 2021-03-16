import queries from '../../db/queries/users';
import Db from '../../db';
import { Helper } from '../../utils';

const {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserByPhone,
  findUserByEmailOrUsername,
  saveUserEthPassword,
  saveWalletAddress
} = queries;
/**
 *  Contains several methods to manage user resorces
 *  @class UserServices
 */
class UserServices {
  /**
   * Fetches a User by his/her email.
   * @memberof UserService
   * @param { String } email - The email address of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async fetchUserByEmail(email) {
    return Db.oneOrNone(findUserByEmail, [email]);
  }

  /**
  * Fetches a User by his/her email.
  * @memberof UserService
  * @param { String } username - The username of the user.
  * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
  * with a user resource  or a DB Error.
  */
  static async fetchUserByUsername(username) {
    return Db.oneOrNone(findUserByUsername, [username]);
  }

  /**
  * Fetches a User by his/her phone_no.
  * @memberof UserService
  * @param { String } phone_number - The username of the user.
  * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
  * with a user resource  or a DB Error.
  */
  static async fetchUserByPhone(phone_number) {
    return Db.oneOrNone(findUserByPhone, [phone_number]);
  }

  /**
   * Creates a User.
   * @memberof UserService
   * @param { Object } body - The body containing user info.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async createUser(body) {
    const {
      first_name, middle_name, last_name, username, email, phone_number,
      date_of_birth, country, city, state, password
    } = body;
    const hashPassword = Helper.hashPassword(password);
    const { hash, salt } = hashPassword;
    const payload = [
      first_name, middle_name, last_name, username, email, phone_number,
      date_of_birth, country, city, state, hash, salt
    ];
    const result = await Db.oneOrNone(createUser, payload);
    logger.info(result, 'SUCCESS');
    return result;
  }

  /**
  * Fetches a User by his/her email.
  * @memberof UserService
  * @param { String } login_details - The username of the user.
  * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
  * with a user resource  or a DB Error.
  */
  static async fetchUserByEmailOrUsername(login_details) {
    return Db.oneOrNone(findUserByEmailOrUsername, [login_details]);
  }

  /**
   * Login a User by his/her email or username.
   * @memberof UserService
   * @param { String } body - The username of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async loginUser(body) {
    const { login_details } = body;
    const result = await Db.oneOrNone(findUserByEmailOrUsername, [login_details]);
    const {
      id, first_name, middle_name, last_name, username, email,
      phone_no, date_of_birth, country, city, state
    } = result;
    const token = Helper.addTokenToUser(result);
    const data = {
      id,
      first_name,
      middle_name,
      last_name,
      email,
      username,
      phone_no,
      date_of_birth,
      country,
      city,
      state,
      token
    };
    logger.info(data, 'SUCCESS');
    return data;
  }

  /**
   * Saves a user eth wallet password
   * @memberof UserService
   * @param { String } password - The password of the user
   * @param { String } id - The id of the user
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async saveEthPassword(password, id) {
    return Db.none(saveUserEthPassword, [password, id]);
  }

  /**
   * Saves user wallet address
   * @memberof UserService
   * @param { String } user_id - The id of the user.
   * @param { String } coin - The type of coin.
   * @param { String } address - The address of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async saveWalletAddress(user_id, coin, address) {
    return Db.none(saveWalletAddress, [user_id, coin, address]);
  }
}

export default UserServices;

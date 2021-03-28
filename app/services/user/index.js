import queries from '../../db/queries/users';
import db from '../../db';
import { Helper } from '../../utils';

const {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserByPhone,
  findUserByEmailOrUsername,
  saveUserEthPassword,
  saveWalletAddress,
  addPinToUser,
  saveWalletKey
} = queries;
const { hashPassword, hashPIN } = Helper;

/**
 *  Contains several methods to manage user resources
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
    return db.oneOrNone(findUserByEmail, [email]);
  }

  /**
  * Fetches a User by his/her email.
  * @memberof UserService
  * @param { String } username - The username of the user.
  * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
  * with a user resource  or a DB Error.
  */
  static async fetchUserByUsername(username) {
    return db.oneOrNone(findUserByUsername, [username]);
  }

  /**
  * Fetches a User by his/her phone_no.
  * @memberof UserService
  * @param { String } phone_number - The username of the user.
  * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
  * with a user resource  or a DB Error.
  */
  static async fetchUserByPhone(phone_number) {
    return db.oneOrNone(findUserByPhone, [phone_number]);
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
      date_of_birth, address, password
    } = body;
    const { hash, salt } = hashPassword(password);
    const payload = [
      first_name, middle_name, last_name, username, email, phone_number,
      date_of_birth, address, hash, salt
    ];
    const result = await db.oneOrNone(createUser, payload);
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
    return db.oneOrNone(findUserByEmailOrUsername, [login_details]);
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
    const result = await db.oneOrNone(findUserByEmailOrUsername, [login_details]);
    const {
      id, first_name, middle_name, last_name, username, email,
      phone_no, date_of_birth, transaction_pin
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
      token,
      hasPin: !!transaction_pin
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
    return db.none(saveUserEthPassword, [password, id]);
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
    return db.oneOrNone(saveWalletAddress, [user_id, coin, address]);
  }

  /**
   * Saves user wallet address
   * @memberof UserService
   * @param { String } pin - The pin for tx
   * @param { String } userId - The id of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static updateTxPin(pin, userId) {
    const { hash, salt } = hashPIN(pin);
    return db.none(addPinToUser, [hash, salt, userId]);
  }

  /**
   * Saves user wallet key
   * @memberof UserService
   * @param { String } user_id - The id of the user.
   * @param { String } coin - The type of coin.
   * @param { String } address - The address of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async saveBtcWalletAddress(user_id, coin, address, private_key, public_key, passphrase) {
    const result = await this.saveWalletAddress(user_id, coin, address);
    return db.none(saveWalletKey, [result.id, private_key, public_key, passphrase]);
  }
}

export default UserServices;

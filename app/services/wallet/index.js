import db from '../../db';
import walletQueries from '../../db/queries/wallet';

const {
  fetchEthWalletAddress, fetchBtcWalletAddress
} = walletQueries;

/**
 * wallet services
 */
export default class WalletService {
  /**
   * Fetches a User Eth wallet details
   * @memberof WalletService
   * @param { String } userId - The userId of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async fetchEthUserWallet(userId) {
    return db.oneOrNone(fetchEthWalletAddress, [userId]);
  }

  /**
   * Fetches a User Btc wallet details
   * @memberof WalletService
   * @param { String } userId - The userId of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async fetchBtcUserWallet(userId) {
    return db.oneOrNone(fetchBtcWalletAddress, [userId]);
  }
}

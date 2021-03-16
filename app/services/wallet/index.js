import db from '../../db';
import walletQueries from '../../db/queries/wallet';

const { fetchWalletAddress } = walletQueries;

/**
 * wallet services
 */
export default class WalletService {
  /**
   * Fetches a User wallet details
   * @memberof WalletService
   * @param { String } userId - The userId of the user.
   * @returns { Promise< Object | Error | Null > } A promise that resolves or rejects
   * with a user resource  or a DB Error.
   */
  static async fetchUserWallet(userId) {
    return db.oneOrNone(fetchWalletAddress, [userId]);
  }
}

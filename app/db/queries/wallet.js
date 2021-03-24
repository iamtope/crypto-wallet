export default {
  fetchEthWalletAddress: 'SELECT * FROM wallet WHERE user_id = $1 AND coin =\'eth\'',
  fetchBtcWalletAddress: 'SELECT * FROM wallet WHERE user_id = $1 AND coin =\'btc\'',
};

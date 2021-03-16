import axios from 'axios';

const chainGatewayBaseUrl = 'https://eu.eth.chaingateway.io/v1';

/**
 *Contains methods for the chain gateway api
 *
 * @class ChainGateway
 */
class ChainGateway {
  /**
   * It generates an ethereum wallet address for user
   * @static
   * @memberof ChainGateway
   * @returns {String} - A unique string containing the user ethereum address
   */
  static async createEthWalletAddress(password, apikey) {
    const { data } = await axios.post(`${chainGatewayBaseUrl}/newAddress`, {
      password,
      apikey
    });
    return data;
  }
}

export default ChainGateway;

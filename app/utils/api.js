/* eslint-disable require-jsdoc */
import fetch from 'node-fetch';
import bluebird from 'bluebird';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import constants from './constants';
import db from '../db';
import queries from '../db/queries/api.key';

dayjs.extend(relativeTime);
fetch.Promise = bluebird;

const { updateCallsCount, getApiKeys } = queries;

const postOptions = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
};

const {
  CHAINGATE_BASEURL, ETHERSCAN_BASEURL, BITCOIN_NETWORK,
  SOCHAIN_BASEURL, BLOCKCHAIN_BASEURL
} = constants;

export default class Request {
  static async makeChainGateRequest(url, data = {}, method = 'POST') {
    const apiKeys = await db.manyOrNone(getApiKeys);
    let index = 0;
    postOptions.body = JSON.stringify(data);
    const currentKey = apiKeys[index];
    // eslint-disable-next-line no-console
    console.log(currentKey);
    postOptions.headers.Authorization = currentKey.api_key;
    postOptions.method = method;
    let res = await fetch(`${CHAINGATE_BASEURL}${url}`, postOptions);
    res = await res.json();
    if (res.status === 403) {
      postOptions.headers.Authorization = currentKey.api_key;
      postOptions.method = method;
      index += 1;
      return Request.makeChainGateRequest(url, data, method);
    }
    db.none(updateCallsCount, [+currentKey.no_of_calls + 1, currentKey.id]);
    return res;
  }

  static async makeEtherScanRequest(params) {
    const query = Object.keys(params)
      .map(
        (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
      )
      .join('&');
    let res = await fetch(`${ETHERSCAN_BASEURL}${query}`);
    res = await res.json();
    return res;
  }

  static formatEth(data, dollarRate) {
    return data.map((el) => (
      { ...el,
        value: el.value / 1e18,
        valueInDollars: (el.value / 1e18) * dollarRate,
        timeStamp: `${dayjs(el.timeStamp * 1000).fromNow()} - (${dayjs(el.timeStamp * 1000).format('ddd MMM-DD-YYYY H:mm:ss Z')})`,
        fee: (el.gasUsed * el.gasPrice) / 1e18,
        feeInDollars: ((el.gasUsed * el.gasPrice) / 1e18) * dollarRate
      }));
  }

  static async getBtcBalance(address) {
    const options = {
      url: `${SOCHAIN_BASEURL}/get_address_balance/${BITCOIN_NETWORK}/${address}`,
      method: 'GET',
    };
    const utxo = await axios(options);
    const { data } = utxo.data;
    return data;
  }

  static async getCurrentBtcPrice() {
    const options = {
      url: `${BLOCKCHAIN_BASEURL}/ticker?currency=USD`,
      method: 'GET',
    };
    const price = await axios(options);
    const { USD } = price.data;
    return USD.last;
  }

  static async getUTXO(address) {
    // Get unspent transaction outputs
    const options = {
      url: `${SOCHAIN_BASEURL}/get_tx_unspent/${BITCOIN_NETWORK}/${address}`,
      method: 'GET',
    };
    const utxo = await axios(options);
    const { data } = utxo.data;
    return data;
  }

  static async broadcastTranscation(serializedTransaction) {
    // broadcast the transaction to the blockchain through the SoChain node
    const options = {
      url: `${SOCHAIN_BASEURL}/send_tx/${BITCOIN_NETWORK}`,
      method: 'POST',
      data: {
        tx_hex: serializedTransaction
      }
    };
    const result = await axios(options);
    const { data } = result.data;
    return data;
  }

  static async getBtcTxs(address) {
    // Get unspent transaction outputs
    const options = {
      url: `${BLOCKCHAIN_BASEURL}/rawaddr/${address}`,
      method: 'GET',
    };
    const transactions = await axios(options);
    const { txs } = transactions.data;
    return txs;
  }
}

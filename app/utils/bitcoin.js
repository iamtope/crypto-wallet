/* eslint-disable require-jsdoc */
import bip38 from 'bip38';
import wif from 'wif';
import crypto from 'crypto';
import moment from 'moment';
import bitcore from 'bitcore-lib';
import Request from './api';
import constants from './constants';
import db from '../db';
import queries from '../db/queries/users';

const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');

const tx = new bitcore.Transaction();

const {
  FEE
} = constants;

export default class BitcoinHelpers {
  static generateKeyPairs() {
    /* It generates a random address
        and support the retrieval of transactions for that address (via 3PBP)
        */
    const keyPair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    const publicKey = keyPair.publicKey.toString('hex');
    const privateKey = keyPair.toWIF();
    return { address, privateKey, publicKey };
  }

  static async encryptPrivateKey(privateKey) {
    const myWifString = privateKey;
    const decoded = wif.decode(myWifString);
    // what you describe as 'seed'
    const randomBytes = crypto.randomBytes(16); // 128 bits is enough
    // your 12 word phrase
    const mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'));

    const encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, mnemonic);
    return { encryptedKey, mnemonic };
  }

  static async getBtcBalance(address) {
    const balance = await Request.getBtcBalance(address);
    const rate = await Request.getCurrentBtcPrice();
    const bal_usd = balance.confirmed_balance * rate;
    return {
      balance: balance.confirmed_balance,
      balanceInDollars: bal_usd.toFixed(2),
      btcPrice: rate.toFixed(2),
      btcAddress: address
    };
  }

  static async getNewTxInput(address) {
    /* From the unspent outputs, we need to build a new input,
        Our input is going to be equal to the unspent outputs.
        */
    const utxos = await Request.getUTXO(address);

    const inputs = [];
    let totalAmountAvailable = 0;
    let inputCount = 0;
    utxos.txs.forEach(async (item) => {
      const utxo = {};
      utxo.txId = item.txid;
      utxo.outputIndex = item.output_no;
      utxo.address = utxos.address;
      utxo.script = item.script_hex;
      utxo.satoshis = Math.floor(Number(item.value) * 100000000);

      totalAmountAvailable += utxo.satoshis;
      inputCount += 1;
      inputs.push(utxo);
    });
    return { inputs, totalAmountAvailable, inputCount, address: utxos.address };
  }

  static getTransactionFee(inputCount, outputCount) {
    /* average priority fee is about 108 Satoshis/byte,
        size of a transaction depends on the input and output in the transaction.
        */
    const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
    const Fee = FEE * transactionSize;
    return Fee;
  }

  static decryptPrivateKey(encryptedKey, mnemonic) {
    const encrypted_key = encryptedKey;
    const decryptedKey = bip38.decrypt(encrypted_key, mnemonic);
    const decoded = wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed);
    return decoded;
  }

  static async sendBitcoin(fee, newInput, body) {
    const { amount, to } = body;
    const { address, inputs } = newInput;
    const satoshiToSend = amount * 100000000;

    const { private_key, passphrase } = await db.oneOrNone(queries.findUserBtcKey, [address, 'btc']);
    const privateKey = this.decryptPrivateKey(private_key, passphrase);

    const transaction = tx.from(inputs)
      .to(to, satoshiToSend) // send bitcoin using bitcore
      .fee(fee) // manually set transaction fees
      .change(address) // setup the change address to receive the balance
      .sign(privateKey); // sign the transaction with your private key

    // serialize the transaction in order to get the transaction hex
    const serializedTransaction = transaction.serialize();
    // broadcast transaction
    const broadcast = await Request.broadcastTranscation(serializedTransaction);
    await db.none(queries.saveTransaction, [address, to, amount, broadcast.txid]);
    return broadcast.txid;
  }

  static async getBtcTxs(address) {
    const transactions = await Request.getBtcTxs(address);
    const inputs = [];
    transactions.forEach(async (item) => {
      const transaction = {};

      transaction.from = item.inputs[0].prev_out.addr;
      /* eslint-disable no-unused-expressions */
      transaction.to = item.out[item.out.length - 1].addr;
      transaction.time = moment.unix(item.time).format('MMMM Do, YYYY h:mm:ss A');
      transaction.tx_id = item.hash;
      transaction.amount = item.out[item.out.length - 1].value / 100000000;

      inputs.push(transaction);
    });
    return inputs;
  }
}

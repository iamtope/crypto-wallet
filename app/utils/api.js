/* eslint-disable require-jsdoc */

import fetch from 'node-fetch';
import bluebird from 'bluebird';

import constants from './constants';
import db from '../db';
import queries from '../db/queries/api.key';

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

const { CHAINGATE_BASEURL } = constants;

export default class Request {
  static async makeRequest(url, data = {}, method = 'GET') {
    const apiKeys = await db.manyOrNone(getApiKeys);
    let index = 0;
    postOptions.body = JSON.stringify(data);
    const currentKey = apiKeys[index];
    postOptions.headers.Authorization = currentKey.api_key;
    postOptions.method = method;
    let res = await fetch(`${CHAINGATE_BASEURL}${url}`, postOptions);
    res = res.json();
    if (res.status === 403) {
      postOptions.headers.Authorization = currentKey.api_key;
      postOptions.method = method;
      index += 1;
      return Request.makeRequest(url, data, method);
    }
    db.none(updateCallsCount, [+currentKey.no_of_calls + 1, currentKey.id]);
    return res;
  }
}

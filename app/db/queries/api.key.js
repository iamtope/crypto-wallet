export default {
  getApiKeys: 'SELECT * FROM api_key WHERE no_of_calls < 100',
  updateCallsCount: `
    UPDATE api_key
    SET no_of_calls=$1
    WHERE id=$2
  `
};

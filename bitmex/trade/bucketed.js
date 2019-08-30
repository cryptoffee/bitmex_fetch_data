var request = require('request');
var crypto = require('crypto');

module.exports = ({
  apiKey = process.env.BITMEX_API_KEY,
  apiSecret = process.env.BITMEX_API_SECRET,
  binSize = '1m',
  currencyPair = 'XBTUSD',
  reverse='false',
  partial='false',
  count='500',
  startTime,
  endTime
}, cb) => {
  const verb = 'GET';
  const host = 'https://www.bitmex.com';
  const path = `/api/v1/trade/bucketed?binSize=${binSize}&partial=${partial}&symbol=${currencyPair}&reverse=${reverse}&startTime=${startTime}&endTime=${endTime}&count=${count}`;
  const expires = new Date().getTime() + (60 * 1000);

  var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires).digest('hex');
  const requestOptions = {
    headers: {
      'content-type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'api-expires': expires,
      'api-key': apiKey,
      'api-signature': signature
    },
    url: host + path,
    method: verb
  };
  request(requestOptions, function(error, response, body) {
    if (error) { 
      cb(error);
      return;
    }
    const bucketedTrades = JSON.parse(body)
    cb(null, {
      xHeaders: Object.entries(response.headers).filter(([key]) => key.includes('x-')).reduce((acc, [key, value]) => {acc[key] = value; return acc;}, {}),
      bucketedTrades
    });
  });
}
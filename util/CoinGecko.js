
const fetch = require('node-fetch');
const buildUrl = require('build-url');
const SERVER_GINGECKO='https://api.coingecko.com/api/v3';

module.exports = (path, queryParams) => {

let final_url = buildUrl(SERVER_GINGECKO, { path, queryParams })
console.log('final urll',final_url)

  return fetch(final_url)
    .then(r=>r.json())

}
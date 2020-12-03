
const fetch = require('node-fetch');
const SERVER_GINGECKO='https://api.coingecko.com/api/v3/';
//const Reqq=require('./classChat');

module.exports = (url) => {
  
  return fetch(SERVER_GINGECKO + url)
	.then(r=>r.json())
	/*
	.then(dat=>{
	//	console.log(dat)
	  if(dat.error)
		if(dat.error.code=='ERR_WS_INIT_FAILED')
		  createUser(user);
	})
	.catch(e=>{console.log('e de CC create',e)})

*/

}
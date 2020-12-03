const express = require('express');
const router = express.Router();
const dbUsers = require('../database/dbUsers');

router.post('/coins', (req, res)=> {
  let id_coin = req.body.id_coin || 'someCoin'; 
// coins/markets?vs_currency=eur&ids=noexists&per_page=1&sparkline=false
  GO(`coins/markets?vs_currency=${req.who.currency}&ids=${id_coin}&per_page=1`)
  .then(coins=>{
  	console.log('el coin de gecko',coin)
  	if(!coins[0]) res.status(400).send(new RES.e400(400, 'NOT_FOUND', req.lang, id_coin.toUpperCase()));
  	else{
  	/*  let coin = {
  		id_user: req.id,
  		id_coin: coins[0].id,
  		symbol: coins[0].symbol,
  		name: coins[0].name,
  		image: coins[0].image
  	  }
  	 */ 
  	  let coin = (({ id, name, symbol, image })=>({ id_user: req.id, id_coin: id, name, symbol, image }))(coins[0]);
console.log('el coin a db', coin)

  	  dbUsers.addCoin(coin, (e,ok)=>{
  	  	if(e) res.status(500).send(new RES.error(e));
  	  	else if(!ok) res.status(400).send(new RES.e400(400, 'EXISTS', req.lang, id_coin.toUpperCase()))
  	  	else res.status(201).send(new RES.ok(201, coin));
  	  })
  	}
  })
});

router.get('/coins', (req, res)=> {
  let top = req.query.top || req.who.prefer_top || 25;
  let users_coins = new Promise(done=> dbUsers.getCoins(req.id, coins=> done(coins)))

  if(top<1 || top>25) res.status(400).send(new RES.e400(400, 'INVALID_TOP_N', req.lang));
  else users_coins.then(coins=>{
  	if(!coins.length) res.status(400).send(new RES.e400(400, '', req.lang));
  	else{

  	let go=(currency)=> GO(`simple/price?ids=${coins.join()}`)
  	
  	Promise.all([go('usd'), go('ars'), go('eur')])
  	.then()


  })
  	}
 
});

router.get('/coins/:id', (req, res)=> {

});

router.delete('/coins/:id', (req, res)=> {

});

router.put('/', (req,res)=>{
  let edit ={
    id: req.id,
    prefer_top: req.body.prefer_top,
    prefer_currency: req.body.prefer_currency
  }

});

/*
router.get('/', (req, res)=> {
  res.status(404).send(new RES.e400(404,'NOT_FOUND', req.lang || 'es'));
});
*/

module.exports = router;

/*
https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&per_page=1&sparkline=false
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    "current_price": 15882.27,
    "market_cap": 294774840847,
    "market_cap_rank": 1,
    "fully_diluted_valuation": 333505681458,
    "total_volume": 20383146900,
    "high_24h": 16101.3,
    "low_24h": 15636.54,
    "price_change_24h": 245.72,
    "price_change_percentage_24h": 1.57147,
    "market_cap_change_24h": 4366911227,
    "market_cap_change_percentage_24h": 1.50372,
    "circulating_supply": 18561218,
    "total_supply": 21000000,
    "max_supply": 21000000,
    "ath": 16727.68,
    "ath_change_percentage": -5.06022,
    "ath_date": "2017-12-16T00:00:00.000Z",
    "atl": 51.3,
    "atl_change_percentage": 30858.51513,
    "atl_date": "2013-07-05T00:00:00.000Z",
    "roi": null,
    "last_updated": "2020-12-03T17:41:07.833Z"
  }
]
*/
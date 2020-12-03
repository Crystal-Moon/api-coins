const express = require('express');
const router = express.Router();
const dbUsers = require('../database/dbUsers');
const GO = require('../util/GO');
const RES = require('../util/RES');

router.post('/coins', (req, res)=> {
  let id = req.body.id_coin || 'someCoin'; 
  
  GO('coins/markets',{ vs_currency: req.who.prefer_currency, ids: id, per_page: 1 })
  .then(coins=>{
  	if(!coins[0]) res.status(400).send(new RES.e400(400, 'NOT_FOUND', req.lang, id.toUpperCase()));
  	else{
  	  let coin = (({ id, name, symbol, image })=>({ id_user: req.id, id, name, symbol, image }))(coins[0]);

  	  dbUsers.addCoin(coin, (e,ok)=>{
  	  	if(e) res.status(500).send(new RES.error(e));
  	  	else if(!ok) res.status(400).send(new RES.e400(400, 'EXISTS', req.lang, id.toUpperCase()))
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
  	if(!coins.length) res.status(400).send(new RES.e400(400, 'NO_USER_COINS', req.lang));
  	else{
// https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cnoexists%2Cethereum&vs_currencies=usd&include_last_updated_at=true
  	  let go=(currency)=> GO('simple/price', 
  	  	{ ids: coins.map(c=>c.id), vs_currencies: currency, include_last_updated_at: true })
  	
  	  Promise.all([go('ars'), go('usd'), go('eur')])
  	  .then(pp=>{
  //console.log('el data de las tres fetch',pp);

  	  	coins.forEach(c=>{
  	  		console.log('el c en el map',c)
  	  		c.ars_price = pp[0][c.id].ars
  	  		c.usd_price = pp[1][c.id].usd
  	  		c.eur_price = pp[2][c.id].eur
  	  		c.last_update = pp[2][c.id].last_updated_at
  	  	})

  	  	res.status(200).send(new RES.ok(200, coins))
  	  })
  	  .catch(e=> res.status(500).send(new RES.error(e)))
    }
  });
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
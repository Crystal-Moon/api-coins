const express = require('express');
const router = express.Router();
const dbUsers = require('../database/dbUsers');
const CoinGecko = require('../util/CoinGecko');
const RES = require('../util/RES');

router.post('/coins', (req, res)=> {
  let id = req.body.id || 'someCoin'; 
  let currency = req.who.prefer_currency;
  
  CoinGecko.getOneCoin(id, currency)
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
  	else
      CoinGecko.getPrices(coins.map(c=>c.id))
  	  .then(geckoData=>{
        let funcOrder = req.query.order=='asc'? (a,b)=>a.eur_price - b.eur_price : (a,b)=>b.eur_price - a.eur_price;
  	  	
        coins = coins.map(c=> ({ ...c, ...geckoData[c.id] }));
        coins = coins.sort(funcOrder);

  	  	res.status(200).send(new RES.ok(200, coins, 'array'))
  	  })
  	  .catch(e=> res.status(400).send(new RES.e400(400, 'GECKO_ERROR', req.lang, JSON.stringify(e))))
  });
});

router.delete('/coins/:id', (req, res)=> {
  let id = req.params.id;
  dbUsers.deleteCoin(req.id, id);
  res.status(204).send(new RES.ok(204))
});

router.put('/', async(req,res)=>{
  let edit = {
    id: req.id,
    prefer_top: req.body.prefer_top || 10,
    prefer_currency: req.body.prefer_currency || 'usd'
  }

  let bad = await verifyFields(edit, req.lang)
  if(bad) res.status(400).send(new RES.e400(400, 'INPUT_ERROR', req.lang, bad))
  else
    dbUsers.updateUser(edit, (e,ok)=>{
      if(e) res.status(500).send(new RES.error(e))
      else res.status(204).send(new RES.ok(204))
    })
});

module.exports = router;


module.exports = (dbUsers,CoinGecko,verify,RES)=> {

 const { verifyFields } = verify;

 return {
 addCoin: (req, res)=> {
  let id = req.body.id || 'No_exists'; 
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
 },

 getCoins: (req, res)=> {
  let top = req.query.top || req.who.prefer_top || 25;
  let users_coins = new Promise(done=> dbUsers.getCoins(req.id, top, coins=> done(coins)))

  if(top<1 || top>25) res.status(400).send(new RES.e400(400, 'INVALID_TOP_N', req.lang));
  else users_coins.then(coins=>{
  	if(!coins.length) res.status(400).send(new RES.e400(400, 'NO_USER_COINS', req.lang));
  	else
      CoinGecko.getPrices(coins.map(c=>c.id))
  	  .then(geckoData=>{
        let funcOrder = req.query.order=='asc'? (a,b)=>a.eur - b.eur : (a,b)=>b.eur - a.eur;
  	  	
        coins = coins.map(c=> ({ ...c, ...geckoData[c.id] }));
        coins = coins.sort(funcOrder);

  	  	res.status(200).send(new RES.ok(200, coins, 'array'))
  	  })
  	  .catch(e=> res.status(400).send(new RES.e400(400, 'GECKO_ERROR', req.lang, JSON.stringify(e))))
  });
 },

 deleteCoin: (req, res)=> {
  let id = req.params.id;
  dbUsers.deleteCoin(req.id, id);
  res.status(204).send(new RES.ok(204))
 },

 updateUser: async(req,res)=>{
  let edit = {
    id: req.id,
    prefer_top: req.body.prefer_top || 10,
    prefer_currency: req.body.prefer_currency || 'usd'
  }

  let bad = await verifyFields('users',edit, req.lang)
  if(bad) res.status(400).send(new RES.e400(400, 'INPUT_ERROR', req.lang, bad))
  else
    dbUsers.updateUser(edit, (e,ok)=>{
      if(e) res.status(500).send(new RES.error(e))
      else res.status(204).send(new RES.ok(204))
    })
 }
 }
}

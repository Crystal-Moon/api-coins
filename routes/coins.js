
module.exports = (CoinGecko,RES)=> {

 return {
  getAllCoins: (req, res)=> {
    let limit= req.query.limit || 10;
    let page = req.query.page || 1;
    let currency = req.who.prefer_currency;

    if(isNaN(limit) || isNaN(page) || page==0)
  	  res.status(400).send(new RES.e400(400, 'NAN', req.lang, 'LIMIT or PAGE'));
    else
  	  CoinGecko.getAllCoins(currency, page, limit)
  	  .then(coins=>{
  		  res.status(200).send(new RES.ok(200, coins, 'array'));
  	  })
  	  .catch(e=> res.status(400).send(new RES.e400(400, 'GECKO_ERROR', req.lang, JSON.stringify(e))))
  }
 }
}

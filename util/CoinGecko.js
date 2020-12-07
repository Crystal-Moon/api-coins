


module.exports = (fetch, buildUrl)=>{


const SERVER_GINGECKO='https://api.coingecko.com/api/v3';


const GO = (path, queryParams) => {

let final_url = buildUrl(SERVER_GINGECKO, { path, queryParams })
console.log('final urll',final_url)

  return fetch(final_url)
    .then(r=>r.json())

}



return {
	status: ()=> GO('ping'),

	getOneCoin: (id, vs_currency)=> {
		return GO('coins/markets',{ vs_currency, ids: id, per_page: 1 })
	},

	getPrices: (ids)=> {
		return GO('simple/price', { ids, vs_currencies: ['usd','ars','eur'], include_last_updated_at: true })
	},
	
	getAllCoins: (vs_currency, page, per_page)=> {
		return GO('coins/markets', { vs_currency, per_page, page }).then(cc=>
			cc.map(
				({ id, name, symbol, image, current_price, last_updated })=>
				({ id, name, symbol, image, price: current_price, last_updated, currency: vs_currency })
			)
		)
	},

}

}

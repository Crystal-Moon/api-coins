var express = require('express');
var router = express.Router();
const RES=require('../controls/util/plantillaResponse')
const E400= require('../controls/banks/bank400');

router.use((req,res,next)=>{
    
	req.headers['Access-Control-Allow-Origin'] = '*'

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  //res.header('Content-Type', 'application/json;charset=utf-8');
  res.type('application/json');
  res.setTimeout(25000, ()=>{
  //	res.write(JSON.stringify());
  	res.status(503).send(new RES.full(false,503,'object',null,{code:'TIMEOUT',message: E400['TIMEOUT']['en'] }));
  })
  next(); 
      
});

router.options(/.*/,(req,res,next)=>{
  res.status(204).end();
})

module.exports = router;
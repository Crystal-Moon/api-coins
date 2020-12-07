const express = require('express');
const router = express.Router();

router.use((req,res,next)=>{
  req.headers['Access-Control-Allow-Origin'] = '*'
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.type('application/json');

  next();
});

router.options(/.*/,(req,res,next)=>{
  res.status(204).end();
})

module.exports = router;
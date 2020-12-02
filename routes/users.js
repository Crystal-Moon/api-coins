const express = require('express');
const router = express.Router();
const dbUser = require('.,/database/dbUser');

router.post('/coins', (req, res)=> {

});

router.get('/coins', (req, res)=> {

});

router.get('/coins/:id', (req, res)=> {

});

router.delete('/coins/:id', (req, res)=> {

});

router.get('/', (req, res)=> {
  res.status(404).send(new RES.e400(404,'NOT_FOUND', req.lang || 'es'));
});

module.exports = router;

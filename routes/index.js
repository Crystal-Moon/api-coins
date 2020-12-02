const express = require('express');
const router = express.Router();

const { verifyFields } =  require('../util/verify/verify');
const dbUser = require('../database/dbUser');

router.get('/', (req, res)=> {
  res.render('index', { title: 'Api-Coins' });
});

router.post('/create', async(req,res)=> {
  let newUser = {
	  name: req.body.name,
	  last_name: req.body.last_name,
	  username: req.body.last_name,
	  pass: req.body.pass,
	  currency: req.body.currency || 'usd',
	  lang: /(es|en)/.test(req.body.lang)? req.body.lang : 'es'
  }

  let bad = await verifyFields('users', newUser, newUser.lang);
  if(bad) res.status(400).send(new RES.e400(400, 'INPUT_ERROR', newUser.lang, bad))
  else
    dbUser.saveUser(newUser,(e,ok)=> {
      if(e) res.status(500).send(new RES.error(e));
      else if(typeof ok == 'string') res.status(400).send(new RES.e400(400, ok, newUser.lang));
      else{
        newUser.id=ok;
        res.status(200).send(new RES.ok(201, {
          auth: auth.objAuth(newUser),
          profile: newUser
        }));
      }
    })
});

router.post('/login', (req, res)=> {
  let usr = {
    username: req.body.username,
    pass: req.body.pass
  }

  auth.verifyUser(usr,(e,ok)=> {

  });
});


module.exports = router;

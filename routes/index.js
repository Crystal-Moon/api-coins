const express = require('express');
const router = express.Router();

const { verifyFields } =  require('../util/verify/verify');
const dbUsers = require('../database/dbUsers');
const auth = require('../util/verify/auth');
const RES = require('../util/RES');

router.get('/', (req, res)=> {
  res.render('index', { title: 'Api-Coins' });
});

router.post('/create', async(req,res)=> {
  let newUser = {
	  name: req.body.name,
	  last_name: req.body.last_name,
	  username: req.body.username,
	  pass: req.body.pass,
	  prefer_currency: req.body.prefer_currency || 'usd',
    prefer_top: req.body.prefer_top || 25
  }
  let lang = /(es|en)/.test(req.body.lang)? req.body.lang : 'es';

  let bad = await verifyFields('users', newUser, lang);
  if(bad) res.status(400).send(new RES.e400(400, 'INPUT_ERROR', lang, bad))
  else{
    newUser.pass = auth.generateHash(newUser.pass);
    newUser.lang = lang;

    dbUsers.authUser(newUser.username,(e,user)=> {
    if(e) res.status(500).send(new RES.error(e));
    else if(user) res.status(400).send(new RES.e400(400, 'EXISTS', lang, newUser.username ));
    else
      dbUsers.saveUser(newUser,(e,ok)=>{
        newUser.id=ok;
        res.status(200).send(new RES.ok(201, { auth: auth.objAuth(newUser), profile: newUser }));
      })
    })
  }
});

router.post('/login', (req, res)=> {
  let usr = {
    username: req.body.username,
    pass: req.body.pass
  }
  let lang = /(es|en)/.test(req.query.lang)? req.query.lang : 'es';

  auth.verifyUser(usr, (e, login, user)=> {
    if(e) res.status(500).send(new RES.error(e));
    else if(!login) res.status(400).send(new RES.e400(400, 'BAD_LOGIN', lang));
    else if(typeof login == 'string') res.status(400).send(new RES.e400(400, login, lang));
    else{
      let { pass, ...profile } = user;
      res.status(200).send(new RES.ok(201, { auth: auth.objAuth(login), profile }));
    }
  });
});


module.exports = router;

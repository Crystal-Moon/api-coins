
module.exports = (dbUsers,auth,verify,RES)=> {

 const { verifyFields } = verify;

 return {
  index: (req, res)=> {
    res.type('text/html');
    res.render('index', { title: 'Api-Coins' });
  },

  create: async(req,res)=> {
    let newUser = {
	    name: req.body.name,
	    last_name: req.body.last_name,
	    username: req.body.username,
	    pass: req.body.pass,
	    prefer_currency: req.body.prefer_currency || 'usd',
      prefer_top: req.body.prefer_top || 10
    }
    let lang = /(es|en)/.test(req.body.lang)? req.body.lang : 'es';

    let bad = await verifyFields('users', newUser, lang);
    if(bad) res.status(400).send(new RES.e400(400, 'INPUT_ERROR', lang, bad))
    else{
      newUser.pass = auth.generateHash(newUser.pass);
      newUser.lang = lang;

      dbUsers.authUser(newUser,(e,user)=> {
      if(e) res.status(500).send(new RES.error(e));
      else if(user) res.status(400).send(new RES.e400(400, 'EXISTS', lang, newUser.username ));
      else
        dbUsers.saveUser(newUser,(e,ok)=>{
          newUser.id=ok;
          res.status(200).send(new RES.ok(201, { auth: auth.objAuth(newUser), profile: newUser }));
        })
      })
    }
  },

  login: (req, res)=> {
    let usr = {
      username: req.body.username,
      pass: req.body.pass
    }
    let lang = /(es|en)/.test(req.query.lang)? req.query.lang : 'es';

    auth.verifyUser(usr, (e, auth, user)=> {
      if(e) res.status(500).send(new RES.error(e));
      else if(!auth) res.status(400).send(new RES.e400(400, 'BAD_LOGIN', lang));
      else if(typeof auth == 'string') res.status(400).send(new RES.e400(400, auth, lang));
      else{
        let { pass, ...profile } = user;
        res.status(200).send(new RES.ok(201, { auth, profile }));
      }
    });
  }
 }
}
